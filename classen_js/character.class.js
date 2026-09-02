import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

export class Character extends MoveableObject {
    x = 100;
    width = 150;
    height = 350;
    speed = 10;
    lastMove = 0;
    slowerAnimation = 0;

    constructor() {
        super().loadImage(ImageHub.PEPE.idle[0]);
        this.loadImages(ImageHub.PEPE.idle);
        this.loadImages(ImageHub.PEPE.longIdle);
        this.loadImages(ImageHub.PEPE.walk);
        this.loadImages(ImageHub.PEPE.jump);
        this.loadImages(ImageHub.PEPE.hurt);
        this.loadImages(ImageHub.PEPE.dead);
        this.applyGravity();
        this.getRealFrame();
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (Keyboard.RIGHT) {
                this.moveRight();
                this.lastMove = new Date().getTime();
            }
            if (Keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.lastMove = new Date().getTime();
            }
            if (Keyboard.UP && !this.isAboveGround()) {
                this.jump();
                this.lastMove = new Date().getTime();
            }

            World.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.isDead()) {
                this.playAnimation(ImageHub.PEPE.dead);
                setTimeout(() => {
                    // gameOver();
                }, 1000 / 0.6);
            } else if (this.isHurt()) {
                this.playAnimation(ImageHub.PEPE.hurt);
            } else if (this.isAboveGround()) {
                this.playAnimation(ImageHub.PEPE.jump);
            } else {
                if (Keyboard.RIGHT || Keyboard.LEFT) {
                    this.playAnimation(ImageHub.PEPE.walk);
                } else if (this.isSleeping()) {
                    if (this.slowerAnimation % 5 === 0) {
                        this.playAnimation(ImageHub.PEPE.longIdle);
                    }
                } else {
                    if (this.slowerAnimation % 3 === 0) {
                        this.playAnimation(ImageHub.PEPE.idle);
                    }
                }
            }
            this.slowerAnimation++;
        }, 1000 / 15);
    }

    isSleeping() {
        let timePassed = new Date().getTime() - this.lastMove;
        timePassed = timePassed / 1000;
        return timePassed > 4;
    }
}
