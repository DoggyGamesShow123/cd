function formatTime(sec) {
    sec = Math.floor(sec);
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}
