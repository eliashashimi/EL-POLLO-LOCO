import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

export class Character extends MoveableObject {
    x = 100;
    xEnd = 3700;
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
            this.handlePhysics();
            if (this.slowerAnimation % 4 === 0) {
                this.handleGraphics();
            }
            this.slowerAnimation++;
        }, 1000 / 60);
    }

    handlePhysics() {
        if (window.isGamePaused || window.isGameOver) return;
        this.isMoving = (Keyboard.RIGHT || Keyboard.LEFT) && !this.isDead() && !this.isAboveGround();
        if (!this.isDead()) this.checkMovementInput();
    }

    checkMovementInput() {
        this.ifKeyboardRight();
        this.ifKeyboardLeft();
        this.ifIsMoving();
        this.ifKeyboardUp();
    }

    ifKeyboardRight() {
        if (Keyboard.RIGHT && this.x < this.xEnd) {
            this.moveRight();
            this.lastMove = new Date().getTime();
        }
    }

    ifKeyboardLeft() {
        if (Keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastMove = new Date().getTime();
        }
    }

    ifIsMoving() {
        const isMoving = Keyboard.RIGHT || Keyboard.LEFT;
        if (isMoving && !this.isAboveGround() && !this.isDead()) {
            if (AudioHub.PEPE_RUN && AudioHub.PEPE_RUN.file && AudioHub.PEPE_RUN.file.paused) {
                AudioHub.PLAY_ONE(AudioHub.PEPE_RUN, true);
            }
        } else {
            if (AudioHub.PEPE_RUN && AudioHub.PEPE_RUN.file && !AudioHub.PEPE_RUN.file.paused) {
                AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
            }
        }
    }

    ifKeyboardUp() {
        if (Keyboard.UP && !this.isAboveGround()) {
            this.jump();
            AudioHub.PLAY_ONE(AudioHub.PEPE_JUMP);
            AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
            this.lastMove = new Date().getTime();
        }
    }

    handleGraphics() {
        if (window.isGamePaused || window.isGameOver) return;
        this.handleSnoringSound();

        if (this.isDead()) return this.handleDeath();
        if (this.isHurt() && !this.isImmuneAfterKill) return this.playAnimation(ImageHub.PEPE.hurt);
        if (this.isAboveGround()) return this.playAnimation(ImageHub.PEPE.jump);
        if (this.isMoving) return this.playAnimation(ImageHub.PEPE.walk);
        this.handleAnimations();
    }

    handleAnimations() {
        if (this.isSleeping() && this.slowerAnimation % 5 === 0) this.playAnimation(ImageHub.PEPE.longIdle);
        if (!this.isSleeping() && this.slowerAnimation % 3 === 0) this.playAnimation(ImageHub.PEPE.idle);
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

    handleSnoringSound() {
        if (this.isSleeping() && !this.isDead() && !this.isHurt() && !this.isMoving && !this.isAboveGround()) {
            if (AudioHub.PEPE_SNORING.file.paused) AudioHub.PLAY_ONE(AudioHub.PEPE_SNORING, true);
        } else {
            AudioHub.STOP_ONE(AudioHub.PEPE_SNORING);
        }
    }

    isSleeping() {
        let timePassed = new Date().getTime() - this.lastMove;
        return timePassed > 4000;
    }

    bounce() {
        this.speedY = 12;
    }
}
