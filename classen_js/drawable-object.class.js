/** Base class for objects that can load images and render on the game canvas. */
export class DrawableObject {
    rX;
    rY;
    rW;
    rH;
    x = 0;
    y = 0;
    img;
    width;
    height;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;

    /** Loads the primary image used to render this object.
     * @param {string} path Image source path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /** Draws the object, mirroring it when it faces the opposite direction.
     * @param {CanvasRenderingContext2D} ctx Rendering context.
     */
    draw(ctx) {
        if (this.otherDirection) {
            ctx.save();
            ctx.translate(this.x + this.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, this.y, this.width, this.height);
            ctx.restore();
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /** Updates the reduced collision frame from the object's position and offsets. */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /** Caches all images in an animation sequence.
     * @param {string[]} arr Image source paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
