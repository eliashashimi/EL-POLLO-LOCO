import { Chicken } from "../classen_js/chicken.class.js";
import { CollectableBottles } from "../classen_js/collectable-bottles.class.js";
import { CollectableCoins } from "../classen_js/collectable-coins.class.js";
import { Endboss } from "../classen_js/endboss.class.js";
import { Level } from "../classen_js/level.class.js";
import { SmallChicken } from "../classen_js/small-chicken.class.js";

export function addLevel1() {
    return new Level(8, createChickens(), new Endboss(), createCoins(), createBottles());
}

function createChickens() {
    return [...Array.from({ length: 7 }, () => new Chicken()), ...Array.from({ length: 7 }, () => new SmallChicken())];
}

function createCoins() {
    return [createCoinArc(400), createCoinLine(850), createCoinRow(), createCoinStairs(), createCoinArc(2300), createCoinLine(2800)].flat();
}

function createCoinArc(startX) {
    return [
        new CollectableCoins(startX, 230),
        new CollectableCoins(startX + 50, 150),
        new CollectableCoins(startX + 100, 90),
        new CollectableCoins(startX + 150, 150),
        new CollectableCoins(startX + 200, 230),
    ];
}

function createCoinLine(startX) {
    return [0, 50, 100, 150, 200].map((offset) => new CollectableCoins(startX + offset, 100));
}

function createCoinRow() {
    return [1350, 1400, 1450, 1500, 1550].map((x) => new CollectableCoins(x, 250));
}

function createCoinStairs() {
    return [1800, 1850, 1900, 1950, 2000].map((x, index) => new CollectableCoins(x, 240 - index * 40));
}

function createBottles() {
    return [200, 400, 800, 1200, 1600, 1800, 2200, 2600, 3000, 3400].map((x) => new CollectableBottles(x));
}
