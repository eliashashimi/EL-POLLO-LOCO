export class World {
    character = new Character();
    enemies = [new Chicken(), new Chicken(), new Chicken()];

    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBar = new this.statusBar();
    throwableObjects = [];

    draw() {}
}
