import { ImageHub } from "./ImageHub.class.js";
import { IntervalHub } from "./IntervalHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Chicken extends MoveableObject {
    y = 420;
    width = 80;
    height = 60;
    Images_Walking = [ImageHub.CHICKEN.walk[0], ImageHub.CHICKEN.walk[1], ImageHub.CHICKEN.walk[2]];
    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);
        this.loadImages(this.Images_Walking);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.2;

        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            let i = this.currentImage % this.Images_Walking.length;
            let path = this.Images_Walking[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000);
    }

    moveLeft() {}
}
