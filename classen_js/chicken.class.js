import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {
    y = 420;
    width = 80;
    height = 60;

    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);
        this.loadImages(ImageHub.CHICKEN.walk);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            const i = this.currentImage % ImageHub.CHICKEN.walk.length;
            let path = ImageHub.CHICKEN.walk[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000 / 10);
    }
}
