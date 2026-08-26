import { ImageHub } from "./ImageHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js ";

export class Cloud extends MoveableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor() {
        super().loadImage(ImageHub.BACKGROUND_OBJECT.cloud[0]);
        this.x = Math.random() * 500;
    }
}
