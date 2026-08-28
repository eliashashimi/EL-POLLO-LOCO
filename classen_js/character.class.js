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

    constructor() {
        super();
        this.loadImage(ImageHub.PEPE.idle[0]);
        this.loadImages(ImageHub.PEPE.walk);
        this.loadImages(ImageHub.PEPE.jump);
        this.applyGravity();
        this.getRealFrame();
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (Keyboard.RIGHT && this.x < 2880) {
                this.moveRight();
            }
            if (Keyboard.LEFT && this.x > 0) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            if (Keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            World.camera_x = -this.x + 100;
        }, 1000 / 60);

        IntervalHub.startInterval(() => {
            if (this.isAboveGround()) {
                this.playAnimation(ImageHub.PEPE.jump);
            } else {
                if (Keyboard.RIGHT || Keyboard.LEFT) {
                    this.playAnimation(ImageHub.PEPE.walk);
                }
            }
        }, 1000 / 15);
    }
}
