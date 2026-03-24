let pitchRate = 1.0;

function initPitchSlider() {
    const slider = document.getElementById("pitchSlider");
    const label = document.getElementById("pitchValue");

    slider.addEventListener("input", () => {
        const pct = slider.value;
        label.innerText = pct + "%";

        pitchRate = 1 + (pct / 100);     // -50% → +50%
        
        if (sourceNode) {
            sourceNode.playbackRate.value = pitchRate;
        }
    });
}
