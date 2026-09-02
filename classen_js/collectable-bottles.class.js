import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class CollectableBottles extends MoveableObject {
    height = 80;
    width = 80;
    x = 300;
    y = 400;

    offset = {
        left: 40,
        top: 20,
        right: 40,
        bottom: 30,
    };

    constructor() {
        super().loadImage(ImageHub.SALSA_BOTTLE.onground[0]);
        this.loadImages(ImageHub.SALSA_BOTTLE.onground);
        this.position();
        this.getRealFrame();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(ImageHub.SALSA_BOTTLE.onground);
        }, 1000 / 3);
    }

    position() {
        this.x = 200 + Math.random() * 2000;
    }
}
