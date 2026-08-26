import { MoveableObject } from "./Moveable-Object.class.js";

export class BackgroundObject extends MoveableObject {
    width = 960;
    height = 540;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = 0;
        this.y = 0;
    }
}
