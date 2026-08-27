import { Character } from "./character.class.js";
import { Chicken } from "./chicken.class.js";
import { Cloud } from "./cloud.class.js";
import { ImageHub } from "./image-hub.class.js";

export class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    static canvas;
    backgroundObjects;

    ctx;
    camera_x = 0;
    // statusBar = new this.statusBar();
    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        World.canvas = canvas;
        this.backgroundObjects = [
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0]),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[0]),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[1]),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[2]),
        ];
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, World.canvas.width, World.canvas.height);

        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);
        this.ctx.translate(-this.camera_x, 0);

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
