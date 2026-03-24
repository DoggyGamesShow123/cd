function handleScratch(deltaAngle) {
    if (!normalBuffer) return;

    const angleSpeed = deltaAngle;

    // Convert degrees to time movement
    const secondsPerDegree = duration / 360;
    let deltaTime = angleSpeed * secondsPerDegree;

    // HYBRID MODEL:
    // Slow movements = continuous playbackRate style
    // Fast movements = direct reposition jumps

    const speedAbs = Math.abs(angleSpeed);

    if (speedAbs < 3) {
        // continuous
        let newTime = currentTime + deltaTime;
        setAudioPosition(newTime);
    } else {
        // jump (simulates CDJ)
        let newTime = currentTime + (deltaTime * 4);
        setAudioPosition(newTime);
    }
}
