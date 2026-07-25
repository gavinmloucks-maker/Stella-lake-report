function recordWaterReading(waterTemp) {
    if (waterTemp == null || isNaN(waterTemp)) return;

    let history = getWaterHistory();
    let todayKey = new Date().toDateString();

    let existingIndex = history.findIndex(h => h.date === todayKey);
    if (existingIndex >= 0) {
        history[existingIndex].temp = waterTemp;
    } else {
        history.push({ date: todayKey, temp: waterTemp });
    }

    history = history.slice(-10);
    localStorage.setItem("stellaWaterHistory", JSON.stringify(history));
}

function getWaterHistory() {
    try {
        return JSON.parse(localStorage.getItem("stellaWaterHistory")) || [];
    } catch (e) {
        return [];
    }
}

function getWaterTrend() {
    let history = getWaterHistory();
    if (history.length < 2) return null;

    let recent = history[history.length - 1];
    let previous = history[history.length - 2];
    let diff = recent.temp - previous.temp;

    if (Math.abs(diff) < 0.5) {
        return { direction: "steady", label: "〰️ Water steady" };
    }
    return diff > 0
        ? { direction: "up", label: `🔺 Water warming (+${diff.toFixed(1)}°)` }
        : { direction: "down", label: `🔻 Water cooling (${diff.toFixed(1)}°)` };
}
