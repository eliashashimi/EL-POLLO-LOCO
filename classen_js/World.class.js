import { Character } from "./Character.class.js ";
import { ImageHub } from "./ImageHub.class.js";

export class World {
    character;
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    // statusBar = new this.statusBar();
    throwableObjects = [];

    constructor(canvas) {
        this.character = new Character();
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.drawImage(ImageHub.PEPE.longIdle[0], this.character.x, this.character.y, this.character.height, this.character.width);

        this.enemies.forEach((enemy) => {
            this.ctx.drawImage(ImageHub.CHICKEN.walk[0], enemy.x, enemy.y, enemy.height, enemy.width);
        });

        requestAnimationFrame(() => this.draw());
    }
}
