// 🌊 Stella Lake Report V2.2
// API Connections

async function getThingSpeakData() {
    try {
        const url = `https://api.thingspeak.com/channels/${SETTINGS.thingSpeak.channel}/feeds/last.json`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            air: Number(data[`field${SETTINGS.thingSpeak.airField}`]),
            water: Number(data[`field${SETTINGS.thingSpeak.waterField}`])
        };
    } catch (error) {
        console.log("ThingSpeak error:", error);
        return { air: null, water: null };
    }
}

async function getWeatherForecast() {
    try {
        const lat = SETTINGS.location.latitude;
        const lon = SETTINGS.location.longitude;
        const tz = encodeURIComponent(SETTINGS.location.timezone);

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}&longitude=${lon}` +
            `&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,cloud_cover,precipitation_probability,relative_humidity_2m,uv_index` +
            `&daily=sunrise,sunset` +
            `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
            `&timezone=${tz}&forecast_days=1`;

        const response = await fetch(url);
        const data = await response.json();

        let hours = [];

        for (let i = 0; i < data.hourly.time.length; i++) {
            let date = new Date(data.hourly.time[i]);
            let hour = date.getHours();

            if (hour >= 6 && hour <= 21) {
                hours.push({
                    time: date,
                    air: data.hourly.temperature_2m[i],
                    wind: data.hourly.wind_speed_10m[i],
                    gust: data.hourly.wind_gusts_10m[i],
                    clouds: data.hourly.cloud_cover[i],
                    rain: data.hourly.precipitation_probability[i],
                    humidity: data.hourly.relative_humidity_2m[i],
                    // uv_index can be null overnight; default to 0
                    uv: data.hourly.uv_index[i] ?? 0
                });
            }
        }

        const sun = {
            sunrise: data.daily?.sunrise?.[0] ? new Date(data.daily.sunrise[0]) : null,
            sunset: data.daily?.sunset?.[0] ? new Date(data.daily.sunset[0]) : null
        };

        return { hours, sun };
    } catch (error) {
        console.log("Weather error:", error);
        return { hours: [], sun: { sunrise: null, sunset: null } };
    }
}

async function getAllLakeData() {
    const sensor = await getThingSpeakData();
    const weather = await getWeatherForecast();

    return {
        current: {
            air: sensor.air,
            water: sensor.water
        },
        forecast: weather.hours,
        sun: weather.sun
    };
}
