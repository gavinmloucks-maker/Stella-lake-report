// 🌊 Stella AI (Stella Lake Report V2.2)
// User Interface Controller

function updateDashboard(data) {

    let activities = calculateAllActivities(data.bestHour);

    let winner = Object.entries(activities)
        .sort((a, b) => b[1] - a[1])[0];

    let lakeScore = Math.round(
        (activities.wakeboard + activities.surf + activities.ski + activities.tube) / 4
    );

    document.getElementById("lakeScore").innerHTML = lakeScore;
    document.getElementById("winner").innerHTML = winner[0];
    document.getElementById("wakeScore").innerHTML = activities.wakeboard + "/100";
    document.getElementById("surfScore").innerHTML = activities.surf + "/100";
    document.getElementById("skiScore").innerHTML = activities.ski + "/100";
    document.getElementById("tubeScore").innerHTML = activities.tube + "/100";

    updateConditions(data);
    updateGreeting(data, lakeScore);
    updateMessages(data, winner, lakeScore);
    updateSunsetPredictor(data);
    renderTimeline(data.hours, SETTINGS.preferences.mainActivity);
}

function updateConditions(data) {
    document.getElementById("airDisplay").innerHTML = Math.round(data.current.air) + "°F";
    document.getElementById("waterDisplay").innerHTML = Math.round(data.current.water) + "°F";
    document.getElementById("windDisplay").innerHTML = Math.round(data.bestHour.wind) + " mph";
    document.getElementById("cloudDisplay").innerHTML = Math.round(data.bestHour.clouds) + "%";

    let humidityEl = document.getElementById("humidityDisplay");
    if (humidityEl && data.bestHour.humidity != null) {
        humidityEl.innerHTML = Math.round(data.bestHour.humidity) + "%";
    }

    let uvEl = document.getElementById("uvDisplay");
    if (uvEl && data.bestHour.uv != null) {
        uvEl.innerHTML = Math.round(data.bestHour.uv);
    }
}

function updateGreeting(data, score) {
    let el = document.getElementById("greeting");
    if (!el) return;

    let hour = new Date().getHours();
    let timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

    let activityLabels = {
        wakeboard: "wakeboard",
        surf: "wakesurf",
        ski: "ski",
        tube: "tube"
    };

    let activity = SETTINGS.preferences.mainActivity;
    let window = getRideWindow(data.hours, activity);

    let windowText = window
        ? `${formatLakeTime(window.start)}–${formatLakeTime(window.end)}`
        : "later today";

    el.innerHTML = `
        🌊 Good ${timeOfDay}, ${SETTINGS.user.name}.<br>
        Today's best ${activityLabels[activity]} window is ${windowText}.<br>
        Lake Score: ${score}/100<br>
        ${score >= 90 ? "Glass conditions expected." : getLakeMood(score)}
    `;
}

function updateMessages(data, winner, score) {

    document.getElementById("lakeMood").innerHTML = getLakeMood(score);
    document.getElementById("lakeSummary").innerHTML = getLakeSummary(score);

    document.getElementById("winnerReason").innerHTML =
        `Best choice today based on wind, temperature, and water conditions.`;

    document.getElementById("factorBreakdown").innerHTML = explainFactors(data.bestHour);

    document.getElementById("lakeIQ").innerHTML =
        generateLakeIQ(data.bestHour, SETTINGS.preferences.mainActivity, data.waitRec);

    let confidence = boatConfidenceLabel(score);

    document.getElementById("boatDecision").innerHTML =
        score >= 80
            ? `🚤 TAKE THE BOAT<br><span style="font-size:16px">${score}% · Confidence ${confidence}</span>`
            : "⏳ MAYBE WAIT";

    document.getElementById("boatReason").innerHTML =
        score >= 80
            ? "Conditions are worth getting out there."
            : "The lake may improve later.";

    document.getElementById("fortune").innerHTML = getRandomFortune();
}

function boatConfidenceLabel(score) {
    if (score >= 90) return "Very High";
    if (score >= 78) return "High";
    if (score >= 60) return "Medium";
    return "Low";
}

function getLakeMood(score) {
    score = Number(score);
    if (score >= 95) return "🔥 Glass Factory";
    if (score >= 85) return "😎 Perfect Lake Day";
    if (score >= 70) return "🌊 Solid Session";
    if (score >= 50) return "🧊 Rideable";
    return "🌧️ Better Day Coming";
}

function getLakeSummary(score) {
    if (score >= 95) return "One of those days you remember all winter.";
    if (score >= 85) return "Great conditions. Time to make some memories.";
    if (score >= 70) return "Definitely worth a lake session.";
    return "Conditions are holding the day back.";
}

// Picks a random message from a MESSAGES category (data/messages.js)
function pickMessage(category) {
    let arr = MESSAGES[category];
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

function explainFactors(hour) {
    let lines = [];

    if (hour.air >= 80) lines.push(pickMessage("greatAir"));
    else if (hour.air < 65) lines.push(pickMessage("coldAir"));

    if (hour.water >= 77) lines.push(pickMessage("greatWater"));
    else if (hour.water < 70) lines.push(pickMessage("coldWater"));

    if (hour.wind <= 6) lines.push(pickMessage("calm"));
    else if (hour.wind >= 12) lines.push(pickMessage("windy"));

    if (hour.rain >= 30) lines.push(pickMessage("rain"));

    if (lines.length === 0) lines.push("Conditions are moderate across the board.");

    return lines.join("<br>");
}

// "Lake IQ" — explains WHY today scored what it did, in points.
function generateLakeIQ(hour, activity, waitRec) {
    let breakdown = getScoreBreakdown(hour, activity);
    let lines = [];

    let windCost = Math.round((100 - breakdown.wind) * breakdown.weights.wind);
    let airCost = Math.round((100 - breakdown.air) * breakdown.weights.air);
    let waterCost = Math.round((100 - breakdown.water) * breakdown.weights.water);

    if (windCost >= 3) lines.push(`💨 Wind costs you ${windCost} points.`);
    if (airCost >= 3) lines.push(`🌡️ Air temperature costs you ${airCost} points.`);
    if (waterCost >= 3) lines.push(`🌊 Water costs you ${waterCost} points.`);

    if (breakdown.water >= 90) lines.push("🌊 Water is nearly perfect.");
    if (breakdown.wind >= 95) lines.push("💨 Wind is essentially glass.");

    if (waitRec && waitRec.action === "wait" && waitRec.gain >= 5) {
        lines.push(`⏳ Waiting until ${formatLakeTime(waitRec.until)} gains ${waitRec.gain} points.`);
    }

    if (lines.length === 0) lines.push("Balanced conditions across the board.");

    return lines.join("<br>");
}

function updateSunsetPredictor(data) {
    let timeEl = document.getElementById("sunsetTime");
    let scoreEl = document.getElementById("sunsetScore");
    let noteEl = document.getElementById("sunsetNote");

    if (!timeEl || !data.sun || !data.sun.sunset || !data.hours || data.hours.length === 0) {
        return;
    }

    let sunsetTime = data.sun.sunset;
    timeEl.innerHTML = formatLakeTime(sunsetTime);

    // Find the forecast hour closest to sunset
    let closest = data.hours.reduce((a, b) =>
        Math.abs(b.time - sunsetTime) < Math.abs(a.time - sunsetTime) ? b : a
    );

    let activity = SETTINGS.preferences.mainActivity;
    let score = calculateActivityScore(closest, activity);

    scoreEl.innerHTML = `${score}/100`;

    noteEl.innerHTML =
        closest.wind <= 5 ? "🪞 Glass expected." :
        closest.wind <= 10 ? "🌊 Light chop expected." :
        "💨 Breezy — may not be glassy.";
}

// Renders the hour-by-hour timeline (e.g. "9 AM — 94 ⭐")
function renderTimeline(hours, activity) {
    let el = document.getElementById("timeline");
    if (!el || !hours || hours.length === 0) return;

    let timeline = createTimeline(hours, activity);
    let topScore = Math.max(...timeline.map(h => h.score));

    el.innerHTML = timeline.map(h => {
        let isBest = h.score === topScore;
        return `<div class="time${isBest ? " best" : ""}">${formatLakeTime(h.time)} — ${h.score} ${h.stars}</div>`;
    }).join("");
}
