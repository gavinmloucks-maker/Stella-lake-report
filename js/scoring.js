function clamp(value) { return Math.max(0, Math.min(100, value)); }

function airTemperatureScore(temp) {
    if (temp >= 82 && temp <= 88) return 100;
    if (temp >= 78) return 92;
    if (temp >= 72) return 82;
    if (temp >= 68) return 68;
    if (temp >= 65) return 50;
    if (temp >= 60) return 25;
    if (temp >= 55) return 10;
    return 0;
}

function waterTemperatureScore(temp) {
    if (temp >= 80) return 100;
    if (temp >= 77) return 90;
    if (temp >= 74) return 80;
    if (temp >= 70) return 60;
    if (temp >= 67) return 40;
    if (temp >= 65) return 20;
    return 5;
}

function wakeWindScore(wind) {
    if (wind <= 5) return 100;
    if (wind <= 8) return 90;
    if (wind <= 10) return 75;
    if (wind <= 12) return 55;
    if (wind <= 15) return 25;
    if (wind <= 18) return 8;
    return 2;
}

function surfWindScore(wind) {
    if (wind <= 3) return 100;
    if (wind <= 6) return 95;
    if (wind <= 10) return 75;
    if (wind <= 13) return 35;
    if (wind <= 15) return 15;
    return 3;
}

function tubeWindScore(wind) {
    if (wind >= 8 && wind <= 18) return 100;
    if (wind >= 5) return 85;
    if (wind <= 25) return 70;
    return 45;
}

function weatherScore(data) {
    let score = 100;
    score -= data.clouds * 0.2;
    score -= data.rain * 0.5;
    return clamp(score);
}

function timeOfDayScore(time) {
    let hour = new Date(time).getHours();

    if (hour >= 11 && hour <= 18) return 100;
    if (hour === 10 || hour === 19) return 75;
    if (hour === 9 || hour === 20) return 55;
    if (hour === 8 || hour === 21) return 35;
    return 15;
}

function getWeights(activity) { return SETTINGS.weights[activity]; }

function windScoreForActivity(wind, activity) {
    if (activity === "surf") return surfWindScore(wind);
    if (activity === "tube") return tubeWindScore(wind);
    return wakeWindScore(wind);
}

function calculateActivityScore(data, activity) {
    let air = airTemperatureScore(data.air);
    let water = waterTemperatureScore(data.water);
    let weather = weatherScore(data);
    let wind = windScoreForActivity(data.wind, activity);
    let timeOfDay = data.time ? timeOfDayScore(data.time) : 100;

    let w = getWeights(activity);
    if (!w) return null;

    let raw =
        wind * w.wind +
        air * w.air +
        water * w.water +
        weather * w.weather +
        timeOfDay * w.timeOfDay;

    return Math.round(clamp(raw));
}

function calculateAllActivities(data) {
    return {
        wakeboard: calculateActivityScore(data, "wakeboard"),
        surf: calculateActivityScore(data, "surf"),
        ski: calculateActivityScore(data, "ski"),
        tube: calculateActivityScore(data, "tube")
    };
}

function getScoreBreakdown(data, activity) {
    return {
        air: airTemperatureScore(data.air),
        water: waterTemperatureScore(data.water),
        wind: windScoreForActivity(data.wind, activity),
        weather: weatherScore(data),
        timeOfDay: data.time ? timeOfDayScore(data.time) : 100,
        weights: getWeights(activity)
    };
}
