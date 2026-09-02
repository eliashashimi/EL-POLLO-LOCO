import { ImageHub } from "./image-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class CollectableCoins extends MoveableObject {
    x;
    y;
    height = 150;
    width = 150;
    offset = {
        left: 50,
        top: 60,
        right: 50,
        bottom: 60,
    };

    constructor() {
        super().loadImage(ImageHub.COINS.coins[0]);
        this.loadImages(ImageHub.COINS.coins);
        this.position();
        this.getRealFrame();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(ImageHub.COINS.coins);
        }, 1000 / 3);
    }

    position() {
        this.x = 200 + Math.random() * 2500;
        this.y = 135 + Math.random() * 250;
    }
}
