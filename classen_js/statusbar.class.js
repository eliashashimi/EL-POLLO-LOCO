import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

/** Displays a percentage using the matching status bar image.
 * @extends DrawableObject
 */
export class Statusbar extends DrawableObject {
    x = 20;
    width = 200;
    height = 50;
    percentage;

    /** @param {string} type Status bar asset group. @param {number} x Horizontal position.
     * @param {number} y Vertical position. @param {number} [percentage=0] Initial percentage.
     */
    constructor(type, x, y, percentage = 0) {
        super();
        this.type = type;
        this.loadImages(ImageHub.STATUSBAR[type]);
        this.x = x;
        this.y = y;
        this.setPercentage(percentage);
    }

    /** Updates the displayed percentage image.
     * @param {number} percentage New percentage value.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        this.img = this.imageCache[ImageHub.STATUSBAR[this.type][this.resolveImageIndex()]];
    }

    /** @returns {number} Asset index for the current percentage range. */
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
