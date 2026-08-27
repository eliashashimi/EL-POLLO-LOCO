import { World } from "./classen_js/world.class.js ";

let canvas;
let world;
let keyboard = new Keyboard();

// function die den code ausführt
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}
// scriptmodule benötigt window, mit onload funktioniert das nicht
window.addEventListener("load", init);

window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = true;
    }
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = true;
    }
    if (e.code == "ArrowUp") {
        Keyboard.UP = true;
    }
    if (e.code == "ArrowDown") {
        Keyboard.DOWN = true;
    }
    if (e.code == "Space") {
        Keyboard.Space = true;
    }
    if (e.code == "D") {
        Keyboard.D = true;
    }

    console.log(e);
});

window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = false;
    }
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = false;
    }
    if (e.code == "ArrowUp") {
        Keyboard.UP = false;
    }
    if (e.code == "ArrowDown") {
        Keyboard.DOWN = false;
    }
    if (e.code == "Space") {
        Keyboard.Space = false;
    }
    if (e.code == "D") {
        Keyboard.D = false;
    }
});
