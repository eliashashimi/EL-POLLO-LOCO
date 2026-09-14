import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

/** Drawable object with gravity, movement, collision, health, and animation support.
 * @extends DrawableObject
 */
export class MoveableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    addCoin = 0;
    addBottle = 0;
    lastHit = -1;
    isDeadEnemy = false;
    movementInterval;
    amount;

    offset = {
        top: 100,
        right: 30,
        bottom: 0,
        left: 30,
    };

    /** Initializes the drawable base state. */
    constructor() {
        super();
    }

    /** Applies recurring vertical acceleration while the object is airborne. */
    applyGravity() {
        IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /** @returns {boolean} Whether the object is above its ground level. */
    isAboveGround() {
        return this.y < 135;
    }

    /** @param {MoveableObject} mO Object to compare against. @returns {boolean} Whether frames overlap. */
    isColliding(mO) {
        return this.rX + this.rW > mO.rX && this.rY + this.rH > mO.rY && this.rX < mO.rX + mO.rW && this.rY < mO.rY + mO.rH;
    }

    /** Reduces energy and records the time of the latest hit. */
    hit() {
        this.energy -= 10;
        this.lastHit = new Date().getTime();
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /** Reduces the bottle counter while keeping the upper bound intact. */
    removeBottle() {
        this.removeBottle -= 10;
        if (this.addBottle > 100) {
            this.addBottle = 100;
        }
    }

    /** @returns {boolean} Whether the object was hit within the last second. */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /** @returns {boolean} Whether no energy remains. */
    isDead() {
        return this.energy === 0;
    }

    /** Stops enemy movement and optionally replaces its image with a death image.
     * @param {string} [deadImagePath] Image shown after defeat.
     */
    killEnemy(deadImagePath) {
        this.isDeadEnemy = true;
        this.speed = 0;

        if (this.movementInterval) {
            IntervalHub.stopInterval(this.movementInterval);
        }
        if (deadImagePath) {
            this.loadImage(deadImagePath);
        }
    }

    /** Moves the object right by its current speed. */
    moveRight() {
        if (window.isGamePaused) return;
        this.x += this.speed;
        this.otherDirection = false;
    }

    /** Starts a recurring leftward movement interval. */
    moveLeft() {
        this.movementInterval = IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /** Gives the object an upward jump velocity. */
    jump() {
        this.speedY = 25;
    }

    /** Displays the next frame from an image sequence.
     * @param {string[]} images Animation image paths.
     */
    playAnimation(images) {
        const i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
