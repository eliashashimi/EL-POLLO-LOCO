import { addLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
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
    camera_x = 0;
    statusbarHealth = new StatusbarHealth();
    statusbarCoin = new StatusbarCoin();
    statusbarBottle = new StatusbarBottle();
    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.level = addLevel1();
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
        if (Keyboard.Space) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.chickens.forEach((enemy, index) => {
            if (this.character.isColliding(enemy, index)) {
                this.character.hit();
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);

        this.ctx.translate(World.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.chickens);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        this.character.drawFrame(this.ctx);
        this.character.getRealFrame();
        this.character.drawRealFrame(this.ctx);

        this.ctx.translate(-World.camera_x, 0);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.statusbarBottle);
        this.ctx.translate(World.camera_x, 0);

        this.ctx.translate(-World.camera_x, 0);
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

        if (mo instanceof Character || mo instanceof Chicken || mo instanceof SmallChicken || mo instanceof Endboss) {
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
