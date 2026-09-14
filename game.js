import { AudioHub } from "./classen_js/audio-hub.class.js";
import { IntervalHub } from "./classen_js/interval-hub.class.js";
import { Keyboard } from "./classen_js/keyboard.class.js";
import { World } from "./classen_js/world.class.js";
import { instructionsTemp, mobileInstructionsTemp } from "./js/template.js";

let world;
let canvas;
let isPaused;
let globalVolume = 0.4;
let highGraphics = true;
const volumeSlider = document.getElementById("volume-slider");
const volumeValue = document.getElementById("volume-value");
const btnGraphics = document.getElementById("btn-graphics");
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
const btnImpressum = document.getElementById("btn-impressum");
const btnImpressumBack = document.getElementById("btn-impressum-back");
const impressumScreen = document.getElementById("impressum-screen");
const pauseScreen = document.getElementById("pause-screen");
const ingameControls = document.getElementById("ingame-controls");
const btnInGameMute = document.getElementById("btn-ingame-mute");
const btnInGamePause = document.getElementById("btn-ingame-pause");
const btnResume = document.getElementById("btn-resume");
window.isPepeRunningSoundPlaying = false;

function init() {
    hideEndScreens();
    initAudioSettings();
    window.isGameOver = false;
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    zoomLock();
}

function zoomLock() {
    preventMultiTouchZoom();
    preventDoubleTapZoom();
}

function preventMultiTouchZoom() {
    document.addEventListener(
        "touchstart",
        (e) => {
            if (e.touches.length > 1) e.preventDefault();
        },
        { passive: false },
    );
}

function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    document.addEventListener(
        "touchend",
        (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) e.preventDefault();
            lastTouchEnd = now;
        },
        { passive: false },
    );
}

function hideEndScreens() {
    if (gameOverScreen) gameOverScreen.classList.add("d-none");
    if (gameWinScreen) gameWinScreen.classList.add("d-none");
}

function initAudioSettings() {
    const savedMuteStatus = localStorage.getItem("elPolloLoco_muted");
    AudioHub.IS_MUTED = savedMuteStatus === "true";
    const savedVolume = localStorage.getItem("elPolloLoco_volume");
    if (savedVolume !== null) {
        globalVolume = parseFloat(savedVolume);
        if (volumeSlider) volumeSlider.value = globalVolume * 100;
        if (volumeValue) volumeValue.innerText = Math.round(globalVolume * 100) + "%";
    }
    updateMuteButtonUI();
}

function updateMuteButtonUI() {
    updateMuteAudio();
    updateMuteIcons();
}

function updateMuteAudio() {
    if (AudioHub.IS_MUTED) {
        AudioHub.STOP_ALL();
    } else if (world && !isPaused) {
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

function updateMuteIcons() {
    const mainMuteIcon = btnMute ? btnMute.querySelector("img") : null;
    const ingameMuteIcon = btnInGameMute ? btnInGameMute.querySelector("img") : null;
    const iconSrc = AudioHub.IS_MUTED ? "./assets/icons/volume-mute.svg" : "./assets/icons/volume-up.svg";
    const altText = AudioHub.IS_MUTED ? "Ton-Aus" : "Ton-An";
    if (mainMuteIcon) {
        mainMuteIcon.src = iconSrc;
        mainMuteIcon.alt = altText;
    }
    if (ingameMuteIcon) {
        ingameMuteIcon.src = iconSrc;
        ingameMuteIcon.alt = altText;
    }
}

if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
        const sliderVal = e.target.value;
        globalVolume = sliderVal / 100;
        if (volumeValue) volumeValue.innerText = sliderVal + "%";
        localStorage.setItem("elPolloLoco_volume", globalVolume);
        AudioHub.ALL_SOUNDS.forEach((sound) => {
            sound.file.volume = globalVolume;
        });
        if (sliderVal == 0 && !AudioHub.isMuted) {
            toggleMute();
        } else if (sliderVal > 0 && AudioHub.isMuted) {
            toggleMute();
        }
    });
}

if (btnGraphics) {
    btnGraphics.addEventListener("click", () => {
        highGraphics = !highGraphics;
        window.isLowGraphics = !highGraphics;
        if (highGraphics) {
            btnGraphics.innerText = "Qualität: Hoch";
            btnGraphics.style.color = "#ffffff";
        } else {
            btnGraphics.innerText = "Qualität: Niedrig";
            btnGraphics.style.color = "#ff9800";
        }
    });
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
        if (!AudioHub.IS_MUTED) AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

if (btnStart) {
    btnStart.addEventListener("click", startNewGame);
}

function startNewGame() {
    window.scrollTo(0, 1);
    hideEndScreens();
    landingPage.classList.add("d-none");
    if (ingameControls) ingameControls.classList.remove("d-none");
    checkIsMobile();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    isPaused = false;
    window.isGameOver = false;
    init();
}

function checkIsMobile() {
    const isMobile =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 1024 ||
        window.matchMedia("(pointer: coarse)").matches ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const controls = document.getElementById("mobile-controls");
    if (controls) {
        !isMobile || window.isGameOver ? controls.classList.add("d-none") : controls.classList.remove("d-none");
    }
}

function updateControlInstructions(isMobile) {
    const list = document.getElementById("instructions-list");
    if (!list) return;
    if (isMobile) {
        list.innerHTML = mobileInstructionsTemp();
    } else {
        list.innerHTML = instructionsTemp();
    }
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
    bindTouchStart(btn, keyboardKey);
    bindTouchEnd(btn, keyboardKey);
}

function bindTouchStart(btn, keyboardKey) {
    btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (!world || isPaused || window.isGameOver) return;
        Keyboard[keyboardKey] = true;
        if ((keyboardKey === "LEFT" || keyboardKey === "RIGHT") && !isPepeRunningSoundPlaying) {
            isPepeRunningSoundPlaying = true;
        }
    });
}

function bindTouchEnd(btn, keyboardKey) {
    btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        Keyboard[keyboardKey] = false;
        if (keyboardKey === "LEFT" || keyboardKey === "RIGHT") {
            isPepeRunningSoundPlaying = false;
        }
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
    window.isGameOver = true;
    AudioHub.STOP_ALL();
    AudioHub.PLAY_ONE(AudioHub.PEPE_DEAD);
    IntervalHub.stopAllInterval();
    if (gameOverScreen) gameOverScreen.classList.remove("d-none");
    const controls = document.getElementById("mobile-controls");
    if (controls) controls.classList.add("d-none");
    checkIsMobile();
};

window.showGameWin = function () {
    window.isGameOver = true;
    AudioHub.STOP_ALL();
    IntervalHub.stopAllInterval();
    if (gameWinScreen) gameWinScreen.classList.remove("d-none");
    const controls = document.getElementById("mobile-controls");
    if (controls) controls.classList.add("d-none");
    checkIsMobile();
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

if (btnImpressum && impressumScreen && settingsScreen) {
    btnImpressum.addEventListener("click", () => {
        settingsScreen.classList.add("d-none");
        impressumScreen.classList.remove("d-none");
    });
}

if (btnImpressumBack && impressumScreen && settingsScreen) {
    btnImpressumBack.addEventListener("click", () => {
        impressumScreen.classList.add("d-none");
        settingsScreen.classList.remove("d-none");
    });
}

btnMute.addEventListener("click", toggleMute);

window.addEventListener("keydown", (e) => {
    if (!world || isPaused) return;
    if (e.code == "ArrowRight") Keyboard.RIGHT = true;
    if (e.code == "ArrowLeft") Keyboard.LEFT = true;
    if (e.code == "ArrowUp") Keyboard.UP = true;
    if (e.code == "Space") Keyboard.Space = true;
});

window.addEventListener("keyup", (e) => {
    if (!world) return;
    if (e.code == "ArrowRight") Keyboard.RIGHT = false;
    if (e.code == "ArrowLeft") Keyboard.LEFT = false;
    if (e.code == "ArrowUp") Keyboard.UP = false;
    if (e.code == "Space") Keyboard.Space = false;
});

document.querySelectorAll(".btn-restart").forEach((btn) => {
    btn.addEventListener("click", startNewGame);
});

const isMobileDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
updateControlInstructions(isMobileDevice);
