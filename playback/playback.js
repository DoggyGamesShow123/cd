// playback/playback.js
// UNIVERSAL PLAYBACK ENGINE FOR CD PLAYER + TURNTABLE SCRATCHING

export class PlaybackEngine {
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.buffer = null;
        this.source = null;
        this.playing = false;

        this.position = 0;
        this.lastTime = 0;
        this.duration = 0;

        this.pitch = 1.0;

        this.eventCallbacks = {
            timeupdate: [],
            ready: []
        };

        this._ticker();
    }

    /* ------------------------------
       LOAD AUDIO FILE
    --------------------------------*/
    async loadFile(file) {
        const arrayBuffer = await file.arrayBuffer();
        this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);

        this.duration = this.buffer.duration;
        this.position = 0;

        this._emit("ready", this.duration);
    }

    /* ------------------------------
       CREATE SOURCE NODE
    --------------------------------*/
    _createSource() {
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.playbackRate.value = this.pitch;
        this.source.connect(this.audioCtx.destination);
    }

    /* ------------------------------
       PLAY
    --------------------------------*/
    play() {
        if (!this.buffer || this.playing) return;

        this._createSource();
        this.source.start(0, this.position);

        this.lastTime = this.audioCtx.currentTime;
        this.playing = true;

        this.source.onended = () => {
            if (this.position >= this.duration - 0.05) {
                this.stop();
                this.position = 0;
            }
        };
    }

    /* ------------------------------
       PAUSE
    --------------------------------*/
    pause() {
        if (!this.playing) return;

        this.source.stop();
        this.source.disconnect();

        this.position += (this.audioCtx.currentTime - this.lastTime) * this.pitch;
        this.playing = false;
    }

    /* ------------------------------
       STOP
    --------------------------------*/
    stop() {
        if (this.source) {
            try { this.source.stop(); } catch {}
            this.source.disconnect();
        }
        this.playing = false;
    }

    /* ------------------------------
       SET POSITION (Used for scratching)
    --------------------------------*/
    setPosition(t) {
        if (!this.buffer) return;

        this.position = Math.max(0, Math.min(this.duration, t));

        if (this.playing) {
            // restart audio at new position
            this.pause();
            this.play();
        }

        this._emit("timeupdate", this.position, this.duration);
    }

    /* ------------------------------
       SCRATCH HANDLE
       deltaTime = time movement from turntable.js
    --------------------------------*/
    scratch(deltaTime) {
        let newPos = this.position + deltaTime;
        this.setPosition(newPos);
    }

    /* ------------------------------
       SET PITCH (0.5x to 2.0x)
    --------------------------------*/
    setPitch(multiplier) {
        this.pitch = multiplier;

        if (this.playing && this.source) {
            this.source.playbackRate.value = multiplier;
        }
    }

    /* ------------------------------
       EVENT HANDLER
    --------------------------------*/
    on(event, callback) {
        if (this.eventCallbacks[event]) {
            this.eventCallbacks[event].push(callback);
        }
    }

    _emit(event, ...data) {
        if (this.eventCallbacks[event]) {
            for (let cb of this.eventCallbacks[event]) cb(...data);
        }
    }

    /* ------------------------------
       INTERNAL: TIME TICKER
    --------------------------------*/
    _ticker() {
        requestAnimationFrame(() => this._ticker());

        if (this.playing) {
            let now = this.audioCtx.currentTime;
            let delta = (now - this.lastTime) * this.pitch;

            this.position += delta;

            this.lastTime = now;

            this._emit("timeupdate", this.position, this.duration);

            if (this.position >= this.duration) {
                this.stop();
                this.position = 0;
            }
        }
    }
}
