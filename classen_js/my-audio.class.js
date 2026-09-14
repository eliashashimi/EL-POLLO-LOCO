export class MyAudio {
    file;
    isLoaded;

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
