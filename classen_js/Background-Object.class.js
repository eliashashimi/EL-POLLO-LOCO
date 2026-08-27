import { World } from "./world.class.js";

export class BackgroundObject extends MoveableObject {
    // height = 540;
    // width = 960;
    constructor(imagePath) {
        super().loadImage(imagePath);
        this.height = World.canvas.height;
        this.width = World.canvas.width;
    }
}
