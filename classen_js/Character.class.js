import { ImageHub } from "./ImageHub.class.js";
import { IntervalHub } from "./IntervalHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Character extends MoveableObject {
    x = 100;
    y = 150;
    width = 200;
    height = 350;

    constructor() {
        super();
        this.loadImage(ImageHub.PEPE.idle[0]);
        this.loadImages(ImageHub.PEPE.walk);

        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            const i = this.currentImage % ImageHub.PEPE.walk.length;
            let path = ImageHub.PEPE.walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 12);
    }

    jump() {}
}
