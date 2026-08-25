let canvas;
let world;
let keyboard;
let character = new MoveableObjects();

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    console.log(World.character);
}
