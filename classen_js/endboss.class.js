import { Chicken } from "./chicken.class.js";
import { ImageHub } from "./image-hub.class.js";

export class Endboss extends Chicken {
    x = 100;
    y = 150;
    width = 200;
    height = 350;
    constructor() {
        super().loadImage(ImageHub.ENDBOSS.alert[0]);
        this.loadImage(ImageHub.ENDBOSS.alert);
        this.x = 2500;
    }
}
