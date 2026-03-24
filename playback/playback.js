/* ==========================================================
   GLOBAL PLAYBACK ENGINE FOR CD PLAYER / DJ TURNTABLE SYSTEM
   Works with: turntable.js, scrub.js, pitch.js, engine.js
   ========================================================== */

(function () {

    class PlaybackEngine {
        constructor() {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.buffer = null;
            this.source = null;
            this.playing = false;

            this.position = 0;        // current timestamp in seconds
            this.lastTime = 0;        // previous audioCtx time
            this.duration = 0;

            this.pitch = 1.0;         // speed modifier (setPitch)
            this.scratchActive = false;

            // event listeners (timeupdate, ready)
            this.eventCallbacks = {
                timeupdate: [],
                ready: []
            };

            this._ticker();
        }

        /* ==========================================================
           LOAD FILE (MP3 / WAV / ZIP extracted data)
        ========================================================== */
        async loadFile(file) {
            const arrayBuffer = await file.arrayBuffer();
            this.buffer = await this.audioCtx.decodeAudioData(arrayBuffer);

            this.duration = this.buffer.duration;
            this.position = 0;

            this._emit("ready", this.duration);
        }

        /* ==========================================================
           INTERNAL AUDIO SOURCE CREATION
        ========================================================== */
        _createSource() {
            this.source = this.audioCtx.createBufferSource();
            this.source.buffer = this.buffer;
            this.source.playbackRate.value = this.pitch;
            this.source.connect(this.audioCtx.destination);
        }

        /* ==========================================================
           PLAYBACK CONTROL
        ========================================================== */
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

        pause() {
            if (!this.playing) return;

            this.source.stop();
            this.source.disconnect();

            this.position += (this.audioCtx.currentTime - this.lastTime) * this.pitch;
            this.playing = false;
        }

        stop() {
            if (this.source) {
                try { this.source.stop(); } catch {}
                this.source.disconnect();
            }
            this.playing = false;
        }

        /* ==========================================================
           SEEKING / SCRATCHING
        ========================================================== */
        setPosition(seconds) {
            if (!this.buffer) return;

            this.position = Math.max(0, Math.min(this.duration, seconds));

            if (this.playing) {
                this.pause();
                this.play();
            }

            this._emit("timeupdate", this.position, this.duration);
        }

        /* ==========================================================
           SCRATCHING (called from turntable.js / scrub.js)
        ========================================================== */
        scratch(deltaSeconds) {
            const newPos = this.position + deltaSeconds;
            this.setPosition(newPos);
        }

        /* ==========================================================
           PITCH CONTROL
        ========================================================== */
        setPitch(multiplier) {
            this.pitch = multiplier;

            if (this.playing && this.source) {
                this.source.playbackRate.value = multiplier;
            }
        }

        /* ==========================================================
           EVENT HANDLING
        ========================================================== */
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

        /* ==========================================================
           INTERNAL TIME TICKER (updates playback)
        ========================================================== */
        _ticker() {
            requestAnimationFrame(() => this._ticker());

            if (this.playing) {
                const now = this.audioCtx.currentTime;
                const delta = (now - this.lastTime) * this.pitch;

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

    // Export globally
    window.PlaybackEngine = PlaybackEngine;

})();
``
