import { MyAudio } from "./my-audio.class.js";

/** Central registry and playback API for all game sounds.
 * @extends MyAudio
 */
export class AudioHub extends MyAudio {
    static IS_MUTED = false;

    static PEPE_DAMAGE = new MyAudio("./assets/audio/character/characterDamage.mp3");
    static PEPE_DEAD = new MyAudio("./assets/audio/character/characterDead.wav");
    static PEPE_JUMP = new MyAudio("./assets/audio/character/characterJump.wav");
    static PEPE_RUN = new MyAudio("./assets/audio/character/characterRun.mp3");
    static PEPE_SNORING = new MyAudio("./assets/audio/character/characterSnoring.mp3");

    static CHICKEN_DEAD = new MyAudio("./assets/audio/chicken/chickenDead.mp3");
    static SMALL_CHICKEN_DEAD = new MyAudio("./assets/audio/chicken/chickenDead2.mp3");

    static ENDBOSS = new MyAudio("./assets/audio/endboss/endbossApproach.wav");

    static COLLECT_COIN = new MyAudio("./assets/audio/collectibles/collectSound.wav");
    static COLLECT_BOTTLE = new MyAudio("./assets/audio/collectibles/bottleCollectSound.wav");

    static BOTTLE_BREAK = new MyAudio("./assets/audio/throwable/bottleBreak.mp3");

    static BACKGROUND_MUSIC = new MyAudio("./assets/audio/background_music.mp3");

    static ALL_SOUNDS = [
        AudioHub.PEPE_DAMAGE,
        AudioHub.PEPE_DEAD,
        AudioHub.PEPE_JUMP,
        AudioHub.PEPE_RUN,
        AudioHub.PEPE_SNORING,
        AudioHub.CHICKEN_DEAD,
        AudioHub.SMALL_CHICKEN_DEAD,
        AudioHub.ENDBOSS,
        AudioHub.COLLECT_COIN,
        AudioHub.COLLECT_BOTTLE,
        AudioHub.BOTTLE_BREAK,
        AudioHub.BACKGROUND_MUSIC,
    ];

    /** Plays one sound unless global muting is enabled.
     * @static
     * @param {MyAudio} sound Sound wrapper to play.
     * @param {boolean} [loop=false] Whether playback should loop.
     * @returns {void}
     */
    static PLAY_ONE(sound, loop = false) {
        if (AudioHub.IS_MUTED) return;

        if (!loop) {
            sound.file.pause();
            sound.file.currentTime = 0;
        } else if (!sound.file.paused) return;

        sound.file.volume = sound.file.volume || 0.4;
        sound.file.loop = loop;
        sound.file.play().catch(() => {});
    }

    /** Stops and rewinds every registered sound.
     * @static
     */
    static STOP_ALL() {
        AudioHub.ALL_SOUNDS.forEach((sound) => {
            sound.file.pause();
            sound.file.currentTime = 0;
        });
    }

    /** Stops one sound without changing the global mute state.
     * @static
     * @param {MyAudio} sound Sound wrapper to stop.
     */
    static STOP_ONE(sound) {
        sound.file.pause();
    }
}
