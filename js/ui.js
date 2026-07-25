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
    updateHighs(data);
    updateGreeting(data, lakeScore);

    document.getElementById("lakeMood").innerHTML = getLakeMood(lakeScore);
    document.getElementById("lakeSummary").innerHTML = getLakeSummary(lakeScore);
    document.getElementById("fortune").innerHTML = getRandomFortune();

    updateSunsetPredictor(data);

    let timelineTitleEl = document.getElementById("timelineTitle");
    if (timelineTitleEl) {
        timelineTitleEl.innerHTML = data.dayOffset === 1 ? "📈 Tomorrow's Timeline" : "📈 Today's Timeline";
    }
    renderTimeline(data.hours, SETTINGS.preferences.mainActivity);
}

// Always shows RIGHT NOW conditions — never changes with the Today/Tomorrow toggle.
function updateConditions(data) {
    document.getElementById("airDisplay").innerHTML = Math.round(data.current.air) + "°F";
    document.getElementById("waterDisplay").innerHTML = Math.round(data.current.water) + "°F";

    let windEl = document.getElementById("windDisplay");
    if (windEl && data.current.wind != null) windEl.innerHTML = Math.round(data.current.wind) + " mph";

    let gustEl = document.getElementById("gustDisplay");
    if (gustEl && data.current.gust != null) gustEl.innerHTML = Math.round(data.current.gust) + " mph";

    let cloudEl = document.getElementById("cloudDisplay");
    if (cloudEl && data.current.clouds != null) cloudEl.innerHTML = Math.round(data.current.clouds) + "%";

    let uvEl = document.getElementById("uvDisplay");
    if (uvEl && data.current.uv != null) uvEl.innerHTML = Math.round(data.current.uv);
}

// Switches between Today's Highs / Tomorrow's Highs based on the toggle.
function updateHighs(data) {
    let titleEl = document.getElementById("highsTitle");
    if (titleEl) titleEl.innerHTML = data.dayOffset === 1 ? "📈 Tomorrow's Highs" : "📈 Today's Highs";

    if (!data.hours || data.hours.length === 0) return;

    let highAirHour = data.hours.reduce((a, b) => (b.air > a.air ? b : a));
    let peakUvHour = data.hours.reduce((a, b) => (b.uv > a.uv ? b : a));

    let highAirEl = document.getElementById("highAirDisplay");
    if (highAirEl) highAirEl.innerHTML = `${Math.round(highAirHour.air)}° @ ${formatLakeTime(highAirHour.time)}`;

    let peakUvEl = document.getElementById("highsPeakUvDisplay");
    if (peakUvEl) peakUvEl.innerHTML = `${Math.round(peakUvHour.uv)} @ ${formatLakeTime(peakUvHour.time)}`;

    let bestWindEl = document.getElementById("bestTimeWindDisplay");
    if (bestWindEl && data.bestHour) {
        bestWindEl.innerHTML = `${Math.round(data.bestHour.wind)} mph @ ${formatLakeTime(data.bestHour.time)}`;
    }
}

function updateGreeting(data, score) {
    let el = document.getElementById("greeting");
    if (!el) return;

    let activityLabels = { wakeboard: "wakeboard", surf: "wakesurf", ski: "ski", tube: "tube" };
    let activity = SETTINGS.preferences.mainActivity;
    let window = getRideWindow(data.hours, activity);

    let windowText = window
        ? `${formatLakeTime(window.start)}–${formatLakeTime(window.end)}`
        : "later in the day";

    if (data.dayOffset === 1) {
        el.innerHTML = `
            🌊 Tomorrow's best ${activityLabels[activity]} window is ${windowText}.<br>
            Lake Score: ${score}/100<br>
            ${score >= 90 ? "Glass conditions expected." : getLakeMood(score)}
        `;
        return;
    }

    let hour = new Date().getHours();
    let timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

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

    let ranked = [...timeline].sort((a, b) => b.score - a.score);
    let rankMap = new Map();
    ranked.forEach((h, i) => rankMap.set(h.time.getTime(), i));

    let rows = timeline.map((t, i) => {
        let hour = hours[i];
        let rank = rankMap.get(t.time.getTime());
        let tierClass = "";
        if (rank === 0) tierClass = "tier-1";
        else if (rank <= 2) tierClass = "tier-2";
        else if (rank <= 4) tierClass = "tier-3";

        return `
            <tr class="${tierClass}">
                <td>${formatLakeTime(t.time)}</td>
                <td>${Math.round(hour.air)}°</td>
                <td>${Math.round(hour.wind)} mph</td>
                <td>${t.score} ${t.stars}</td>
            </tr>
        `;
    }).join("");

    el.innerHTML = `
        <table class="timelineTable">
            <thead>
                <tr><th>Time</th><th>Air</th><th>Wind</th><th>Score</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}
