import { BackgroundObject } from "../classen_js/background-object.class.js";
import { Chicken } from "../classen_js/chicken.class.js";
import { Cloud } from "../classen_js/cloud.class.js";
import { Endboss } from "../classen_js/endboss.class.js";
import { ImageHub } from "../classen_js/image-hub.class.js";
import { Level } from "../classen_js/level.class.js";

export function addLevel1() {
    return new Level(
        [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
        [new Cloud()],
        [
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0], -960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[0], -960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[1], -960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[2], -960),

            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0], 0),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[0], 0),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[1], 0),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[2], 0),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0], 960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[0], 960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[1], 960),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[2], 960),

            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0], 960 * 2),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[0], 960 * 2),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[1], 960 * 2),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundOne[2], 960 * 2),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.air[0], 960 * 3),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[0], 960 * 3),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[1], 960 * 3),
            new BackgroundObject(ImageHub.BACKGROUND_OBJECT.backgroundTwo[2], 960 * 3),
        ],
    );
}
