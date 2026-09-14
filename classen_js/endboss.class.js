import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

/** End-level boss with alert, attack, hurt, movement, and defeat states.
 * @extends MoveableObject
 */
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

    /** Loads boss animations and places the boss at the end of the level. */
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

    /** Applies damage and starts the boss reaction sequence.
     * @param {number} damage Amount of energy to remove.
     */
    hit(damage) {
        if (window.isGamePaused) return;
        this.energy -= damage;
        if (this.energy < 0) this.energy = 0;

        if (!this.isDead()) {
            this.triggerHurtAndAttack();
        }
    }

    /** Resets attack state and schedules the hurt animation transition. */
    triggerHurtAndAttack() {
        this.isHurted = true;
        this.isAttacking = false;
        this.speed = 0;
        this.currentImage = 0;

        this.HurtAndAttackSequence();
    }

    /** Completes the hurt delay and starts attacking when the boss survives. */
    HurtAndAttackSequence() {
        setTimeout(() => {
            if (window.isGamePaused) return setTimeout(() => this.HurtAndAttackSequence(), 100);
            this.isHurted = false;
            if (!this.isDead()) this.startAttackSequence();
        }, 400);
    }

    /** Starts a temporary high-speed attack phase. */
    startAttackSequence() {
        this.isAttacking = true;
        this.speed = 4.5;
        this.currentImage = 0;
        setTimeout(() => this.stopAttackSequence(), 2500);
    }

    /** Ends the temporary attack phase and restores normal speed. */
    stopAttackSequence() {
        this.isAttacking = false;
        this.speed = 2.5;
    }

    /** Starts animation playback and first-sighting movement updates. */
    animate() {
        IntervalHub.startInterval(() => {
            if (window.isGamePaused) return;
            this.playCurrentAnimation();
        }, 1000 / 5);

        this.firstHitWalking();
    }

    /** Selects the animation matching the current boss state. */
    playCurrentAnimation() {
        if (this.isDead()) return this.playAnimation(ImageHub.ENDBOSS.dead);
        if (this.isHurted) return this.playAnimation(ImageHub.ENDBOSS.hurt);
        if (this.isAttacking) return this.playAnimation(ImageHub.ENDBOSS.attack);
        if (this.isAlerting) return this.playAnimation(ImageHub.ENDBOSS.alert);
        this.playAnimation(ImageHub.ENDBOSS.walk);
    }

    /** Starts the recurring first-sighting and pursuit check. */
    firstHitWalking() {
        IntervalHub.startInterval(() => this.updateFirstHitWalking(), 1000 / 60);
    }

    /** Updates boss pursuit after the player enters the boss camera range. */
    updateFirstHitWalking() {
        if (window.isGamePaused || this.isDead() || !this.world || !this.world.character) return;
        let cameraRightEdge = -World.camera_x + 960;
        if (!this.hadfirstSight && this.x < cameraRightEdge) this.triggerFirstSight();
        if (this.hadfirstSight && !this.isAlerting && !this.isHurted) this.followCaracter();
    }

    /** Shows the alert state once and delays normal movement. */
    triggerFirstSight() {
        this.hadfirstSight = true;
        this.isAlerting = true;
        this.speed = 0;
        setTimeout(() => {
            this.isAlerting = false;
            this.speed = 2.5;
        }, 1500);
    }

    /** Follows the player while coordinating attack range and direction. */
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

    /** Stops or resumes movement when the boss is close to the player. */
    folloStopSmallDistance() {
        let xDistance = Math.abs(this.x - this.world.character.x);
        if (xDistance < 15) {
            this.speed = 0;
        } else if (this.speed === 0 && !this.isAlerting && !this.isHurted) {
            this.speed = this.isAttacking ? 3.5 : 2.5;
        }
    }

    /** Switches attack mode and damages the player at close range. */
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

    /** Starts a short charge and returns to the regular attack speed. */
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
