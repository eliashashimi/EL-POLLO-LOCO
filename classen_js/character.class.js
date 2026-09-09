import { AudioHub } from "./audio-hub.class.js";
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
    isImmuneAfterKill = false;
    gameOverTriggered = false;
    isMoving = false;

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
        this.lastMove = new Date().getTime();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            let movingNow = (Keyboard.RIGHT || Keyboard.LEFT) && !this.isDead();

            this.isMoving = movingNow && !this.isAboveGround();

            if (Keyboard.RIGHT && !this.isDead()) {
                this.moveRight();
                this.lastMove = new Date().getTime();
            }
            if (Keyboard.LEFT && this.x > 0 && !this.isDead()) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.lastMove = new Date().getTime();
            }

            if (Keyboard.UP && !this.isAboveGround() && !this.isDead()) {
                this.jump();
                this.lastMove = new Date().getTime();
            }

            // World.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            this.handleSnoringSound();
            if (this.isDead()) return this.handleDeath();
            if (this.isHurt() && !this.isImmuneAfterKill) this.playAnimation(ImageHub.PEPE.hurt);
            if (this.isAboveGround()) this.playAnimation(ImageHub.PEPE.jump);
            if (this.isMoving) this.playAnimation(ImageHub.PEPE.walk);

            if (this.isSleeping() && this.slowerAnimation % 5 === 0) this.playAnimation(ImageHub.PEPE.longIdle);
            if (!this.isSleeping() && this.slowerAnimation % 3 === 0) this.playAnimation(ImageHub.PEPE.idle);

            this.slowerAnimation++;
        }, 1000 / 15);
    }

    handleDeath() {
        this.playAnimation(ImageHub.PEPE.dead);
        AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
        if (!this.gameOverTriggered) {
            this.gameOverTriggered = true;
            setTimeout(() => {
                window.showGameOver();
            }, 1500);
        }
    }

    handleMovementSound(isMoving) {
        if (isMoving) {
            if (AudioHub.PEPE_RUN.file.paused) {
                AudioHub.PLAY_ONE(AudioHub.PEPE_RUN, true);
            } else {
                AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
            }
        }
    }

    handleSnoringSound() {
        if (this.isSleeping() && !this.isDead() && !this.isHurt() && !this.isMoving && !this.isAboveGround()) {
            if (AudioHub.PEPE_SNORING.file.paused) AudioHub.PLAY_ONE(AudioHub.PEPE_SNORING, true);
        } else {
            AudioHub.STOP_ONE(AudioHub.PEPE_SNORING);
        }
    }

    isSleeping() {
        let timePassed = new Date().getTime() - this.lastMove;
        timePassed = timePassed / 2500;
        return timePassed > 4;
    }

    bounce() {
        this.speedY = 12;
    }

    // playsound() {
    //     IntervalHub.startInterval();
    // }
}
