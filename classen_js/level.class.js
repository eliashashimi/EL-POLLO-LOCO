import { BackgroundObject } from "./background-object.class.js";
import { Cloud } from "./cloud.class.js";
import { ImageHub } from "./image-hub.class.js";
import { World } from "./world.class.js";

export class Level {
    chickens;
    clouds = [];
    backgroundObjects = [];
    step = World.canvas.width;
    sections = 4;
    collectableCoins;
    collectableBottles;

    constructor(sections, chickens, collectableCoins, collectableBottles) {
        this.addBg(sections);
        this.chickens = chickens;
        this.collectableCoins = collectableCoins;
        this.collectableBottles = collectableBottles;
    }

    addBg() {
        for (let i = 0; i < this.sections; i++) {
            const bgThree = ImageHub.BACKGROUND_OBJECT.backgroundThree[i % 2];
            const bgTwo = ImageHub.BACKGROUND_OBJECT.backgroundTwo[i % 2];
            const bgOne = ImageHub.BACKGROUND_OBJECT.backgroundOne[i % 2];
            const bgCloud = ImageHub.BACKGROUND_OBJECT.cloud[i % 2];

            this.backgroundObjects.push(new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(bgThree, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(bgTwo, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(bgOne, this.step * i));
            this.clouds.push(new Cloud(bgCloud, this.step * i));
        }
        this.clouds.push(new Cloud(ImageHub.BACKGROUND_OBJECT.cloud[this.sections % 2], this.step * this.sections));
    }
}
