import { AudioHub } from "./classen_js/audio-hub.class.js";
import { IntervalHub } from "./classen_js/interval-hub.class.js";
import { Keyboard } from "./classen_js/keyboard.class.js";
import { World } from "./classen_js/world.class.js";

let world;
let canvas;
let isPaused;
const landingPage = document.getElementById("landing-page");
const settingsScreen = document.getElementById("settings-screen");
const howtoScreen = document.getElementById("howto-screen");
const gameOverScreen = document.getElementById("game-over");
const gameWinScreen = document.getElementById("game-win");
const btnStart = document.getElementById("btn-start");
const btnSettings = document.getElementById("btn-settings");
const btnMute = document.getElementById("btn-mute");
const btnHowTo = document.getElementById("btn-howto");
const btnSettingsBack = document.getElementById("btn-settings-back");
const btnHowToBack = document.getElementById("btn-howto-back");

const pauseScreen = document.getElementById("pause-screen");
const ingameControls = document.getElementById("ingame-controls");
const btnInGameMute = document.getElementById("btn-ingame-mute");
const btnInGamePause = document.getElementById("btn-ingame-pause");
const btnResume = document.getElementById("btn-resume");

function init() {
    canvas = document.getElementById("canvas");
    hideEndScreens();
    initAudioSettings();
}
window.addEventListener("load", init);

function hideEndScreens() {
    if (gameOverScreen) gameOverScreen.classList.add("d-none");
    if (gameWinScreen) gameWinScreen.classList.add("d-none");
}

function initAudioSettings() {
    const savedMuteStatus = localStorage.getItem("elPolloLoco_muted");
    AudioHub.IS_MUTED = savedMuteStatus === "true";
    updateMuteButtonUI();
}

function updateMuteButtonUI() {
    const mainMuteIcon = btnMute ? btnMute.querySelector("img") : null;
    const ingameMuteIcon = btnInGameMute ? btnInGameMute.querySelector("img") : null;

    const iconSrc = AudioHub.IS_MUTED ? "./assets/icons/volume-mute.svg" : "./assets/icons/volume-up.svg";
    const altText = AudioHub.IS_MUTED ? "Ton-Aus" : "Ton-An";

    if (AudioHub.IS_MUTED) {
        AudioHub.STOP_ALL();
    } else if (world && !isPaused) {
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
    if (mainMuteIcon) {
        mainMuteIcon.src = iconSrc;
        mainMuteIcon.alt = altText;
    }
    if (ingameMuteIcon) {
        ingameMuteIcon.src = iconSrc;
        ingameMuteIcon.alt = altText;
    }

    //     if (muteIcon) {
    //         muteIcon.src = "./assets/icons/volume-mute.svg";
    //         muteIcon.alt = "Ton-Aus";
    //     }
    // } else {
    //     if (muteIcon) {
    //         muteIcon.src = "./assets/icons/volume-up.svg";
    //         muteIcon.alt = "Ton-An";
    //     }
}

function togglePause() {
    if (!world) return;
    isPaused = !isPaused;

    window.isGamePaused = isPaused;

    if (isPaused) {
        AudioHub.STOP_ALL();
        if (pauseScreen) pauseScreen.classList.remove("d-none");
    } else {
        if (pauseScreen) pauseScreen.classList.add("d-none");

        // world.run();
        // world.character.animate();
        if (!AudioHub.IS_MUTED) AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

if (btnStart) {
    btnStart.addEventListener("click", startNewGame);
}

function startNewGame() {
    landingPage.classList.add("d-none");
    if (ingameControls) ingameControls.classList.remove("d-none");

    hideEndScreens();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    isPaused = false;
    world = new World(canvas);
}

document.querySelectorAll(".btn-home").forEach((btn) => {
    btn.addEventListener("click", () => {
        if (ingameControls) ingameControls.classList.add("d-none");
        if (pauseScreen) pauseScreen.classList.add("d-none");
        backToHome();
    });
});

if (btnInGamePause) btnInGamePause.addEventListener("click", togglePause);
if (btnResume) btnResume.addEventListener("click", togglePause);
if (btnInGameMute) btnInGameMute.addEventListener("click", toggleMute);

function bindTouchButton(elementId, keyboardKey) {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (!world || isPaused) return;
        Keyboard[keyboardKey] = true;
        if (
            (keyboardKey === "LEFT" || keyboardKey === "RIGHT") &&
            !world.character.isDead() &&
            !world.character.isAboveGround() &&
            AudioHub.PEPE_RUN.file.paused
        ) {
            AudioHub.PLAY_ONE(AudioHub.PEPE_RUN, true);
        }
        if (keyboardKey === "UP" && !world.character.isDead() && !world.character.isAboveGround()) {
            AudioHub.PLAY_ONE(AudioHub.PEPE_JUMP);
            AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
        }
    });
    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        Keyboard[keyboardKey] = false;

        if (keyboardKey === "LEFT" && !Keyboard.RIGHT) AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
        if (keyboardKey === "RIGHT" && !Keyboard.LEFT) AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
    });
}

bindTouchButton("touch-left", "LEFT");
bindTouchButton("touch-right", "RIGHT");
bindTouchButton("touch-jump", "UP");
bindTouchButton("touch-throw", "Space");

function toggleMute() {
    AudioHub.IS_MUTED = !AudioHub.IS_MUTED;
    localStorage.setItem("elPolloLoco_muted", AudioHub.IS_MUTED);
    updateMuteButtonUI();
    if (AudioHub.IS_MUTED) {
        AudioHub.STOP_ALL();
    } else if (world && !isPaused) {
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

function backToHome() {
    hideEndScreens();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    world = null;
    landingPage.classList.remove("d-none");
}

window.showGameOver = function () {
    AudioHub.STOP_ALL();
    AudioHub.PLAY_ONE(AudioHub.PEPE_DEAD);
    IntervalHub.stopAllInterval();
    if (gameOverScreen) gameOverScreen.classList.remove("d-none");
};

window.showGameWin = function () {
    AudioHub.STOP_ALL();
    IntervalHub.stopAllInterval();
    if (gameWinScreen) gameWinScreen.classList.remove("d-none");
};

btnSettings.addEventListener("click", () => {
    landingPage.classList.add("d-none");
    settingsScreen.classList.remove("d-none");
});

btnSettingsBack.addEventListener("click", () => {
    settingsScreen.classList.add("d-none");
    landingPage.classList.remove("d-none");
});

btnHowTo.addEventListener("click", () => {
    settingsScreen.classList.add("d-none");
    howtoScreen.classList.remove("d-none");
});

btnHowToBack.addEventListener("click", () => {
    howtoScreen.classList.add("d-none");
    settingsScreen.classList.remove("d-none");
});

btnMute.addEventListener("click", toggleMute);

btnStart.addEventListener("click", () => {
    landingPage.classList.add("d-none");
    world = new World(canvas);
});

window.addEventListener("keydown", (e) => {
    if (!world || isPaused) return;

    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = true;
        if (world.character && !world.character.isDead() && !world.character.isAboveGround() && AudioHub.PEPE_RUN.file.paused) {
            AudioHub.PLAY_ONE(AudioHub.PEPE_RUN, true);
        }
    }
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = true;
        if (world.character && !world.character.isDead() && !world.character.isAboveGround() && AudioHub.PEPE_RUN.file.paused) {
            AudioHub.PLAY_ONE(AudioHub.PEPE_RUN, true);
        }
    }
    if (e.code == "ArrowUp") {
        Keyboard.UP = true;
        if (world.character && !world.character.isDead() && !world.character.isAboveGround()) {
            AudioHub.PLAY_ONE(AudioHub.PEPE_JUMP);
            AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
        }
    }
    if (e.code == "Space") Keyboard.Space = true;
});

window.addEventListener("keyup", (e) => {
    if (!world) return;

    if (e.code == "ArrowRight") {
        Keyboard.RIGHT = false;
        if (!Keyboard.LEFT) AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
    }
    if (e.code == "ArrowLeft") {
        Keyboard.LEFT = false;
        if (!Keyboard.RIGHT) AudioHub.STOP_ONE(AudioHub.PEPE_RUN);
    }
    if (e.code == "ArrowUp") Keyboard.UP = false;
    if (e.code == "Space") Keyboard.Space = false;
});

document.querySelectorAll(".btn-restart").forEach((btn) => {
    btn.addEventListener("click", startNewGame);
});
