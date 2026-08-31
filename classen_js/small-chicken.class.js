import { ImageHub } from "./image-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class SmallChicken extends MoveableObject {
    y = 440;
    width = 50;
    height = 30;
    offset = {
        top: 7,
        right: 7,
        bottom: 5,
        left: 7,
    };

    constructor() {
        super().loadImage(ImageHub.SMALLCHICKEN.walk[0]);
        this.loadImages(ImageHub.SMALLCHICKEN.walk);

        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate();
    }

    animate() {
        this.moveLeft();

        IntervalHub.startInterval(() => {
            this.playAnimation(ImageHub.SMALLCHICKEN.walk);
        }, 1000 / 10);
    }
}
