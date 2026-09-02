import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {
    width = 80;
    height = 60;
    offset = {
        top: 7,
        right: 7,
        bottom: 5,
        left: 7,
    };

    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);
        this.loadImages(ImageHub.CHICKEN.walk);
        this.y = 410;
        this.x = 2000 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            this.playAnimation(ImageHub.CHICKEN.walk);
        }, 1000 / 10);
    }
}
