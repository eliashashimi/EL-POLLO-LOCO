import { Chicken } from "../classen_js/chicken.class.js";
import { CollectableBottles } from "../classen_js/collectable-bottles.class.js";
import { CollectableCoins } from "../classen_js/collectable-coins.class.js";
import { Endboss } from "../classen_js/endboss.class.js";
import { Level } from "../classen_js/level.class.js";
import { SmallChicken } from "../classen_js/small-chicken.class.js";

/** Builds and returns the first playable level configuration.
 * @returns {Level} Configured level with enemies, boss, coins, and bottles.
 */
export function addLevel1() {
    return new Level(8, createChickens(), new Endboss(), createCoins(), createBottles());
}

/** Creates the normal and small chicken population for level one.
 * @returns {Array<Chicken|SmallChicken>} Enemy instances.
 */
function createChickens() {
    return [...Array.from({ length: 7 }, () => new Chicken()), ...Array.from({ length: 7 }, () => new SmallChicken())];
}

/** Creates all coin formations used by level one.
 * @returns {CollectableCoins[]} Coin instances.
 */
function createCoins() {
    return [createCoinArc(400), createCoinRow(), createCoinStairs(), createCoinArc(2300), createCoinLine(2800)].flat();
}

/** Creates an arc-shaped coin formation.
 * @param {number} startX Horizontal start position.
 * @returns {CollectableCoins[]} Coin instances.
 */
function createCoinArc(startX) {
    return [new CollectableCoins(startX + 100, 90)];
}

/** Creates a horizontal coin line.
 * @param {number} startX Horizontal start position.
 * @returns {CollectableCoins[]} Coin instances.
 */
function createCoinLine(startX) {
    return [0].map((offset) => new CollectableCoins(startX + offset, 100));
}

/** Creates the low horizontal coin row.
 * @returns {CollectableCoins[]} Coin instances.
 */
function createCoinRow() {
    return [1350].map((x) => new CollectableCoins(x, 250));
}

/** Creates ascending coins.
 * @returns {CollectableCoins[]} Coin instances.
 */
function createCoinStairs() {
    return [1800].map((x, index) => new CollectableCoins(x, 240 - index * 40));
}

/** Creates the bottle pickup positions.
 * @returns {CollectableBottles[]} Bottle instances.
 */
function createBottles() {
    return [400, 1200, 1800, 2600, 3400].map((x) => new CollectableBottles(x));
}
