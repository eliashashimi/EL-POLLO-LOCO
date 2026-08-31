import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

export class StatusbarBottle extends DrawableObject {
    constructor() {
        super();
        this.loadImages(ImageHub.STATUSBAR.bottles);
        this.x = 20;
        this.y = 80;
        this.width = 200;
        this.height = 50;
        this.setPercentageBottles(0);
    }

    setPercentageBottles(percentageBottle) {
        this.percentageBottle = percentageBottle;
        let path = ImageHub.STATUSBAR.bottles[this.resolveImageIndexBottle()];
        this.img = this.imageCache[path];
    }

    resolveImageIndexBottle() {
        if (this.percentageBottle === 0) {
            return 0;
        } else if (this.percentageBottle === 20) {
            return 1;
        } else if (this.percentageBottle === 40) {
            return 2;
        } else if (this.percentageBottle === 60) {
            return 3;
        } else if (this.percentageBottle === 80) {
            return 4;
        } else {
            return 5;
        }
    }
}
