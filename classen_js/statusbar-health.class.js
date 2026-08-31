import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

export class StatusbarHealth extends DrawableObject {
    constructor() {
        super();
        this.loadImages(ImageHub.STATUSBAR.health);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 50;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        console.log(percentage);

        this.percentage = percentage;
        let path = ImageHub.STATUSBAR.health[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex() {
        if (this.percentage === 100) {
            return 5;
        } else if (this.percentage === 80) {
            return 4;
        } else if (this.percentage === 60) {
            return 3;
        } else if (this.percentage === 40) {
            return 2;
        } else if (this.percentage === 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
