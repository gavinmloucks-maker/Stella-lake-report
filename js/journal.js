// 🌊 Stella AI (Stella Lake Report V2.2)
// Lake Journal

function getLakeJournal() {
    return JSON.parse(localStorage.getItem("lakeJournal")) || [];
}

function setLakeJournal(journal) {
    localStorage.setItem("lakeJournal", JSON.stringify(journal));
}

function saveLakeSession(session) {
    let journal = getLakeJournal();
    journal.push(session);
    setLakeJournal(journal);
}

function saveToday() {
    if (!lakeData) return;

    let activity = SETTINGS.preferences.mainActivity;

    let session = {
        date: new Date().toLocaleDateString(),
        lake: SETTINGS.location.name,
        activity: activity,
        score: Number(document.getElementById("lakeScore").innerHTML),
        air: lakeData.current.air,
        water: lakeData.current.water,
        wind: lakeData.bestHour.wind,
        hour: new Date(lakeData.bestHour.time).getHours(),
        accuracyRating: null,  // "How accurate was today's score?" (1-5 stars)
        funRating: null,       // "How much fun did you actually have?" (0-100)
        notes: ""
    };

    saveLakeSession(session);

    document.getElementById("saved").innerHTML = "✅ Lake day saved! Rate it below.";
    let prompt = document.getElementById("ratingPrompt");
    if (prompt) prompt.style.display = "block";
}

function rateAccuracy(stars) {
    let journal = getLakeJournal();
    if (journal.length === 0) return;

    journal[journal.length - 1].accuracyRating = stars;
    setLakeJournal(journal);

    let el = document.getElementById("accuracyConfirm");
    if (el) el.innerHTML = "⭐".repeat(stars) + " saved";
}

function rateFun(score) {
    let journal = getLakeJournal();
    if (journal.length === 0) return;

    journal[journal.length - 1].funRating = Number(score);
    setLakeJournal(journal);

    let el = document.getElementById("funConfirm");
    if (el) el.innerHTML = `${score}/100 saved`;

    adjustAdaptiveWeights();
}

function saveNotes(text) {
    let journal = getLakeJournal();
    if (journal.length === 0) return;

    journal[journal.length - 1].notes = text;
    setLakeJournal(journal);
}

// --- Adaptive AI groundwork ---
// Compares how much fun the user actually had against the score the
// app predicted for that day, and gently nudges
// SETTINGS.adaptive.scoreAccuracyMultiplier based on the trend across
// the last 10 rated sessions. Capped at +/-15% so it can't run away.
function adjustAdaptiveWeights() {
    let journal = getLakeJournal();
    let rated = journal.filter(d => d.funRating != null);

    if (rated.length < 3) return; // not enough data yet

    let recent = rated.slice(-10);
    let avgDiff = recent.reduce((sum, d) => sum + (d.funRating - d.score), 0) / recent.length;

    let adjustment = Math.max(-0.15, Math.min(0.15, avgDiff / 200));
    SETTINGS.adaptive.scoreAccuracyMultiplier = Math.min(1.15, Math.max(0.85, 1 + adjustment));
}
