import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** A thrown salsa bottle with flight, rotation, splash, and removal states.
 * @extends MoveableObject
 */
export class ThrowableObject extends MoveableObject {
    throwBottleAir = true;
    throwBottleCount = 0;
    throwBottleRemoved = false;
    bottleSplashed = false;
    bottleSplashStart = false;
    bottleSplashedEnd = false;
    bottleContact = false;

    height = 60;
    width = 60;

    offset = {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20,
    };
    /** @param {number} x Start position. @param {number} y Start height. @param {boolean} direction Whether it faces left. */
    constructor(x, y, direction) {
        super().loadImage(ImageHub.SALSA_BOTTLE.salsaBottle[0]);
        this.loadImages(ImageHub.SALSA_BOTTLE.onground);
        this.loadImages(ImageHub.SALSA_BOTTLE.rotation);
        this.loadImages(ImageHub.SALSA_BOTTLE.splash);
        this.x = x;
        this.y = y;
        this.otherDirection = direction;
        this.getRealFrame();
        this.throw();
        this.speedY = 20;
        this.amount = 0;
        this.animate();
    }

    /** Starts projectile motion and triggers a splash on ground contact. */
    throw() {
        this.amount--;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            if (window.isGamePaused) return;
            if (this.otherDirection == true) {
                this.x -= 20;
            } else {
                this.x += 20;
            }
            if (this.y >= 430) {
                this.y = 430;
                this.splash();
            }
        }, 1000 / 30);
    }

    /** @returns {boolean} Whether the bottle is still airborne. */
    isAboveGround() {
        return this.y < 430 && !this.bottleSplashed;
    }

    /** Stops flight and marks the bottle for splash animation. */
    splash() {
        if (!this.bottleSplashed) {
            this.bottleSplashed = true;
            this.throwBottleAir = false;
            this.speedY = 0;
            clearInterval(this.throwInterval);
            AudioHub.PLAY_ONE(AudioHub.BOTTLE_BREAK);
        }
    }

    /** Animates rotation during flight and splash frames after impact. */
    animate() {
        let splashIndex = 0;

        setInterval(() => {
            if (this.throwBottleAir && !this.bottleSplashed) {
                this.playAnimation(ImageHub.SALSA_BOTTLE.rotation);
            } else if (this.bottleSplashed && !this.throwBottleRemoved) {
                if (splashIndex < ImageHub.SALSA_BOTTLE.splash.length) {
                    this.img = this.imageCache[ImageHub.SALSA_BOTTLE.splash[splashIndex]];
                    splashIndex++;
                } else {
                    this.throwBottleRemoved = true;
                }
            }
        }, 1000 / 20);
    }
}
