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

export class World {
    level;
    character;
    endboss;
    static canvas;
    ctx;
    static camera_x = 0;
    coins = 0;
    bottles = 0;
    collectableCoins = addLevel1.collectableCoins;
    collectableBottles = addLevel1.collectableBottles;
    statusbarHealth = new Statusbar("health", 20, 0, 100);
    statusbarCoins = new Statusbar("coins", 20, 40, 0);
    statusbarBottles = new Statusbar("bottles", 20, 80, 0);
    statusbarEndboss = new Statusbar("endBoss", 700, 0, 100);
    statusbar = {};
    throwableObjects = [];
    maxWitdh;
    maxEnd;
    maxCameraPos;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.level = addLevel1();
        this.character = new Character(this);
        this.chickens = this.level.chickens;
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

    checkThrowableObjects() {
        if (Keyboard.Space && this.bottles > 0 && !this.character.isDead()) {
            const x = this.character.otherDirection ? this.character.x - 10 : this.character.x + 100;
            let bottle = new ThrowableObject(x, this.character.y + 150, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.bottles--;
            this.statusbarBottles.setPercentage(this.bottles * 20);
        }
    }

    checkCollisions() {
        this.checkCollisionEnemy();
        this.checkCollisionEndboss();
        this.checkCollisionCoins();
        this.checkCollisionBottles();
        this.checkBottleHitEndboss();
        this.checkBottleHitEnemy();
        this.bottlesCollisionEnemy();
    }

    bottlesCollisionEnemy() {
        this.throwableObjects.forEach((bottle) => {
            if (bottle.bottleSplashed) return;

            this.level.chickens.forEach((enemy) => {
                this.checkBottleHitEnemy(enemy, bottle);
            });
            if (this.endboss) this.checkBottleHitEndboss(this.endboss, bottle);
        });
        this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.throwBottleRemoved);
    }

    checkBottleHitEnemy(enemy, bottle) {
        if (!bottle && !enemy) return;

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

    checkBottleHitEndboss(enemy, bottle) {
        if (enemy instanceof Endboss && enemy.isColliding(bottle) && !bottle.bottleSplashed) {
            enemy.hit(20);
            bottle.splash();
            AudioHub.PLAY_ONE(AudioHub.BOTTLE_BREAK);
            this.statusbarEndboss.setPercentage(enemy.energy);
            if (enemy.isDead && enemy.isDead())
                setTimeout(() => {
                    window.showGameWin();
                });
        }
    }

    checkCollisionEndboss() {
        if (this.endboss && !this.character.isImmuneAfterKill) {
            if (this.character.isColliding(this.endboss)) {
                if (!this.character.isHurt() && !this.character.isDead()) {
                    this.character.hit();
                    this.statusbarHealth.setPercentage(this.character.energy);
                    AudioHub.PLAY_ONE(AudioHub.PEPE_DAMAGE);
                }
            }
        }
    }

    checkCollisionEnemy() {
        this.level.chickens.forEach((enemy, index) => {
            if (enemy.isDeadEnemy) return;

            if (this.character.isColliding(enemy)) {
                if (this.character.isAboveGround() && this.character.speedY < 0) {
                    const deadImg = enemy instanceof Chicken ? ImageHub.CHICKEN.dead : ImageHub.SMALLCHICKEN.dead;
                    enemy.killEnemy(deadImg);
                    enemy instanceof Chicken ? AudioHub.PLAY_ONE(AudioHub.CHICKEN_DEAD) : AudioHub.PLAY_ONE(AudioHub.SMALL_CHICKEN_DEAD);
                    this.character.bounce();
                    this.character.isImmuneAfterKill = true;
                    setTimeout(() => {
                        this.level.chickens.splice(index, 1);
                        this.character.isImmuneAfterKill = false;
                    }, 200);
                } else if (!this.character.isHurt() && !this.character.isDead()) {
                    this.character.hit();
                    this.statusbarHealth.setPercentage(this.character.energy);
                    AudioHub.PLAY_ONE(AudioHub.PEPE_DAMAGE);
                }
            }
        });
    }

    checkCollisionCoins() {
        this.level.collectableCoins.forEach((coins, index) => {
            if (this.character.isColliding(coins)) {
                this.coins++;
                this.level.collectableCoins.splice(index, 1);
                this.statusbarCoins.setPercentage(this.coins * 10);
                AudioHub.PLAY_ONE(AudioHub.COLLECT_COIN);
            }
        });
    }

    checkCollisionBottles() {
        this.level.collectableBottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                this.bottles++;
                this.level.collectableBottles.splice(index, 1);
                this.statusbarBottles.setPercentage(this.bottles * 20);
                AudioHub.PLAY_ONE(AudioHub.COLLECT_BOTTLE);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);
        if (this.character) World.camera_x = -this.character.x + 100;
        if (World.camera_x > 0) World.camera_x = 0;
        if (World.camera_x < this.maxCameraPos) World.camera_x = this.maxCameraPos;

        this.ctx.translate(World.camera_x, 0);
        this.drawObjects();
        this.drawFrames();
        // this.drawOffsetFrames();
        this.ctx.translate(-World.camera_x, 0);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoins);
        this.addToMap(this.statusbarBottles);
        this.addToMap(this.statusbarEndboss);

        requestAnimationFrame(() => this.draw());
    }

    setRealFrames() {
        this.character.getRealFrame();
        this.endboss.getRealFrame();
        this.level.chickens.forEach((enemy) => enemy.getRealFrame());
        this.level.collectableBottles.forEach((bottle) => bottle.getRealFrame());
        this.level.collectableCoins.forEach((coin) => coin.getRealFrame());
        this.throwableObjects.forEach((bottle) => bottle.getRealFrame());
    }

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

    drawFrames() {
        this.character.drawFrame(this.ctx);
        this.endboss.drawFrame(this.ctx);
        this.level.chickens.forEach((enemy) => enemy.drawFrame(this.ctx));
        this.level.collectableBottles.forEach((bottle) => bottle.drawFrame(this.ctx));
        this.level.collectableCoins.forEach((coin) => coin.drawFrame(this.ctx));
    }

    drawOffsetFrames() {
        this.character.drawOffsetFrame(this.ctx);
        this.endboss.drawOffsetFrame(this.ctx);
        this.level.chickens.forEach((enemy) => enemy.drawOffsetFrame(this.ctx));
        this.level.collectableBottles.forEach((bottle) => bottle.drawOffsetFrame(this.ctx));
        this.level.collectableCoins.forEach((coin) => coin.drawOffsetFrame(this.ctx));
    }

    addObjectsToMap(objects) {
        objects.forEach((object) => object.draw(this.ctx));
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);

        if (
            mo instanceof Character ||
            mo instanceof Chicken ||
            mo instanceof SmallChicken ||
            mo instanceof Endboss ||
            mo instanceof CollectableCoins ||
            mo instanceof CollectableBottles ||
            mo instanceof ThrowableObject
        ) {
            mo.drawFrame(this.ctx);
            mo.getRealFrame();
            mo.drawRealFrame(this.ctx);
        }

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
