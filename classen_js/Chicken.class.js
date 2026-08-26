import { ImageHub } from "./ImageHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Chicken extends MoveableObject {
    constructor() {
        super().loadImage(ImageHub.CHICKEN.walk[0]);
    }
}
