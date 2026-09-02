import { MoveableObject } from "./moveable-object.class.js";

export class Cloud extends MoveableObject {
    y = 0;
    height = 540;
    width = 960;

    constructor(img, x) {
        super().loadImage(img);
        this.x = x;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            if (this.x <= this.width) this.x = this.width * 4;
        }, 1000 / 0.3);
    }
}
