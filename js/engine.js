let audioCtx;
let normalBuffer;
let sourceNode;
let playing = false;
let currentTime = 0;
let lastTimestamp = 0;
let duration = 0;

function initAudioEngine() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

async function loadAudioFromFile(file) {
    const buf = await file.arrayBuffer();
    normalBuffer = await audioCtx.decodeAudioData(buf);
    duration = normalBuffer.duration;
    updateTimeDisplay(0, duration);
}

function playAudio() {
    if (playing || !normalBuffer) return;

    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = normalBuffer;

    sourceNode.connect(audioCtx.destination);
    sourceNode.start(0, currentTime);

    lastTimestamp = audioCtx.currentTime;
    playing = true;
}

function pauseAudio() {
    if (!playing) return;
    sourceNode.stop();
    sourceNode.disconnect();
    currentTime += audioCtx.currentTime - lastTimestamp;
    playing = false;
}

function setAudioPosition(newTime) {
    newTime = Math.max(0, Math.min(duration, newTime));
    currentTime = newTime;

    if (playing) {
        pauseAudio();
        playAudio();
    }

    updateTimeDisplay(currentTime, duration);
}

function updateTimeDisplay(cur, dur) {
    document.getElementById("timeDisplay").innerText =
        `${formatTime(cur)} / ${formatTime(dur)}`;
}
``
