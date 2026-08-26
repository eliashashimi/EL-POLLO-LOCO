export class MoveableObject {
    x;
    y;
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

    moveRight() {}

    moveLeft() {}
}
