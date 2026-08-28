import { addLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";

export class World {
    level;
    character = new Character();
    chickens;
    clouds;
    backgroundObjects;
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

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.chickens);
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
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}
