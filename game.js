import { World } from "./classen_js/World.class.js ";

let canvas;
let world;
// let keyboard;

// function die den code ausführt
function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas);
}

// scriptmodule benötigt window, mit onload funktioniert das nicht
window.addEventListener("load", init);
