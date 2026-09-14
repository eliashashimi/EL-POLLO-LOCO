import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Standard chicken enemy that walks left and cycles through walk frames.
 * @extends MoveableObject
 */
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

    /** Creates a chicken at a random position in the level. */
    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);
        this.loadImages(ImageHub.CHICKEN.walk);
        this.y = 410;
        this.x = 500 + Math.random() * 2700;
        this.speed = 0.15 + Math.random() * 0.25;
        this.getRealFrame();
        this.animate();
    }

    /** Starts movement and animation intervals for the chicken. */
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
