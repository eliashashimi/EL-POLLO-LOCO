import { MoveableObject } from "./moveable-object.class.js";
import { World } from "./world.class.js";

/** A full-canvas background layer positioned within the level.
 * @extends MoveableObject
 */
export class BackgroundObject extends MoveableObject {
    /** @param {string} imagePath Background image path. @param {number} x Horizontal position. */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.height = World.canvas.height;
        this.width = World.canvas.width;
    }
}
