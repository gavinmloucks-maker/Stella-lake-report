let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function soundEnabled() {
    return localStorage.getItem("stellaSoundEnabled") === "true";
}

function toggleSound() {
    let enabled = !soundEnabled();
    localStorage.setItem("stellaSoundEnabled", enabled ? "true" : "false");
    updateSoundButton();
    if (enabled) playChime();
}

function updateSoundButton() {
    let btn = document.getElementById("soundBtn");
    if (!btn) return;
    btn.classList.toggle("active", soundEnabled());
    btn.innerHTML = soundEnabled() ? "🔊 Sound On" : "🔈 Sound Off";
}

function playChime() {
    if (!soundEnabled()) return;
    try {
        let ctx = getAudioContext();
        let now = ctx.currentTime;

        [880, 1320].forEach((freq, i) => {
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, now + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.4);
        });
    } catch (e) {
        console.log("Sound error:", e);
    }
}

function playTap() {
    if (!soundEnabled()) return;
    try {
        let ctx = getAudioContext();
        let now = ctx.currentTime;
        let osc = ctx.createOscillator();
        let gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    } catch (e) {
        console.log("Sound error:", e);
    }
}

let ambientSource = null;
let ambientGain = null;

function ambientEnabled() {
    return localStorage.getItem("stellaAmbientEnabled") === "true";
}

function toggleAmbient() {
    let enabled = !ambientEnabled();
    localStorage.setItem("stellaAmbientEnabled", enabled ? "true" : "false");
    updateAmbientButton();
    if (enabled) startAmbient(); else stopAmbient();
}

function updateAmbientButton() {
    let btn = document.getElementById("ambientBtn");
    if (!btn) return;
    btn.classList.toggle("active", ambientEnabled());
    btn.innerHTML = ambientEnabled() ? "🎵 Ambient On" : "🎵 Ambient Off";
}

// Soft looping water-like ambience made from filtered noise —
// no audio file needed, nothing to host or license.
function startAmbient() {
    if (ambientSource) return;
    try {
        let ctx = getAudioContext();

        let bufferSize = 2 * ctx.sampleRate;
        let buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        let data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        ambientSource = ctx.createBufferSource();
        ambientSource.buffer = buffer;
        ambientSource.loop = true;

        let filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 500;

        ambientGain = ctx.createGain();
        ambientGain.gain.value = 0.04;

        ambientSource.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(ctx.destination);

        ambientSource.start();
    } catch (e) {
        console.log("Ambient error:", e);
    }
}

function stopAmbient() {
    if (ambientSource) {
        try { ambientSource.stop(); } catch (e) {}
        ambientSource.disconnect();
        ambientSource = null;
    }
}

window.addEventListener("load", () => {
    updateSoundButton();
    updateAmbientButton();
    if (ambientEnabled()) {
        document.body.addEventListener("click", function starter() {
            startAmbient();
            document.body.removeEventListener("click", starter);
        }, { once: true });
    }
});
