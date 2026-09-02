import { addLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { CollectableBottles } from "./collectable-bottles.class.js";
import { CollectableCoins } from "./collectable-coins.class.js";
import { Endboss } from "./endboss.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { StatusbarBottle } from "./statusbar-bottle.class.js";
import { StatusbarCoin } from "./statusbar-coin.class.js";
import { StatusbarHealth } from "./statusbar-health.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

export class World {
    level;
    character = new Character();
    chickens = addLevel1.chickens;
    static canvas;
    ctx;
    static camera_x = 0;
    statusbarHealth = new StatusbarHealth();
    statusbarCoin = new StatusbarCoin();
    statusbarBottle = new StatusbarBottle();
    collectableCoins = addLevel1.collectableCoin;
    addedCoins = [];
    collectableBottles = addLevel1.collectableBottles;
    throwableObjects = [];
    maxWitdh;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.level = addLevel1();
        this.maxWidth = this.level.step + World.canvas.width;
        this.maxCameraPos = -this.maxWidth - World.canvas.width;
        this.collectableCoins = this.level.collectableCoins;
        this.collectableBottles = this.level.collectableBottles;
        this.draw();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowableObjects();
        }, 1000 / 5);
    }

    checkThrowableObjects() {
        if (Keyboard.Space && !this.character.otherDirection) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.checkCollisionEnemy();
        this.checkCollisionCoins();
        this.checkCollisionBottles();
    }

    checkCollisionEnemy() {
        this.level.chickens.forEach((enemy, index) => {
            if (this.character.isColliding(enemy, index)) {
                this.character.hit();
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionCoins() {
        this.level.collectableCoins.forEach((coins, index) => {
            if (this.character.isColliding(coins)) {
                this.coinsCollected(coins, index);
            }
        });
    }

    coinsCollected(coins, index) {
        console.log(coins);

        this.character.addCoin;
        this.addedCoins.push({ coin: coins, index: index });
        this.level.collectableCoins.splice(index, 1);
        this.statusbarCoin.setPercentageCoins(this.character.addCoin);
    }

    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);
        if (World.camera_x > 0) World.camera_x = 0;
        if (World.camera_x < this.maxCameraPos) World.camera_x = this.maxCameraPos;
        this.ctx.translate(World.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.chickens);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.collectableCoins);
        this.addObjectsToMap(this.collectableBottles);
        this.character.drawFrame(this.ctx);
        this.character.getRealFrame();
        this.character.drawRealFrame(this.ctx);
        this.ctx.translate(-World.camera_x, 0);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarBottle);
        this.addToMap(this.statusbarCoin);
        // Durch das requestAnimation wird die Draw Methode immer wieder aufgerufen
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
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
            mo instanceof CollectableBottles
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
