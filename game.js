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

/** Initializes the game world, audio settings, and mobile zoom protection. */
function init() {
    hideEndScreens();
    initAudioSettings();
    window.isGameOver = false;
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    zoomLock();
}

/** Installs both touch zoom prevention handlers. */
function zoomLock() {
    preventMultiTouchZoom();
    preventDoubleTapZoom();
}

/** Prevents browser zoom gestures involving multiple touch points. */
function preventMultiTouchZoom() {
    document.addEventListener(
        "touchstart",
        (e) => {
            if (e.touches.length > 1) e.preventDefault();
        },
        { passive: false },
    );
}

/** Prevents rapid double-tap zoom on touch devices. */
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

/** Hides both game result screens. */
function hideEndScreens() {
    if (gameOverScreen) gameOverScreen.classList.add("d-none");
    if (gameWinScreen) gameWinScreen.classList.add("d-none");
}

/** Restores persisted mute and volume settings and refreshes the UI. */
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

/** Synchronizes mute playback and icon state. */
function updateMuteButtonUI() {
    updateMuteAudio();
    updateMuteIcons();
}

/** Starts or stops background audio according to current state. */
function updateMuteAudio() {
    if (AudioHub.IS_MUTED) {
        AudioHub.STOP_ALL();
    } else if (world && !isPaused) {
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

/** Updates the main and in-game mute icon sources and labels. */
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

/** Toggles the active game's pause state and pause screen. */
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

/** Resets global game state and starts a new world instance. */
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

/** Shows or hides touch controls based on the current device and game state. */
function checkIsMobile() {
    const isMobile = isMobileDevice();
    const controls = document.getElementById("mobile-controls");
    if (controls) {
        !isMobile || window.isGameOver ? controls.classList.add("d-none") : controls.classList.remove("d-none");
    }
}

/** Detects touch-capable mobile devices without classifying narrow desktop windows as mobile. */
function isMobileDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
}

/** Renders the appropriate keyboard or touch instruction template.
 * @param {boolean} isMobile Whether mobile instructions should be used.
 */
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

/** Connects a touch control element to one shared keyboard state.
 * @param {string} elementId DOM id of the touch button.
 * @param {string} keyboardKey Keyboard state property to update.
 */
function bindTouchButton(elementId, keyboardKey) {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    bindTouchStart(btn, keyboardKey);
    bindTouchEnd(btn, keyboardKey);
}

/** Binds the touch-start transition for a virtual control.
 * @param {HTMLElement} btn Touch control element.
 * @param {string} keyboardKey Keyboard state property to set.
 */
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

/** Binds the touch-end transition for a virtual control.
 * @param {HTMLElement} btn Touch control element.
 * @param {string} keyboardKey Keyboard state property to clear.
 */
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

/** Toggles persisted mute state and synchronizes playback and controls. */
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

/** Stops the active game and returns to the landing page. */
function backToHome() {
    hideEndScreens();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    world = null;
    landingPage.classList.remove("d-none");
}

/** Displays the game-over screen and stops active gameplay.
 * @returns {void}
 */
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

/** Displays the win screen and stops active gameplay.
 * @returns {void}
 */
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

updateControlInstructions(isMobileDevice());
