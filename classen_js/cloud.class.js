import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Cloud extends MoveableObject {
    y = 40;
    height = 250;
    width = 500;

    constructor() {
        super().loadImage(ImageHub.BACKGROUND_OBJECT.cloud[0]);
        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }
}
