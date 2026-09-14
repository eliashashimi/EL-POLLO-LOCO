import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Salsa bottle collectible that cycles through ground images.
 * @extends MoveableObject
 */
export class CollectableBottles extends MoveableObject {
    height = 80;
    width = 80;
    x;
    y = 400;

    offset = {
        left: 40,
        top: 20,
        right: 40,
        bottom: 30,
    };

    /** @param {number} x Horizontal position of the bottle. */
    constructor(x) {
        super().loadImage(ImageHub.SALSA_BOTTLE.onground[0]);
        this.loadImages(ImageHub.SALSA_BOTTLE.onground);
        this.x = x;
        this.getRealFrame();
        this.animate();
    }

    /** Starts the bottle animation. */
    animate() {
        setInterval(() => {
            if (window.isGamePaused) return;
            this.playAnimation(ImageHub.SALSA_BOTTLE.onground);
        }, 1000 / 3);
    }
}
