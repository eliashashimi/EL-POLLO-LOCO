import { Chicken } from "../classen_js/chicken.class.js";
import { CollectableBottles } from "../classen_js/collectable-bottles.class.js";
import { CollectableCoins } from "../classen_js/collectable-coins.class.js";
import { Endboss } from "../classen_js/endboss.class.js";
import { Level } from "../classen_js/level.class.js";
import { SmallChicken } from "../classen_js/small-chicken.class.js";

export function addLevel1() {
    return new Level(
        8,
        [
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new SmallChicken(),
            new Endboss(),
        ],
        [
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
            new CollectableCoins(),
        ],
        [
            new CollectableBottles(),
            new CollectableBottles(),
            new CollectableBottles(),
            new CollectableBottles(),
            new CollectableBottles(),
            new CollectableBottles(),
            new CollectableBottles(),
        ],
    );
}
