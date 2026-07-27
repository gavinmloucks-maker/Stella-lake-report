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

// --- Background music (real audio file, controlled via the <audio> tag) ---

// Defaults to ON the very first time the app runs (no saved preference
// yet), so it tries to auto-start. After that, it remembers whatever
// you last set it to.
function ambientEnabled() {
    let stored = localStorage.getItem("stellaAmbientEnabled");
    if (stored === null) return true;
    return stored === "true";
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
    btn.innerHTML = ambientEnabled() ? "🎵 Music On" : "🎵 Music Off";
}

function startAmbient() {
    let audio = document.getElementById("ambientAudio");
    if (!audio) return;
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Playback blocked until user interacts:", e));
}

function stopAmbient() {
    let audio = document.getElementById("ambientAudio");
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
}

// Plays a tap sound for ANY button press anywhere in the app.
document.addEventListener("click", (e) => {
    let btn = e.target.closest("button");
    if (btn) playTap();
});

window.addEventListener("load", () => {
    updateSoundButton();
    updateAmbientButton();
    if (ambientEnabled()) {
        // Try immediately — succeeds on repeat visits in some browsers.
        startAmbient();
        // Retry on the first tap of anything, in case the browser
        // blocked the attempt above (very common on a first visit).
        document.body.addEventListener("click", function starter() {
            startAmbient();
            document.body.removeEventListener("click", starter);
        }, { once: true });
    }
});
