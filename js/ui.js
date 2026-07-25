function updateDashboard(data) {
    let activities = calculateAllActivities(data.bestHour);
    let winner = Object.entries(activities).sort((a, b) => b[1] - a[1])[0];

    let lakeScore = Math.round(
        (activities.wakeboard + activities.surf + activities.ski + activities.tube) / 4
    );

    document.getElementById("lakeScore").innerHTML = lakeScore;
    document.getElementById("wakeScore").innerHTML = activities.wakeboard + "/100";
    document.getElementById("surfScore").innerHTML = activities.surf + "/100";
    document.getElementById("skiScore").innerHTML = activities.ski + "/100";
    document.getElementById("tubeScore").innerHTML = activities.tube + "/100";
    document.getElementById("winnerNote").innerHTML = `🏆 Best today: ${winner[0]}`;

    updateConditions(data);
    updateGreeting(data, lakeScore);

    document.getElementById("lakeMood").innerHTML = getLakeMood(lakeScore);
    document.getElementById("lakeSummary").innerHTML = getLakeSummary(lakeScore);
    document.getElementById("fortune").innerHTML = getRandomFortune();

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

    let activityLabels = { wakeboard: "wakeboard", surf: "wakesurf", ski: "ski", tube: "tube" };
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

function updateSunsetPredictor(data) {
    let timeEl = document.getElementById("sunsetTime");
    let scoreEl = document.getElementById("sunsetScore");
    let noteEl = document.getElementById("sunsetNote");

    if (!timeEl || !data.sun || !data.sun.sunset || !data.hours || data.hours.length === 0) return;

    let sunsetTime = data.sun.sunset;
    timeEl.innerHTML = formatLakeTime(sunsetTime);

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
