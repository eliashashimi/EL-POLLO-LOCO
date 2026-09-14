import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Smaller chicken enemy with reduced dimensions.
 * @extends MoveableObject
 */
export class SmallChicken extends MoveableObject {
    y = 420;
    width = 60;
    height = 60;
    animationInterval;
    offset = {
        top: 7,
        right: 7,
        bottom: 5,
        left: 7,
    };

    /** Creates a small chicken at a random position in the level. */
    constructor() {
        super().loadImage(ImageHub.SMALLCHICKEN.walk[0]);
        this.loadImages(ImageHub.SMALLCHICKEN.walk);
        this.x = 500 + Math.random() * 2700;
        this.speed = 0.15 + Math.random() * 0.25;
        this.getRealFrame();
        this.animate();
    }

    /** Starts movement and animation intervals for the small chicken. */
    animate() {
        this.moveLeft();

        this.animationInterval = IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            if (!this.isDeadEnemy) {
                this.playAnimation(ImageHub.SMALLCHICKEN.walk);
            } else {
                IntervalHub.stopInterval(this.animationInterval);
            }
        }, 1000 / 10);
    }
}
