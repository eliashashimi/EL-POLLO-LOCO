import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Endboss extends MoveableObject {
    width = 300;
    height = 500;
    constructor() {
        super().loadImage(ImageHub.ENDBOSS.alert[0]);
        this.loadImages(ImageHub.ENDBOSS.alert);
        this.x = 3400;
        this.y = 15;

        this.animate();
    }

    animate() {
        // this.moveLeft();

        IntervalHub.startInterval(() => {
            this.playAnimation(ImageHub.ENDBOSS.alert);
        }, 1000 / 5);
    }
}
