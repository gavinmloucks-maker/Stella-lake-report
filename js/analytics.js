// 🌊 Stella AI (Stella Lake Report V2.2)
// Analytics System

function getJournalData() {
    return JSON.parse(localStorage.getItem("lakeJournal")) || [];
}

function mode(arr) {
    if (arr.length === 0) return null;

    let counts = {};
    arr.forEach(v => counts[v] = (counts[v] || 0) + 1);

    let best = arr[0];
    let bestCount = 0;

    Object.entries(counts).forEach(([value, count]) => {
        if (count > bestCount) {
            bestCount = count;
            best = value;
        }
    });

    return best;
}

function calculateLongestStreak(days) {
    if (days.length === 0) return 0;

    let uniqueDates = [...new Set(days.map(d => new Date(d.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => a - b);

    let longest = 1;
    let current = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
        let diffDays = Math.round((uniqueDates[i] - uniqueDates[i - 1]) / 86400000);

        if (diffDays === 1) {
            current += 1;
            longest = Math.max(longest, current);
        } else if (diffDays > 1) {
            current = 1;
        }
    }

    return longest;
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function calculateStats() {

    let days = getJournalData();

    if (days.length === 0) {
        return { total: 0, average: 0, best: null };
    }

    let totalScore = 0, totalWater = 0, totalAir = 0, totalWind = 0;
    let best = days[0];
    let warmestWaterDay = days[0];

    days.forEach(day => {
        totalScore += day.score;
        totalWater += day.water;
        totalAir += day.air;
        totalWind += day.wind;

        if (day.score > best.score) best = day;
        if (day.water > warmestWaterDay.water) warmestWaterDay = day;
    });

    let hours = days.filter(d => d.hour != null).map(d => d.hour);
    let months = days.map(d => new Date(d.date).getMonth()).filter(m => !isNaN(m));

    let favoriteHour = hours.length > 0 ? Number(mode(hours)) : null;
    let favoriteMonthIndex = months.length > 0 ? Number(mode(months)) : null;

    return {
        total: days.length,
        average: Math.round(totalScore / days.length),
        averageWater: Math.round(totalWater / days.length),
        averageAir: Math.round(totalAir / days.length),
        averageWind: Math.round(totalWind / days.length),
        best: best,
        warmestWaterDay: warmestWaterDay,
        favoriteHour: favoriteHour,
        favoriteMonth: favoriteMonthIndex != null ? MONTH_NAMES[favoriteMonthIndex] : null,
        longestStreak: calculateLongestStreak(days)
    };
}

function formatHour12(hour) {
    if (hour == null) return "--";
    let period = hour >= 12 ? "PM" : "AM";
    let h = hour % 12;
    if (h === 0) h = 12;
    return `${h} ${period}`;
}

function updateStatsDisplay() {

    let stats = calculateStats();

    if (stats.total === 0) {
        document.getElementById("stats").innerHTML = "No saved lake days yet.";
        return;
    }

    document.getElementById("stats").innerHTML = `
        📅 Lake Days: ${stats.total}<br><br>
        ⭐ Average Score: ${stats.average}/100<br><br>
        🌊 Average Water: ${stats.averageWater}°F<br><br>
        🌡️ Average Riding Temp: ${stats.averageAir}°F<br><br>
        💨 Average Wind: ${stats.averageWind} mph<br><br>
        🏆 Best Day: ${stats.best.date} (${stats.best.score}/100)<br><br>
        🔥 Warmest Water: ${stats.warmestWaterDay.water}°F on ${stats.warmestWaterDay.date}<br><br>
        ⏰ Favorite Hour: ${formatHour12(stats.favoriteHour)}<br><br>
        📆 Favorite Month: ${stats.favoriteMonth || "--"}<br><br>
        🔥 Longest Streak: ${stats.longestStreak} day${stats.longestStreak === 1 ? "" : "s"}
    `;
}

window.addEventListener("load", () => {
    if (document.getElementById("stats")) {
        updateStatsDisplay();
    }
});
