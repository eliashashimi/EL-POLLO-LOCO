/** Wraps an HTML audio element used by the game's audio hub. */
export class MyAudio {
    file;
    isLoaded;

    /** @param {string} _file Audio source path. @param {boolean} [loop=false] Whether playback loops. */
    constructor(_file, loop = false) {
        this.file = new Audio(_file);
        this.file.preload = "auto";
        this.file.loop = loop;
        // this.file.muted = isMuted;

        this.file.addEventListener("canplaythrough", () => {
            this.isLoaded = true;
        });
    }
}
