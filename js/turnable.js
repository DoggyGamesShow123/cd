let cd, cdTop;
let angle = 0;
let lastMouseAngle = 0;
let dragging = false;

let angularVelocity = 0;     // degrees/frame
let friction = 0.96;         // disc slows down
let spinning = false;

function initTurntable() {
    cd = document.getElementById("cd");
    cdTop = document.getElementById("cd-top");

    cd.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    animateSpin();
}

function dragStart(e) {
    dragging = true;
    spinning = false;
    angularVelocity = 0;
    lastMouseAngle = mouseAngle(e);
}

function dragMove(e) {
    if (!dragging) return;

    const a = mouseAngle(e);
    const delta = a - lastMouseAngle;

    angularVelocity = delta;       // store velocity
    angle += delta;

    cd.style.transform = `rotateZ(${angle}deg)`;

    lastMouseAngle = a;

    handleScratch(delta);         // triggers hybrid S3 engine
}

function dragEnd() {
    dragging = false;
    spinning = true;
}

function animateSpin() {
    requestAnimationFrame(animateSpin);

    if (!spinning) return;

    angularVelocity *= friction;

    angle += angularVelocity;

    cd.style.transform = `rotateZ(${angle}deg)`;

    if (Math.abs(angularVelocity) < 0.05) {
        spinning = false;
    }
}

function mouseAngle(e) {
    const rect = cd.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
}
