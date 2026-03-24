async function initTurntableApp() {
    initAudioEngine();
    initTurntable();

    const fileInput = document.getElementById("fileInput");

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.name.endsWith(".zip")) {
            const zip = await JSZip.loadAsync(file);
            let mp3File, coverFile;

            zip.forEach((path, entry) => {
                if (path.endsWith(".mp3")) mp3File = entry;
                if (/\.(jpg|jpeg|png)$/i.test(path)) coverFile = entry;
            });

            if (coverFile) {
                const blob = await coverFile.async("blob");
                cdTop.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
            }

            if (mp3File) {
                const blob = await mp3File.async("blob");
                await loadAudioFromFile(new File([blob], "song.mp3"));
            }
        } else {
            cdTop.style.backgroundImage = "url(default_cover.png)";
            await loadAudioFromFile(file);
        }
    });

    document.getElementById("playBtn").onclick = playAudio;
    document.getElementById("pauseBtn").onclick = pauseAudio;
}
