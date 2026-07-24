// 🌊 Stella Lake Report V2.2
// Smart Ride Planner

function buildHourlyConditions(forecast, water) {
    return forecast.map(hour => {
        return {
            time: hour.time,
            air: hour.air,
            water: water,
            wind: hour.wind,
            gust: hour.gust,
            clouds: hour.clouds,
            rain: hour.rain,
            humidity: hour.humidity,
            uv: hour.uv
        };
    });
}

function findBestTime(hours, activity) {
    let best = null;
    let highest = -1;

    hours.forEach(hour => {
        let score = calculateActivityScore(hour, activity);

        if (score > highest) {
            highest = score;
            best = { ...hour, score: score };
        }
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

function compareCurrentToBest(current, best) {
    let difference = best.score - current.score;

    if (difference <= 5) {
        return {
            message: "🚤 Go now! Conditions are already excellent.",
            improvement: 0
        };
    }

    return {
        message: `⏳ Waiting could improve your day by about ${difference} points.`,
        improvement: difference
    };
}

// Star rating for a given score — mirrors the "9 AM 94 ⭐ / 10 AM 98 ⭐⭐⭐" idea
function starRating(score) {
    if (score >= 97) return "⭐⭐⭐";
    if (score >= 93) return "⭐⭐";
    if (score >= 88) return "⭐";
    return "";
}

function createTimeline(hours, activity) {
    return hours.map(hour => {
        let score = calculateActivityScore(hour, activity);
        return {
            time: hour.time,
            score: score,
            stars: starRating(score)
        };
    });
}

function getRideWindow(hours, activity) {
    let timeline = createTimeline(hours, activity);
    let great = timeline.filter(x => x.score >= 90);

    if (great.length === 0) return null;

    return {
        start: great[0].time,
        end: great[great.length - 1].time
    };
}

// "Wait until X" recommendation — compares right now (first hour in
// the list) against the best hour of the day for that activity.
function getWaitRecommendation(hours, activity) {
    if (!hours || hours.length === 0) return null;

    let timeline = createTimeline(hours, activity);
    let now = timeline[0];
    let best = timeline.reduce((a, b) => (b.score > a.score ? b : a));

    if (best.time.getTime() === now.time.getTime() || best.score - now.score <= 5) {
        return {
            action: "now",
            message: "Conditions are already close to peak — go now."
        };
    }

    return {
        action: "wait",
        until: best.time,
        gain: best.score - now.score,
        message: `Wait until ${best.time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} to gain about ${best.score - now.score} points.`
    };
}
