import { BackgroundObject } from "./background-object.class.js";
import { Cloud } from "./cloud.class.js";
import { ImageHub } from "./image-hub.class.js";
import { World } from "./world.class.js";

/** Complete level definition containing actors, collectibles, and background layers. */
export class Level {
    chickens;
    endboss;
    clouds = [];
    backgroundObjects = [];
    step;
    sections = 4;
    collectableCoins;
    collectableBottles;

    /**
     * Creates a level and populates its repeating background.
     * @param {number} sections Number of background sections.
     * @param {Chicken[]} chickens Regular and small enemies.
     * @param {Endboss} endboss Level boss.
     * @param {CollectableCoins[]} collectableCoins Coins in the level.
     * @param {CollectableBottles[]} collectableBottles Bottles in the level.
     */
    constructor(sections, chickens, endboss, collectableCoins, collectableBottles) {
        this.sections = sections;
        this.chickens = chickens;
        this.endboss = endboss;
        this.collectableCoins = collectableCoins;
        this.collectableBottles = collectableBottles;
        this.step = World.canvas ? World.canvas.width : 960;
        this.addBg();
    }

    /** Creates the alternating background and cloud layers for all sections. */
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
