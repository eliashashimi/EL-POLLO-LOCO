import { World } from "./World.class.js ";

export class MoveableObject extends World {
    x;
    y;
    img;
    height = 150;
    width = 100;
    imageCache = {};
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {}

    moveLeft() {}
}
