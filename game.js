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

/**
 * Initializes the game world, audio settings, and mobile zoom protection.
 * @returns {void}
 */
function init() {
    hideEndScreens();
    initAudioSettings();
    window.isGameOver = false;
    canvas = document.getElementById("canvas");
    world = new World(canvas);
    zoomLock();
}

/**
 * Installs both touch zoom prevention handlers.
 * @returns {void}
 */
function zoomLock() {
    preventMultiTouchZoom();
    preventDoubleTapZoom();
}

/**
 * Prevents browser zoom gestures involving multiple touch points.
 * @returns {void}
 */
function preventMultiTouchZoom() {
    document.addEventListener(
        "touchstart",
        (e) => {
            if (e.touches.length > 1 && e.cancelable) e.preventDefault();
        },
        { passive: false },
    );
}

/**
 * Prevents rapid double-tap zoom on touch devices.
 * @returns {void}
 */
function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    document.addEventListener(
        "touchend",
        (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300 && e.cancelable) e.preventDefault();
            lastTouchEnd = now;
        },
        { passive: false },
    );
}

/**
 * Hides both game result screens.
 * @returns {void}
 */
function hideEndScreens() {
    if (gameOverScreen) gameOverScreen.classList.add("d-none");
    if (gameWinScreen) gameWinScreen.classList.add("d-none");
}

/**
 * Restores the persisted mute state from localStorage (muted by default).
 * @returns {void}
 */
function loadMutedState() {
    const savedMuted = localStorage.getItem("elPolloLoco_muted");
    AudioHub.IS_MUTED = savedMuted !== null ? savedMuted === "true" : true;
}

/**
 * Initializes the muted startup state, restores volume, and refreshes the UI.
 * @returns {void}
 */
function initAudioSettings() {
    const savedVolume = localStorage.getItem("elPolloLoco_volume");
    if (savedVolume !== null) {
        globalVolume = parseFloat(savedVolume);
        if (volumeSlider) volumeSlider.value = globalVolume * 100;
        if (volumeValue) volumeValue.innerText = Math.round(globalVolume * 100) + "%";
    }
    updateMuteButtonUI();
}

/**
 * Synchronizes mute playback and icon state.
 * @returns {void}
 */
function updateMuteButtonUI() {
    updateMuteAudio();
    updateMuteIcons();
}

/**
 * Starts or stops background audio according to current state.
 * @returns {void}
 */
function updateMuteAudio() {
    if (AudioHub.IS_MUTED) {
        AudioHub.STOP_ALL();
    } else if (world && !isPaused) {
        AudioHub.PLAY_ONE(AudioHub.BACKGROUND_MUSIC, true);
    }
}

/**
 * Updates the main and in-game mute icon sources and labels.
 * @returns {void}
 */
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

/**
 * Registers the input listener of the volume slider.
 * @returns {void}
 */
function initVolumeSlider() {
    if (volumeSlider) volumeSlider.addEventListener("input", onVolumeInput);
}

/**
 * Applies the slider value to the volume state, UI, storage, and all sounds.
 * @param {Event} e Input event of the volume slider.
 * @returns {void}
 */
function onVolumeInput(e) {
    const sliderVal = e.target.value;
    globalVolume = sliderVal / 100;
    if (volumeValue) volumeValue.innerText = sliderVal + "%";
    localStorage.setItem("elPolloLoco_volume", globalVolume);
    AudioHub.ALL_SOUNDS.forEach((sound) => {
        sound.file.volume = globalVolume;
    });
    syncMuteWithVolume(sliderVal);
}

/**
 * Toggles mute when the slider reaches 0 or rises above 0 while muted.
 * @param {number|string} sliderVal Current slider value (0-100).
 * @returns {void}
 */
function syncMuteWithVolume(sliderVal) {
    if (sliderVal == 0 && !AudioHub.IS_MUTED) {
        toggleMute();
    } else if (sliderVal > 0 && AudioHub.IS_MUTED) {
        toggleMute();
    }
}

/**
 * Registers the click listener of the graphics quality button.
 * @returns {void}
 */
function initGraphicsButton() {
    if (btnGraphics) btnGraphics.addEventListener("click", toggleGraphics);
}

/**
 * Toggles between high and low graphics quality and updates the button.
 * @returns {void}
 */
function toggleGraphics() {
    highGraphics = !highGraphics;
    window.isLowGraphics = !highGraphics;
    if (highGraphics) {
        btnGraphics.innerText = "Qualität: Hoch";
        btnGraphics.style.color = "#ffffff";
    } else {
        btnGraphics.innerText = "Qualität: Niedrig";
        btnGraphics.style.color = "#ff9800";
    }
}

/**
 * Toggles the active game's pause state and pause screen.
 * @returns {void}
 */
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

/**
 * Resets global game state and starts a new world instance.
 * @returns {void}
 */
function startNewGame() {
    if (world) world.isDestroyed = true;
    window.scrollTo(0, 1);
    hideEndScreens();
    window.isGameOver = false;
    landingPage.classList.add("d-none");
    if (ingameControls) ingameControls.classList.remove("d-none");
    checkIsMobile();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    isPaused = false;
    init();
}

/**
 * Shows or hides touch controls based on the current device and game state.
 * @returns {void}
 */
function checkIsMobile() {
    const isMobile = isMobileDevice();
    const controls = document.getElementById("mobile-controls");
    if (controls) {
        !isMobile || window.isGameOver ? controls.classList.add("d-none") : controls.classList.remove("d-none");
    }
}

/**
 * Detects touch-capable mobile devices without classifying narrow desktop windows as mobile.
 * @returns {boolean} True if the device is considered a mobile/touch device.
 */
function isMobileDevice() {
    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
}

/**
 * Renders the appropriate keyboard or touch instruction template.
 * @param {boolean} isMobile Whether mobile instructions should be used.
 * @returns {void}
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

/**
 * Registers the click listeners of all home buttons.
 * @returns {void}
 */
function initHomeButtons() {
    document.querySelectorAll(".btn-home").forEach((btn) => {
        btn.addEventListener("click", onHomeClick);
    });
}

/**
 * Hides in-game overlays and returns to the landing page.
 * @returns {void}
 */
function onHomeClick() {
    if (ingameControls) ingameControls.classList.add("d-none");
    if (pauseScreen) pauseScreen.classList.add("d-none");
    backToHome();
}

/**
 * Registers the click listeners of all restart buttons.
 * @returns {void}
 */
function initRestartButtons() {
    document.querySelectorAll(".btn-restart").forEach((btn) => {
        btn.addEventListener("click", startNewGame);
    });
}

/**
 * Registers the click listeners of the in-game pause, resume, and mute buttons.
 * @returns {void}
 */
function initIngameButtons() {
    if (btnInGamePause) btnInGamePause.addEventListener("click", togglePause);
    if (btnResume) btnResume.addEventListener("click", togglePause);
    if (btnInGameMute) btnInGameMute.addEventListener("click", toggleMute);
}

/**
 * Connects a touch control element to one shared keyboard state.
 * @param {string} elementId DOM id of the touch button.
 * @param {string} keyboardKey Keyboard state property to update.
 * @returns {void}
 */
function bindTouchButton(elementId, keyboardKey) {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    bindTouchStart(btn, keyboardKey);
    bindTouchEnd(btn, keyboardKey);
}

/**
 * Binds the touch-start transition for a virtual control.
 * @param {HTMLElement} btn Touch control element.
 * @param {string} keyboardKey Keyboard state property to set.
 * @returns {void}
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

/**
 * Binds the touch-end transition for a virtual control.
 * @param {HTMLElement} btn Touch control element.
 * @param {string} keyboardKey Keyboard state property to clear.
 * @returns {void}
 */
function bindTouchEnd(btn, keyboardKey) {
    btn.addEventListener("touchend", (e) => {
        if (e.cancelable) e.preventDefault();
        Keyboard[keyboardKey] = false;
        if (keyboardKey === "LEFT" || keyboardKey === "RIGHT") {
            isPepeRunningSoundPlaying = false;
        }
    });
}

/**
 * Binds all virtual touch buttons to their keyboard states.
 * @returns {void}
 */
function initTouchControls() {
    bindTouchButton("touch-left", "LEFT");
    bindTouchButton("touch-right", "RIGHT");
    bindTouchButton("touch-jump", "UP");
    bindTouchButton("touch-throw", "Space");
}

/**
 * Toggles persisted mute state and synchronizes playback and controls.
 * @returns {void}
 */
function toggleMute() {
    AudioHub.IS_MUTED = !AudioHub.IS_MUTED;
    localStorage.setItem("elPolloLoco_muted", AudioHub.IS_MUTED);
    updateMuteButtonUI();
}

/**
 * Stops the active game and returns to the landing page.
 * @returns {void}
 */
function backToHome() {
    if (world) world.isDestroyed = true;
    hideEndScreens();
    IntervalHub.stopAllInterval();
    AudioHub.STOP_ALL();
    world = null;
    landingPage.classList.remove("d-none");
}

/**
 * Displays the game-over screen and stops active gameplay.
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

/**
 * Displays the win screen and stops active gameplay.
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

/**
 * Hides one screen and shows another.
 * @param {HTMLElement} hideEl Screen element to hide.
 * @param {HTMLElement} showEl Screen element to show.
 * @returns {void}
 */
function switchScreen(hideEl, showEl) {
    hideEl.classList.add("d-none");
    showEl.classList.remove("d-none");
}

/**
 * Registers the navigation between the impressum and settings screens.
 * @returns {void}
 */
function initImpressumNavigation() {
    if (btnImpressum && impressumScreen && settingsScreen) {
        btnImpressum.addEventListener("click", () => switchScreen(settingsScreen, impressumScreen));
    }
    if (btnImpressumBack && impressumScreen && settingsScreen) {
        btnImpressumBack.addEventListener("click", () => switchScreen(impressumScreen, settingsScreen));
    }
}

/**
 * Registers the start, settings, how-to, and mute buttons plus the impressum navigation.
 * @returns {void}
 */
function initMenuNavigation() {
    if (btnStart) btnStart.addEventListener("click", startNewGame);
    btnSettings.addEventListener("click", () => switchScreen(landingPage, settingsScreen));
    btnSettingsBack.addEventListener("click", () => switchScreen(settingsScreen, landingPage));
    btnHowTo.addEventListener("click", () => switchScreen(settingsScreen, howtoScreen));
    btnHowToBack.addEventListener("click", () => switchScreen(howtoScreen, settingsScreen));
    btnMute.addEventListener("click", toggleMute);
    initImpressumNavigation();
}

/**
 * Sets a keyboard state flag for a pressed or released key.
 * @param {string} code Keyboard event code (e.g. "ArrowLeft", "Space").
 * @param {boolean} isPressed True on keydown, false on keyup.
 * @returns {void}
 */
function setKeyState(code, isPressed) {
    if (code === "ArrowRight") Keyboard.RIGHT = isPressed;
    if (code === "ArrowLeft") Keyboard.LEFT = isPressed;
    if (code === "ArrowUp") Keyboard.UP = isPressed;
    if (code === "Space") Keyboard.Space = isPressed;
}

/**
 * Handles key presses while a game is running and not paused.
 * @param {KeyboardEvent} e Keydown event.
 * @returns {void}
 */
function onKeyDown(e) {
    if (!world || isPaused) return;
    setKeyState(e.code, true);
}

/**
 * Handles key releases while a game is running.
 * @param {KeyboardEvent} e Keyup event.
 * @returns {void}
 */
function onKeyUp(e) {
    if (!world) return;
    setKeyState(e.code, false);
}

/**
 * Registers the global keydown and keyup listeners.
 * @returns {void}
 */
function initKeyboardControls() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
}

/**
 * Initializes audio, instructions, and registers all event listeners.
 * @returns {void}
 */
function initApp() {
    loadMutedState();
    initAudioSettings();
    updateControlInstructions(isMobileDevice());
    initVolumeSlider();
    initGraphicsButton();
    initMenuNavigation();
    initIngameButtons();
    initHomeButtons();
    initRestartButtons();
    initTouchControls();
    initKeyboardControls();
}

initApp();
