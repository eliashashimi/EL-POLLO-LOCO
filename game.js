import { Character } from "./classen_js/Character.class.js ";
import { World } from "./classen_js/World.class.js ";

let canvas;
let ctx;
let world;
// let keyboard;

// function die den code ausführt
function init() {
    canvas = document.getElementById("canvas");
    // world = new World(canvas);
    ctx = canvas.getContext("2d");
    console.log("my Character is ", World);
}

// scriptmodule benötigt window, mit onload funktioniert das nicht
window.addEventListener("load", init);
