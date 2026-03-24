let cd, cdTop, cdBottom;
let angle = 0;
let lastMouseAngle = 0;
let dragging = false;

function initTurntable() {
    cd = document.getElementById("cd");
    cdTop = document.getElementById("cd-top");

    cd.addEventListener("mousedown", onDragStart);
    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
}

function onDragStart(e) {
    dragging = true;
    lastMouseAngle = getMouseAngle(e);
}

function onDragMove(e) {
    if (!dragging) return;

    const a = getMouseAngle(e);
    const delta = a - lastMouseAngle;
    lastMouseAngle = a;

    angle += delta;
    cd.style.transform = `rotateZ(${angle}deg)`;

    handleScratch(delta);
}

function onDragEnd() {
    dragging = false;
}

function getMouseAngle(e) {
    const rect = cd.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
}
