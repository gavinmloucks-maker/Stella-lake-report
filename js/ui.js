function updateConditions(data) {
    let titleEl = document.getElementById("conditionsTitle");
    let airLabelEl = document.getElementById("airLabel");
    let waterLabelEl = document.getElementById("waterLabel");

    if (data.dayOffset === 1) {
        if (titleEl) titleEl.innerHTML = "📡 Conditions At Best Time";
        if (airLabelEl) airLabelEl.innerHTML = "🌡️ High Air";
        if (waterLabelEl) waterLabelEl.innerHTML = "🌊 Water (est.)";

        let highAir = Math.max(...data.hours.map(h => h.air));
        document.getElementById("airDisplay").innerHTML = Math.round(highAir) + "°F";
        document.getElementById("waterDisplay").innerHTML = Math.round(data.current.water) + "°F";
    } else {
        if (titleEl) titleEl.innerHTML = "📡 Current Conditions";
        if (airLabelEl) airLabelEl.innerHTML = "🌡️ Air";
        if (waterLabelEl) waterLabelEl.innerHTML = "🌊 Water";

        document.getElementById("airDisplay").innerHTML = Math.round(data.current.air) + "°F";
        document.getElementById("waterDisplay").innerHTML = Math.round(data.current.water) + "°F";
    }

    document.getElementById("windDisplay").innerHTML = Math.round(data.bestHour.wind) + " mph";
    document.getElementById("cloudDisplay").innerHTML = Math.round(data.bestHour.clouds) + "%";

    let gustEl = document.getElementById("gustDisplay");
    if (gustEl && data.bestHour.gust != null) {
        gustEl.innerHTML = Math.round(data.bestHour.gust) + " mph";
    }

    let peakUvEl = document.getElementById("peakUvDisplay");
    if (peakUvEl && data.hours && data.hours.length > 0) {
        let peak = data.hours.reduce((a, b) => (b.uv > a.uv ? b : a));
        peakUvEl.innerHTML = `${Math.round(peak.uv)} @ ${formatLakeTime(peak.time)}`;
    }
}

function renderTimeline(hours, activity) {
    let el = document.getElementById("timeline");
    if (!el || !hours || hours.length === 0) return;

    let timeline = createTimeline(hours, activity);

    // Rank hours by score so the best one gets the strongest highlight
    // and the next few fade out from there, instead of one hour lit up.
    let ranked = [...timeline].sort((a, b) => b.score - a.score);
    let rankMap = new Map();
    ranked.forEach((h, i) => rankMap.set(h.time.getTime(), i));

    el.innerHTML = timeline.map(h => {
        let rank = rankMap.get(h.time.getTime());
        let tierClass = "";
        if (rank === 0) tierClass = "tier-1";
        else if (rank <= 2) tierClass = "tier-2";
        else if (rank <= 4) tierClass = "tier-3";

        return `<div class="time${tierClass ? " " + tierClass : ""}">${formatLakeTime(h.time)} — ${h.score} ${h.stars}</div>`;
    }).join("");
}
