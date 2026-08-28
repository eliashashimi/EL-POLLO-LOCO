import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

export class BackgroundObject extends MoveableObject {
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.height = World.canvas.height;
        this.width = World.canvas.width;
    }
}
