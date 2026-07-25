function getRatings() {
    return JSON.parse(localStorage.getItem("lakeRatings")) || [];
}

function saveRatingsList(list) {
    localStorage.setItem("lakeRatings", JSON.stringify(list));
}

function recordPrediction() {
    if (!lakeData) return;

    let ratings = getRatings();
    ratings.push({
        date: new Date().toISOString(),
        predictedScore: Number(document.getElementById("lakeScore").innerHTML),
        accuracyRating: null,
        funRating: null
    });
    saveRatingsList(ratings);

    let prompt = document.getElementById("ratingPrompt");
    if (prompt) prompt.style.display = "block";
}

function rateAccuracy(stars) {
    let ratings = getRatings();
    if (ratings.length === 0) return;

    ratings[ratings.length - 1].accuracyRating = stars;
    saveRatingsList(ratings);

    let el = document.getElementById("accuracyConfirm");
    if (el) el.innerHTML = "⭐".repeat(stars) + " saved";
}

function rateFun(score) {
    let ratings = getRatings();
    if (ratings.length === 0) return;

    ratings[ratings.length - 1].funRating = Number(score);
    saveRatingsList(ratings);

    let el = document.getElementById("funConfirm");
    if (el) el.innerHTML = `${score}/100 saved`;

    adjustAdaptiveWeights();
}

// Nudges SETTINGS.adaptive.scoreAccuracyMultiplier based on the gap
// between predicted score and actual fun, across the last 10 ratings.
// Capped at +/-15%. Resets to 1.0 on reload since SETTINGS isn't
// persisted — only the ratings themselves are (in localStorage).
function adjustAdaptiveWeights() {
    let ratings = getRatings().filter(r => r.funRating != null);
    if (ratings.length < 3) return;

    let recent = ratings.slice(-10);
    let avgDiff = recent.reduce((sum, r) => sum + (r.funRating - r.predictedScore), 0) / recent.length;

    let adjustment = Math.max(-0.15, Math.min(0.15, avgDiff / 200));
    SETTINGS.adaptive.scoreAccuracyMultiplier = Math.min(1.15, Math.max(0.85, 1 + adjustment));
}
