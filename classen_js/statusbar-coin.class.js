import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

export class StatusbarCoin extends DrawableObject {
    percentageCoin = 0;
    constructor() {
        super();
        this.loadImages(ImageHub.STATUSBAR.coins);
        this.x = 20;
        this.y = 40;
        this.width = 200;
        this.height = 50;
        this.setPercentageCoins(0);
    }

    setPercentageCoins(percentageCoin) {
        this.percentageCoin = percentageCoin;
        let path = ImageHub.STATUSBAR.coins[this.resolveImageIndexCoin()];
        this.img = this.imageCache[path];
    }

    resolveImageIndexCoin() {
        if (this.percentageCoin == 0) {
            return 0;
        } else if (this.percentageCoin <= 20) {
            return 1;
        } else if (this.percentageCoin <= 40) {
            return 2;
        } else if (this.percentageCoin <= 60) {
            return 3;
        } else if (this.percentageCoin <= 80) {
            return 4;
        } else {
            return 5;
        }
    }
}
