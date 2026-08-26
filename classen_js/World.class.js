import { BackgroundObject } from "./Background-Object.class.js";
import { Character } from "./Character.class.js ";
import { Chicken } from "./Chicken.class.js";
import { Cloud } from "./cloud.class.js";
import { ImageHub } from "./ImageHub.class.js";

export class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgroundObjects = [
        new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0]),
        new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[0]),
        new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[1]),
        new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[2]),
    ];
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    // statusBar = new this.statusBar();
    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);

        // Durch das requestAnimation wird die Draw Methode immer wieder aufgerufen
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach((o) => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.height, mo.width);
        // console.log(mo, mo.img, mo.x, mo.y, mo.height, mo.width);
    }
}
