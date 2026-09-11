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
        ],
        new Endboss(),
        [
            new CollectableCoins(400, 230),
            new CollectableCoins(450, 150),
            new CollectableCoins(500, 90),
            new CollectableCoins(550, 150),
            new CollectableCoins(600, 230),

            new CollectableCoins(850, 100),
            new CollectableCoins(900, 100),
            new CollectableCoins(950, 100),
            new CollectableCoins(1000, 100),
            new CollectableCoins(1050, 100),

            new CollectableCoins(1350, 250),
            new CollectableCoins(1400, 250),
            new CollectableCoins(1450, 250),
            new CollectableCoins(1500, 250),
            new CollectableCoins(1550, 250),

            new CollectableCoins(1800, 240),
            new CollectableCoins(1850, 200),
            new CollectableCoins(1900, 160),
            new CollectableCoins(1950, 120),
            new CollectableCoins(2000, 80),

            new CollectableCoins(2300, 230),
            new CollectableCoins(2350, 150),
            new CollectableCoins(2400, 90),
            new CollectableCoins(2450, 150),
            new CollectableCoins(2500, 230),

            new CollectableCoins(2800, 70),
            new CollectableCoins(2850, 70),
            new CollectableCoins(2900, 70),
            new CollectableCoins(2950, 70),
            new CollectableCoins(3000, 70),
        ],
        [
            new CollectableBottles(200),
            new CollectableBottles(400),
            new CollectableBottles(800),
            new CollectableBottles(1200),
            new CollectableBottles(1600),
            new CollectableBottles(1800),
            new CollectableBottles(2200),
            new CollectableBottles(2600),
            new CollectableBottles(3000),
            new CollectableBottles(3400),
        ],
    );
}
