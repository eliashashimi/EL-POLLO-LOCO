import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

export class Endboss extends MoveableObject {
    width = 300;
    height = 450;
    energy = 100;
    hadfirstSight = false;
    isAlerting = false;
    isHurted = false;
    isAttacking = false;
    offset = { top: 40, right: 20, bottom: 20, left: 20 };
    world;

    constructor() {
        super();
        this.loadImage(ImageHub.ENDBOSS.alert[0]);
        this.loadImages(ImageHub.ENDBOSS.alert);
        this.loadImages(ImageHub.ENDBOSS.hurt);
        this.loadImages(ImageHub.ENDBOSS.walk);
        this.loadImages(ImageHub.ENDBOSS.attack);
        this.loadImages(ImageHub.ENDBOSS.dead);
        this.getRealFrame();
        this.x = 3400;
        this.y = 55;
        this.speed = 0;
        this.animate();
    }

    hit(damage) {
        if (window.isGamePaused) return;
        this.energy -= damage;
        if (this.energy < 0) this.energy = 0;

        if (!this.isDead()) {
            this.triggerHurtAndAttack();
        }
    }

    triggerHurtAndAttack() {
        this.isHurted = true;
        this.isAttacking = false;
        this.speed = 0;
        this.currentImage = 0;

        this.HurtAndAttackSequence();
    }

    HurtAndAttackSequence() {
        setTimeout(() => {
            if (window.isGamePaused) return setTimeout(() => this.HurtAndAttackSequence(), 100);
            this.isHurted = false;

            if (!this.isDead()) {
                this.isAttacking = true;
                this.speed = 4.5;
                this.currentImage = 0;

                setTimeout(() => {
                    this.isAttacking = false;
                    this.speed = 2.5;
                }, 2500);
            }
        }, 400);
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            if (this.isDead()) {
                this.playAnimation(ImageHub.ENDBOSS.dead);
            } else if (this.isHurted) {
                this.playAnimation(ImageHub.ENDBOSS.hurt);
            } else if (this.isAttacking) {
                this.playAnimation(ImageHub.ENDBOSS.attack);
            } else if (this.isAlerting) {
                this.playAnimation(ImageHub.ENDBOSS.alert);
            } else {
                this.playAnimation(ImageHub.ENDBOSS.walk);
            }
        }, 1000 / 5);

        this.firstHitWalking();
    }

    firstHitWalking() {
        IntervalHub.startInterval(() => {
            if (window.isGamePaused || this.isDead() || !this.world || !this.world.character) return;
            let cameraRightEdge = -World.camera_x + 960;

            if (!this.hadfirstSight && this.x < cameraRightEdge) {
                this.hadfirstSight = true;
                this.isAlerting = true;
                this.speed = 0;
                setTimeout(() => {
                    this.isAlerting = false;
                    this.speed = 2.5;
                }, 1500);
            }
            if (this.hadfirstSight && !this.isAlerting && !this.isHurted) {
                this.followCaracter();
            }
        }, 1000 / 60);
    }

    followCaracter() {
        this.followAttackCharacter();
        this.folloStopSmallDistance();
        if (this.speed > 0) {
            if (this.world.character.x < this.x) {
                this.x -= this.speed;
                this.otherDirection = false;
            } else {
                this.x += this.speed;
                this.otherDirection = true;
            }
        }
    }

    folloStopSmallDistance() {
        let xDistance = Math.abs(this.x - this.world.character.x);
        if (xDistance < 15) {
            this.speed = 0;
        } else if (this.speed === 0 && !this.isAlerting && !this.isHurted) {
            this.speed = this.isAttacking ? 3.5 : 2.5;
        }
    }

    followAttackCharacter() {
        let distance = Math.abs(this.x - this.world.character.x);
        if (distance < 200) {
            this.isAttacking = true;

            if (distance < 80 && this.isColliding(this.world.character) && !this.world.character.isHurt()) {
                this.world.character.hit();
                this.world.statusbarHealth.setPercentage(this.world.character.energy);
            }
            this.triggerChargeSpeed();
        } else if (this.speed < 4.5) {
            this.isAttacking = false;
            this.speed = 2.5;
        }
    }

    triggerChargeSpeed() {
        if (this.speed === 2.5) {
            this.speed = 3.5;
            setTimeout(() => {
                if (!this.isHurted && !this.isDead() && this.speed === 3.5) {
                    this.isAttacking = false;
                    this.speed = 2.5;
                }
            }, 800);
        }
    }
}
