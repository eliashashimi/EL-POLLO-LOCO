import { MoveableObject } from "./moveable-object.class.js";

/** A slowly moving cloud layer in the level background.
 * @extends MoveableObject
 */
export class Cloud extends MoveableObject {
    x;
    y = 0;
    height = 540;
    width = 960;

    /** @param {string} img Cloud image path. @param {number} x Horizontal position. */
    constructor(img, x) {
        super().loadImage(img);
        this.x = x;
        this.animate();
    }

    /** Starts cloud movement and wraps it after it leaves the viewport. */
    animate() {
        this.moveLeft();
        setInterval(() => {
            if (this.x <= -this.width) this.x = this.width * 4;
        }, 1000 / 15);
    }
}
