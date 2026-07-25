let lakeData = null;
let selectedDayOffset = 0;
const OUTLOOK_DAYS = 5;

async function startLakeReport() {
    document.getElementById("status").innerHTML = "⏳ Loading Stella Lake...";

    try {
        let sensor = await getThingSpeakData();
        let days = await getMultiDayForecast(OUTLOOK_DAYS);

        if (!days || days.length === 0) {
            document.getElementById("status").innerHTML = "⚠️ Could not load forecast.";
            return;
        }

        recordWaterReading(sensor.water);

        let selectedDay = days[selectedDayOffset] || days[0];

        // "Right now" always comes from today's data, regardless of
        // which day is selected, so Current Conditions never changes.
        let now = new Date();
        let todayHours = days[0].hours;
        let nowHour = todayHours.length > 0
            ? todayHours.reduce((a, b) => Math.abs(b.time - now) < Math.abs(a.time - now) ? b : a)
            : null;

        let current = {
            air: sensor.air,
            water: sensor.water,
            wind: nowHour ? nowHour.wind : null,
            gust: nowHour ? nowHour.gust : null,
            clouds: nowHour ? nowHour.clouds : null,
            uv: nowHour ? nowHour.uv : null
        };

        let hours = buildHourlyConditions(selectedDay.hours, sensor.water);

        if (hours.length === 0) {
            document.getElementById("status").innerHTML = "⚠️ No forecast data for that day.";
            return;
        }

        let best = findAllBestTimes(hours);
        let overall = getOverallBest(best);
        let activityBest = findBestTime(hours, SETTINGS.preferences.mainActivity);

        lakeData = {
            current: current,
            hours: hours,
            best: best,
            bestHour: overall.data,
            activityBestHour: activityBest,
            sun: selectedDay.sun,
            dayOffset: selectedDayOffset
        };

        updateDashboard(lakeData);

        // Build the 5-day outlook strip using each day's own best hour
        // for the currently selected activity.
        let outlook = days.map(day => {
            let dayHours = buildHourlyConditions(day.hours, sensor.water);
            let dayBest = dayHours.length > 0
                ? findBestTime(dayHours, SETTINGS.preferences.mainActivity)
                : null;
            return {
                dayOffset: day.dayOffset,
                label: dayLabel(day.dayOffset),
                score: dayBest ? dayBest.score : null
            };
        });

        renderOutlook(outlook, selectedDayOffset);

        document.getElementById("status").innerHTML = "✅ Updated";
    } catch (error) {
        console.log(error);
        document.getElementById("status").innerHTML = "❌ " + error.message;
    }
}

function dayLabel(offset) {
    if (offset === 0) return "Today";
    if (offset === 1) return "Tomorrow";
    let d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString([], { weekday: "short" });
}

function formatLakeTime(time) {
    return new Date(time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function setDay(offset) {
    selectedDayOffset = offset;
    startLakeReport();
}

function loadData() {
    startLakeReport();
}

window.addEventListener("load", () => {
    startLakeReport();
});
