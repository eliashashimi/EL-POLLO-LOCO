import { ImageHub } from "./ImageHub.class.js";
import { IntervalHub } from "./IntervalHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Character extends MoveableObject {
    x = 100;
    y = 150;
    width = 200;
    height = 350;
    Images_Walking = [
        ImageHub.PEPE.walk[0],
        ImageHub.PEPE.walk[1],
        ImageHub.PEPE.walk[2],
        ImageHub.PEPE.walk[3],
        ImageHub.PEPE.walk[4],
        ImageHub.PEPE.walk[5],
    ];
    constructor() {
        super();
        this.loadImage(ImageHub.PEPE.idle[0]);
        this.loadImages(this.Images_Walking);

        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            let i = this.currentImage % this.Images_Walking.length;
            let path = this.Images_Walking[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000);
    }

    jump() {}
}
