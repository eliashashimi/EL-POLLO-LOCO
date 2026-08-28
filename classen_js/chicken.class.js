import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {
    y = 410;
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
            this.playAnimation(ImageHub.CHICKEN.walk);
        }, 1000 / 10);
    }
}
