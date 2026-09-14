import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Rotating coin that can be collected by the player.
 * @extends MoveableObject
 */
export class CollectableCoins extends MoveableObject {
    x;
    y;
    height = 150;
    width = 150;
    offset = {
        left: 50,
        top: 60,
        right: 50,
        bottom: 60,
    };

    /** @param {number} x Horizontal position. @param {number} y Vertical position. */
    constructor(x, y) {
        super().loadImage(ImageHub.COINS.coins[0]);
        this.loadImages(ImageHub.COINS.coins);
        this.x = x;
        this.y = y;
        this.getRealFrame();
        this.animate();
    }

    /** Starts the coin rotation animation. */
    animate() {
        setInterval(() => {
            if (window.isGamePaused) return;
            this.playAnimation(ImageHub.COINS.coins);
        }, 1000 / 3);
    }
}
