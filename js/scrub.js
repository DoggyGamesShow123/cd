function handleScratch(deltaAngle) {
    if (!normalBuffer) return;

    // degrees → seconds mapping
    const secondsPerDegree = duration / 360;
    let deltaTime = deltaAngle * secondsPerDegree;

    // Apply pitch multiplier
    deltaTime *= pitchRate;

    let speedAbs = Math.abs(deltaAngle);

    if (speedAbs < 3) {
        // continuous slow movement
        setAudioPosition(currentTime + deltaTime);
    } else {
        // jump mode (CDJ-like)
        setAudioPosition(currentTime + (deltaTime * 4));
    }
}
``
