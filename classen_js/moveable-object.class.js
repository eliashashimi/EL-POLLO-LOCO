export class MoveableObject {
    x = 0;
    y = 0;
    img;
    height;
    width;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    loadImage(path) {
        this.img = new Image(); // das selbe wie = document.getElementById
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    moveRight() {}

    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
            // if (this.x <= -this.width) this.x = this.width * 2;
        }, 1000 / 60);
    }
}
