function buildHourlyConditions(forecast, water) {
    return forecast.map(hour => ({
        time: hour.time,
        air: hour.air,
        water: water,
        wind: hour.wind,
        gust: hour.gust,
        clouds: hour.clouds,
        rain: hour.rain,
        humidity: hour.humidity,
        uv: hour.uv,
        weatherCode: hour.weatherCode
    }));
}

function findBestTime(hours, activity) {
    let best = null, highest = -1;
    hours.forEach(hour => {
        let score = calculateActivityScore(hour, activity);
        if (score > highest) { highest = score; best = { ...hour, score }; }
    });
    return best;
}

function findAllBestTimes(hours) {
    return {
        wakeboard: findBestTime(hours, "wakeboard"),
        surf: findBestTime(hours, "surf"),
        ski: findBestTime(hours, "ski"),
        tube: findBestTime(hours, "tube")
    };
}

function getOverallBest(best) {
    let list = [
        { name: "🏄 Wakeboard", data: best.wakeboard },
        { name: "🌊 Wakesurf", data: best.surf },
        { name: "🎿 Ski", data: best.ski },
        { name: "🛟 Tube", data: best.tube }
    ];
    list.sort((a, b) => b.data.score - a.data.score);
    return list[0];
}

function starRating(score) {
    if (score >= 97) return "⭐⭐⭐";
    if (score >= 93) return "⭐⭐";
    if (score >= 88) return "⭐";
    return "";
}

function createTimeline(hours, activity) {
    return hours.map(hour => {
        let score = calculateActivityScore(hour, activity);
        return { time: hour.time, score, stars: starRating(score) };
    });
}

function getRideWindow(hours, activity) {
    let timeline = createTimeline(hours, activity);
    let great = timeline.filter(x => x.score >= 90);
    if (great.length === 0) return null;
    return { start: great[0].time, end: great[great.length - 1].time };
}
