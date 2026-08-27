import { MoveableObject } from "./Moveable-Object.class.js";
import { World } from "./world.class.js";

export class BackgroundObject extends MoveableObject {
    constructor(imagePath, x, y) {
        super().loadImage(imagePath);
        this.x = 0;
        this.y = 0;
        console.log(World);
        this.height = World.canvas;
        this.width = World.canvas.width;
    }
}
