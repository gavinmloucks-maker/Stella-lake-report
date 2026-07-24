// 🌊 Stella Lake Report V2.2
// Scoring Engine

function clamp(value) {
    return Math.max(0, Math.min(100, value));
}

// Air temperature — penalties escalate sharply below 65,
// since cold air is what actually ruins a ride (cold falls).
function airTemperatureScore(temp) {
    if (temp >= 82 && temp <= 88) return 100;
    if (temp >= 78) return 92;
    if (temp >= 72) return 82;
    if (temp >= 68) return 68;
    if (temp >= 65) return 50;
    if (temp >= 60) return 25;   // steep drop starts here
    if (temp >= 55) return 10;
    return 0;
}

function waterTemperatureScore(temp) {
    if (temp >= 80) return 100;
    if (temp >= 77) return 90;
    if (temp >= 74) return 80;
    if (temp >= 70) return 60;
    if (temp >= 67) return 40;
    if (temp >= 65) return 20;
    return 5;
}

// Wakeboard / Ski wind — wind above 15 absolutely tanks the score.
function wakeWindScore(wind) {
    if (wind <= 5) return 100;
    if (wind <= 8) return 90;
    if (wind <= 10) return 75;
    if (wind <= 12) return 55;
    if (wind <= 15) return 25;
    if (wind <= 18) return 8;
    return 2;
}

// Wakesurf prefers slightly calmer conditions
function surfWindScore(wind) {
    if (wind <= 3) return 100;
    if (wind <= 6) return 95;
    if (wind <= 10) return 75;
    if (wind <= 13) return 35;
    if (wind <= 15) return 15;
    return 3;
}

// Tube likes some wind (chop is part of the fun)
function tubeWindScore(wind) {
    if (wind >= 8 && wind <= 18) return 100;
    if (wind >= 5) return 85;
    if (wind <= 25) return 70;
    return 45;
}

function weatherScore(data) {
    let score = 100;
    score -= data.clouds * 0.2;
    score -= data.rain * 0.5;
    return clamp(score);
}

// Pulls weights from SETTINGS so the Adaptive AI phase can tune
// them per-user without touching this file again.
function getWeights(activity) {
    return SETTINGS.weights[activity];
}

function windScoreForActivity(wind, activity) {
    if (activity === "surf") return surfWindScore(wind);
    if (activity === "tube") return tubeWindScore(wind);
    return wakeWindScore(wind); // wakeboard + ski share a curve
}

function calculateActivityScore(data, activity) {
    let air = airTemperatureScore(data.air);
    let water = waterTemperatureScore(data.water);
    let weather = weatherScore(data);
    let wind = windScoreForActivity(data.wind, activity);

    let w = getWeights(activity);
    if (!w) return null;

    let raw =
        wind * w.wind +
        air * w.air +
        water * w.water +
        weather * w.weather;

    // Adaptive AI multiplier (starts at 1.0 — neutral until
    // the journal has enough ratings to adjust it)
    raw *= SETTINGS.adaptive.scoreAccuracyMultiplier;

    return Math.round(clamp(raw));
}

function calculateAllActivities(data) {
    return {
        wakeboard: calculateActivityScore(data, "wakeboard"),
        surf: calculateActivityScore(data, "surf"),
        ski: calculateActivityScore(data, "ski"),
        tube: calculateActivityScore(data, "tube")
    };
}

// Returns each factor's individual sub-score for a given activity —
// this is what powers "Lake IQ" (why today scored what it did) and
// the What-If Simulator (later phase) needs this same breakdown.
function getScoreBreakdown(data, activity) {
    return {
        air: airTemperatureScore(data.air),
        water: waterTemperatureScore(data.water),
        wind: windScoreForActivity(data.wind, activity),
        weather: weatherScore(data),
        weights: getWeights(activity)
    };
}
