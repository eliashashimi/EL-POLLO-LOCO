import { addLevel1 } from "../levels/level1.js";
import { AudioHub } from "./audio-hub.class.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { CollectableBottles } from "./collectable-bottles.class.js";
import { CollectableCoins } from "./collectable-coins.class.js";
import { Endboss } from "./endboss.class.js";
import { ImageHub } from "./image-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { Statusbar } from "./statusbar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

/**
 * Coordinates the game level, player, collisions, rendering, collectibles,
 * projectiles, camera movement, and status bars.
 * @class
 */
export class World {
    level;
    character;
    endboss;
    static canvas;
    ctx;
    static camera_x = 0;
    coins = 0;
    bottles = 0;
    collectableCoins;
    collectableBottles;
    statusbarHealth = new Statusbar("health", 20, 0, 100);
    statusbarCoins = new Statusbar("coins", 20, 40, 0);
    statusbarBottles = new Statusbar("bottles", 20, 80, 0);
    statusbarEndboss = new Statusbar("endBoss", 700, 0, 100);
    statusbar = {};
    throwableObjects = [];
    isThrowing = false;
    maxWitdh;
    maxCameraPos;

    /**
     * Creates a game world and starts its render and update loops.
     * @param {HTMLCanvasElement} canvas Canvas used for rendering the game.
     */
    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.level = addLevel1();
        this.character = new Character(this);
        this.endboss = this.level.endboss;
        if (this.endboss) this.endboss.world = this;
        this.maxWidth = this.level.step + World.canvas.width;
        this.maxCameraPos = -this.maxWidth - World.canvas.width;
        this.collectableCoins = this.level.collectableCoins;
        this.collectableBottles = this.level.collectableBottles;
        this.draw();
        this.run();
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }

    /** Starts the recurring collision and projectile checks. */
    run() {
        setInterval(() => {
            if (window.isGamePaused) return;
            this.setRealFrames();
            this.checkCollisions();
        }, 1000 / 60);
        setInterval(() => {
            if (window.isGamePaused) return;
            this.checkThrowableObjects();
        }, 1000 / 5);
    }

    /** Creates a projectile when the current input and player state allow it. */
    checkThrowableObjects() {
        if (!this.canThrowBottle()) return;
        this.throwBottle();
    }

    /**
     * Determines whether the player can throw a bottle at this moment.
     * @returns {boolean} Whether a bottle may be thrown.
     */
    canThrowBottle() {
        return (
            Keyboard.Space &&
            this.bottles > 0 &&
            !this.character.isDead() &&
            !window.isGameOver &&
            !this.isThrowing &&
            !this.character.isAboveGround()
        );
    }

    /** Removes one bottle from the inventory and creates its projectile. */
    throwBottle() {
        this.isThrowing = true;
        const x = this.character.otherDirection ? this.character.x - 10 : this.character.x + 100;
        const bottle = new ThrowableObject(x, this.character.y + 150, this.character.otherDirection);
        this.throwableObjects.push(bottle);
        this.character.lastMove = new Date().getTime();
        this.bottles--;
        this.statusbarBottles.setPercentage(this.bottles * 10);
    }

    /** Runs all player, enemy, collectible, and projectile collision checks. */
    checkCollisions() {
        this.checkCollisionEnemy();
        this.checkCollisionEndboss();
        this.checkCollisionCoins();
        this.checkCollisionBottles();
        this.checkBottleHitEndboss();
        this.checkBottleHitEnemy();
        this.bottlesCollisionEnemy();
    }

    /** Resolves projectile collisions and removes completed projectiles. */
    bottlesCollisionEnemy() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.bottleSplashed) return;

            this.level.chickens.forEach((enemy) => {
                this.checkBottleHitEnemy(enemy, bottle);
            });
            if (this.endboss && !bottle.bottleSplashed) this.checkBottleHitEndboss(this.endboss, bottle);
        });
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.throwBottleRemoved);
        if (this.throwableObjects.length === 0 || this.throwableObjects.every((b) => b.bottleSplashed)) {
            this.isThrowing = false;
        }
    }

    /**
     * Applies a projectile hit to a normal or small chicken.
     * @param {Chicken|SmallChicken} enemy Enemy that may be hit.
     * @param {ThrowableObject} bottle Projectile being tested.
     */
    checkBottleHitEnemy(enemy, bottle) {
        if (!bottle || !enemy || enemy.isDeadEnemy) return;

        if (bottle.isColliding(enemy) && (enemy instanceof Chicken || enemy instanceof SmallChicken)) {
            let deadImg = enemy instanceof Chicken ? ImageHub.CHICKEN.dead : ImageHub.SMALLCHICKEN.dead;
            enemy.killEnemy(deadImg);
            enemy instanceof Chicken ? AudioHub.PLAY_ONE(AudioHub.CHICKEN_DEAD) : AudioHub.PLAY_ONE(AudioHub.SMALL_CHICKEN_DEAD);
            bottle.splash();
            AudioHub.PLAY_ONE(AudioHub.BOTTLE_BREAK);
            setTimeout(() => {
                this.level.chickens = this.level.chickens.filter((enemyDead) => enemyDead !== enemy);
            }, 250);
        }
    }

    /**
     * Applies projectile damage to the endboss and triggers the win screen.
     * @param {Endboss} enemy Endboss that may be hit.
     * @param {ThrowableObject} bottle Projectile being tested.
     */
    checkBottleHitEndboss(enemy, bottle) {
        if (enemy instanceof Endboss && enemy.isColliding(bottle) && !bottle.bottleSplashed) {
            enemy.hit(20);
            bottle.splash();
            AudioHub.PLAY_ONE(AudioHub.BOTTLE_BREAK);
            this.statusbarEndboss.setPercentage(enemy.energy);
            if (enemy.isDead()) {
                setTimeout(() => {
                    window.showGameWin();
                }, 1500);
            }
        }
    }

    /** Applies contact damage from the endboss to the player. */
    checkCollisionEndboss() {
        if (!this.endboss || window.isGamePaused || window.isGameOver) return;
        if (this.endboss.isDead && this.endboss.isDead()) return;

        if (this.character.isColliding(this.endboss) && !this.character.isImmuneAfterKill) {
            if (!this.character.isHurt() && !this.character.isDead()) {
                this.character.hit();
                this.statusbarHealth.setPercentage(this.character.energy);
                AudioHub.PLAY_ONE(AudioHub.PEPE_DAMAGE);
            }
        }
    }

    /** Checks contact between the player and every living chicken. */
    checkCollisionEnemy() {
        if (window.isGamePaused || window.isGameOver) return;
        this.level.chickens.forEach((enemy) => {
            if (enemy.isDeadEnemy || enemy.energy === 0) return;

            if (this.character.isColliding(enemy)) {
                this.handleEnemyCollisionType(enemy);
            }
        });
    }

    /**
     * Distinguishes a jump attack from damaging contact with an enemy.
     * @param {Chicken|SmallChicken} enemy Enemy involved in the collision.
     */
    handleEnemyCollisionType(enemy) {
        if (this.character.isAboveGround() && this.character.speedY < 0) {
            this.executeEnemyDead(enemy);
        } else if (!this.character.isHurt() && !this.character.isDead() && !this.character.isImmuneAfterKill) {
            this.executePepeDamage();
        }
    }

    /**
     * Defeats an enemy hit from above and briefly protects the player.
     * @param {Chicken|SmallChicken} enemy Enemy defeated by the player.
     */
    executeEnemyDead(enemy) {
        this.character.isImmuneAfterKill = true;
        // enemy.isDeadEnemy = true;
        enemy.energy = 0;

        const deadImg = enemy instanceof Chicken ? ImageHub.CHICKEN.dead : ImageHub.SMALLCHICKEN.dead;
        enemy.killEnemy(deadImg);
        enemy instanceof Chicken ? AudioHub.PLAY_ONE(AudioHub.CHICKEN_DEAD) : AudioHub.PLAY_ONE(AudioHub.SMALL_CHICKEN_DEAD);

        this.character.bounce();
        setTimeout(() => {
            const index = this.level.chickens.indexOf(enemy);
            this.level.chickens.splice(index, 1);
            this.character.isImmuneAfterKill = false;
        }, 200);
    }

    /** Applies contact damage to the player and updates its health bar. */
    executePepeDamage() {
        this.character.hit();
        this.statusbarHealth.setPercentage(this.character.energy);
        AudioHub.PLAY_ONE(AudioHub.PEPE_DAMAGE);
    }

    /** Collects coins touched by the player and updates the coin bar. */
    checkCollisionCoins() {
        this.level.collectableCoins.forEach((coins, index) => {
            if (this.character.isColliding(coins)) {
                this.coins++;
                this.level.collectableCoins.splice(index, 1);
                this.statusbarCoins.setPercentage(Math.round(this.coins * 3.33));
                AudioHub.PLAY_ONE(AudioHub.COLLECT_COIN);
            }
        });
    }

    /** Collects bottles touched by the player and updates the bottle bar. */
    checkCollisionBottles() {
        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles++;
                this.level.collectableBottles.splice(index, 1);
                this.statusbarBottles.setPercentage(this.bottles * 10);
                AudioHub.PLAY_ONE(AudioHub.COLLECT_BOTTLE);
            }
        });
    }

    /** Draws one frame, updates the camera, and schedules the next frame. */
    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);
        if (this.character) World.camera_x = -this.character.x + 100;
        if (World.camera_x > 0) World.camera_x = 0;
        if (World.camera_x < this.maxCameraPos) World.camera_x = this.maxCameraPos;
        this.drawWorld();
        this.drawStatusbars();
        requestAnimationFrame(() => this.draw());
    }

    /** Draws world objects within the current camera transform. */
    drawWorld() {
        this.ctx.translate(World.camera_x, 0);
        this.drawObjects();
        this.ctx.translate(-World.camera_x, 0);
    }

    /** Draws all status bars without applying the world camera transform. */
    drawStatusbars() {
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoins);
        this.addToMap(this.statusbarBottles);
        this.addToMap(this.statusbarEndboss);
    }

    /** Refreshes collision frames for all active game objects. */
    setRealFrames() {
        this.character.getRealFrame();
        this.endboss.getRealFrame();
        this.level.chickens.forEach((enemy) => enemy.getRealFrame());
        this.level.collectableBottles.forEach((bottle) => bottle.getRealFrame());
        this.level.collectableCoins.forEach((coin) => coin.getRealFrame());
        this.throwableObjects.forEach((bottle) => bottle.getRealFrame());
    }

    /** Draws backgrounds, actors, collectibles, projectiles, and the boss. */
    drawObjects() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.chickens);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.collectableBottles);
        this.addObjectsToMap(this.level.collectableCoins);
        this.character.draw(this.ctx);
        this.endboss.draw(this.ctx);
    }

    /**
     * Draws each object in a collection using the world rendering context.
     * @param {DrawableObject[]} objects Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach((object) => object.draw(this.ctx));
    }

    /**
     * Draws one object while handling horizontal mirroring.
     * @param {DrawableObject} mo Object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Temporarily mirrors an object's canvas coordinate system.
     * @param {DrawableObject} mo Object being mirrored.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /** Restores the coordinates after drawing a mirrored object. */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
