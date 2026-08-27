import { MoveableObject } from "./Moveable-Object.class.js";

export class BackgroundObject extends MoveableObject {
    height = 540;
    width = 960;

    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = 0;
        this.y = 0;
    }
}
