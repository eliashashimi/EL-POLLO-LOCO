import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class ThrowableObject extends MoveableObject {
    offset = {
        left: 20,
        top: 20,
        right: 20,
        bottom: 20,
    };
    constructor(x, y) {
        super().loadImage(ImageHub.SALSA_BOTTLE.salsaBottle);
        this.loadImages(ImageHub.SALSA_BOTTLE.onground);
        this.loadImages(ImageHub.SALSA_BOTTLE.rotation);
        this.loadImages(ImageHub.SALSA_BOTTLE.splash);
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.otherDirection = direction;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 30;
        this.applyGravity();
        if (this.otherDirection == true) {
            setInterval(() => {
                this.x -= 10;
            }, 25);
        } else {
            setInterval(() => {
                this.x += 10;
            }, 1000 / 25);
        }
    }

    animate() {
        setInterval(() => {
            if (this.throwBottleAir) {
                this.playAnimation(this.IMAGES_ROTATE);
            }
        }, 9000 / 60);
    }
}
