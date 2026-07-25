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

// Fetches both today's and tomorrow's hourly forecast in a single
// request, split apart by day. Used so "Current Conditions" (today)
// and the selected day's Highs/Timeline can be sourced independently.
async function getTwoDayForecast() {
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
            `&timezone=${tz}&forecast_days=2`;

        const response = await fetch(url);
        const data = await response.json();

        function extractDay(dayOffset) {
            let sunriseRaw = data.daily?.sunrise?.[dayOffset];
            let sunsetRaw = data.daily?.sunset?.[dayOffset];

            const sun = {
                sunrise: sunriseRaw ? new Date(sunriseRaw) : null,
                sunset: sunsetRaw ? new Date(sunsetRaw) : null
            };

            let targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + dayOffset);
            let targetDateString = targetDate.toDateString();

            let hours = [];

            for (let i = 0; i < data.hourly.time.length; i++) {
                let date = new Date(data.hourly.time[i]);

                if (date.toDateString() !== targetDateString) continue;
                if (sun.sunrise && date < sun.sunrise) continue;
                if (sun.sunset && date > sun.sunset) continue;

                hours.push({
                    time: date,
                    air: data.hourly.temperature_2m[i],
                    wind: data.hourly.wind_speed_10m[i],
                    gust: data.hourly.wind_gusts_10m[i],
                    clouds: data.hourly.cloud_cover[i],
                    rain: data.hourly.precipitation_probability[i],
                    humidity: data.hourly.relative_humidity_2m[i],
                    uv: data.hourly.uv_index[i] ?? 0
                });
            }

            return { hours, sun };
        }

        return { today: extractDay(0), tomorrow: extractDay(1) };
    } catch (error) {
        console.log("Weather error:", error);
        let empty = { hours: [], sun: { sunrise: null, sunset: null } };
        return { today: empty, tomorrow: empty };
    }
}
