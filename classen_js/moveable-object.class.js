import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

export class MoveableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    otherDirection = false;
    acceleration = 2.5;
    energy = 100;
    addCoin = 0;
    addBottle = 0;
    lastHit = 0;
    offset = {
        top: 100,
        right: 30,
        bottom: 20,
        left: 30,
    };

    constructor() {
        super();
    }

    applyGravity() {
        IntervalHub.startInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 135;
    }

    isColliding(mO) {
        return this.rX + this.rW > mO.rX && this.rY + this.rH > mO.rY && this.rX < mO.rX + mO.rW && this.rY < mO.rY + mO.rH;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    addCoin() {
        this.addCoin += 10;
        if (this.addCoin > 100) {
            this.addCoin = 100;
        }
    }

    addBottle() {
        this.addBottle += 10;
        if (this.addBottle > 100) {
            this.addBottle = 100;
        }
    }

    removeBottle() {
        this.removeBottle -= 10;
        if (this.addBottle > 100) {
            this.addBottle = 100;
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    isDead() {
        return this.energy === 0;
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    jump() {
        this.speedY = 30;
    }

    playAnimation(images) {
        const i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
