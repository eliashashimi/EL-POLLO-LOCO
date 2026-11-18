import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image-hub.class.js";

/** Displays a percentage using the matching status bar image.
 * @extends DrawableObject
 */
export class Statusbar extends DrawableObject {
    x = 20;
    width = 200;
    height = 50;
    percentage = 0;

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

    /** Updates the displayed percentage value.
     * @param {number} percentage New percentage value.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        const images = ImageHub.STATUSBAR[this.type];
        this.img = this.imageCache[images[this.percentage > 0 ? 5 : 0]];
    }

    /** Draws the empty background bar and clips the 100% bar smoothly to the exact percentage.
     * @param {CanvasRenderingContext2D} ctx Canvas rendering context.
     */
    draw(ctx) {
        const images = ImageHub.STATUSBAR[this.type];
        if (!images || !this.imageCache) return;

        const emptyImg = this.imageCache[images[0]];
        const fullImg = this.imageCache[images[5]];

        if (!emptyImg || !fullImg) {
            super.draw(ctx);
            return;
        }

        ctx.drawImage(emptyImg, this.x, this.y, this.width, this.height);

        if (this.percentage > 0) {
            const iconOffsetRatio = 0.16;
            const barWidthRatio = 1 - iconOffsetRatio;
            const fillRatio = iconOffsetRatio + barWidthRatio * (this.percentage / 100);

            const sourceWidth = fullImg.width * fillRatio;
            const destWidth = this.width * fillRatio;

            ctx.drawImage(fullImg, 0, 0, sourceWidth, fullImg.height, this.x, this.y, destWidth, this.height);
        }
    }

    // /** Updates the displayed percentage image.
    //  * @param {number} percentage New percentage value.
    //  */
    // setPercentage(percentage) {
    //     this.percentage = percentage;
    //     this.img = this.imageCache[ImageHub.STATUSBAR[this.type][this.resolveImageIndex()]];
    // }

    // /** @returns {number} Asset index for the current percentage range. */
    // resolveImageIndex() {
    //     if (this.percentage >= 100) {
    //         return 5;
    //     } else if (this.percentage >= 80) {
    //         return 4;
    //     } else if (this.percentage >= 60) {
    //         return 3;
    //     } else if (this.percentage >= 40) {
    //         return 2;
    //     } else if (this.percentage >= 20) {
    //         return 1;
    //     } else {
    //         return 0;
    //     }
    // }
}
