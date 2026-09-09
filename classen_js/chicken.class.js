import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {
    width = 80;
    height = 70;
    animationInterval;
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
        this.x = 300 + Math.random() * 2700;
        this.speed = 0.15 + Math.random() * 0.25;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        this.moveLeft();

        this.animationInterval = IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            if (!this.isDeadEnemy) {
                this.playAnimation(ImageHub.CHICKEN.walk);
            } else {
                IntervalHub.stopInterval(this.animationInterval);
            }
        }, 1000 / 10);
    }
}
