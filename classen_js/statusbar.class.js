import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

export class Statusbar extends DrawableObject {
    x = 20;
    width = 200;
    height = 50;
    percentage;

    constructor(type, x, y, percentage = 0) {
        super();
        this.type = type;
        this.loadImages(ImageHub.STATUSBAR[type]);
        this.x = x;
        this.y = y;
        this.setPercentage(percentage);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[ImageHub.STATUSBAR[this.type][this.resolveImageIndex()]];
    }

    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
