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

    loadImage(path) {
        this.img = new Image(); // das selbe wie = document.getElementById
        this.img.src = path;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        ctx.beginPath();
        ctx.linewidth = "5";
        ctx.strokeStyle = "blue";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    drawRealFrame(ctx) {
        ctx.beginPath();
        ctx.linewidth = "2";
        ctx.strokeStyle = "red";
        ctx.rect(this.rX, this.rY, this.rW, this.rH);
        ctx.stroke();
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}
