import { ImageHub } from "./ImageHub.class.js";
import { MoveableObject } from "./Moveable-Object.class.js";

export class Character extends MoveableObject {
    constructor() {
        super().loadImage(ImageHub.PEPE.longIdle[0], 100, 100);
        this.img = new ImageHub();
    }

    jump() {}
}
