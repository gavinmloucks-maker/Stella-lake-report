let lakeData = null;
let selectedDayOffset = 0;

async function startLakeReport() {
    document.getElementById("status").innerHTML = "⏳ Loading Stella Lake...";

    try {
        let sensor = await getThingSpeakData();
        let forecast = await getTwoDayForecast();

        let selectedWeather = selectedDayOffset === 1 ? forecast.tomorrow : forecast.today;

        if (selectedWeather.hours.length === 0) {
            document.getElementById("status").innerHTML = "⚠️ No forecast data for that day.";
            return;
        }

        // "Right now" always comes from today's data, regardless of
        // which day is selected, so Current Conditions never changes
        // when you flip to Tomorrow.
        let now = new Date();
        let nowHour = forecast.today.hours.length > 0
            ? forecast.today.hours.reduce((a, b) => Math.abs(b.time - now) < Math.abs(a.time - now) ? b : a)
            : null;

        let current = {
            air: sensor.air,
            water: sensor.water,
            wind: nowHour ? nowHour.wind : null,
            gust: nowHour ? nowHour.gust : null,
            clouds: nowHour ? nowHour.clouds : null,
            uv: nowHour ? nowHour.uv : null
        };

        let hours = buildHourlyConditions(selectedWeather.hours, sensor.water);
        let best = findAllBestTimes(hours);
        let overall = getOverallBest(best);
        let activityBest = findBestTime(hours, SETTINGS.preferences.mainActivity);

        lakeData = {
            current: current,
            hours: hours,
            best: best,
            bestHour: overall.data,
            sun: selectedWeather.sun,
            dayOffset: selectedDayOffset
        };

        updateDashboard(lakeData);

        document.getElementById("status").innerHTML = "✅ Updated";
    } catch (error) {
        console.log(error);
        document.getElementById("status").innerHTML = "❌ " + error.message;
    }
}

function formatLakeTime(time) {
    return new Date(time).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function setDay(offset) {
    selectedDayOffset = offset;

    document.getElementById("todayBtn").classList.toggle("active", offset === 0);
    document.getElementById("tomorrowBtn").classList.toggle("active", offset === 1);

    startLakeReport();
}

function loadData() {
    startLakeReport();
}

window.addEventListener("load", () => {
    startLakeReport();
});
