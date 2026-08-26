import { ImageHub } from "./ImageHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Chicken extends MoveableObject {
    y = 290;
    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);

        this.x = 200 + Math.random() * 500;
    }
}
