import { ImageHub } from "./ImageHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Character extends MoveableObject {
    constructor(x, y) {
        super().loadImage(ImageHub.PEPE.longIdle[0], 100, 100);
        this.x = x;
        this.y = y;
    }

    jump() {}
}
