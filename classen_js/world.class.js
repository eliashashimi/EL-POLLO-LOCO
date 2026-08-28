import { addLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Endboss } from "./endboss.class.js";

export class World {
    level;
    character = new Character();
    static canvas;
    ctx;
    camera_x = 0;
    // statusBar = new this.statusBar();
    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.level = addLevel1();
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);
        this.ctx.translate(World.camera_x, 0);
        this.addObjectsToMap(this.level.chickens);
        this.addToMap(this.character);
        this.character.drawFrame(this.ctx);
        this.character.getRealFrame();
        this.character.drawRealFrame(this.ctx);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
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
        if (mo instanceof Character || mo instanceof Chicken || mo instanceof Endboss) {
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
