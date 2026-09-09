export class MyAudio {
    file;
    isLoaded;

    constructor(_file) {
        this.file = new Audio(_file);
        this.file.preload = "auto";

        this.file.addEventListener("canplaythrough", () => {
            this.isLoaded = true;
        });
    }
}
