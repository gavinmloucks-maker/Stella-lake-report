let lakeData = null;
let selectedDayOffset = 0;

async function startLakeReport() {
    document.getElementById("status").innerHTML = "⏳ Loading Stella Lake...";

    try {
        let data = await getAllLakeData(selectedDayOffset);

        if (data.forecast.length === 0) {
            document.getElementById("status").innerHTML = "⚠️ No forecast data for that day.";
            return;
        }

        let hours = buildHourlyConditions(data.forecast, data.current.water);
        let best = findAllBestTimes(hours);
        let overall = getOverallBest(best);
        let waitRec = getWaitRecommendation(hours, SETTINGS.preferences.mainActivity);

        lakeData = {
            current: data.current,
            hours: hours,
            best: best,
            bestHour: overall.data,
            sun: data.sun,
            waitRec: waitRec,
            dayOffset: selectedDayOffset
        };

        updateDashboard(lakeData);

        document.getElementById("bestTime").innerHTML = formatLakeTime(overall.data.time);
        document.getElementById("bestReason").innerHTML = `
            ${overall.name}<br>
            Score: ${overall.data.score}/100<br>
            Wind: ${Math.round(overall.data.wind)} mph<br>
            Air: ${Math.round(overall.data.air)}°F
        `;

        let waitEl = document.getElementById("waitMessage");
        if (waitEl) {
            waitEl.innerHTML = (selectedDayOffset === 0 && waitRec) ? waitRec.message : "";
        }

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
