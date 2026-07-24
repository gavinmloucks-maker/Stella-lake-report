// 🌊 Stella Lake Report V2.2
// Settings File

const SETTINGS = {

    // Personalization
    user: {
        name: "Gavin",
        appName: "Stella AI"
    },

    // ThingSpeak sensor
    thingSpeak: {
        channel: "3432049",
        airField: 2,
        waterField: 3
    },

    // Stella Lake location
    location: {
        name: "Stella Lake",
        latitude: 45.7955,
        longitude: -89.1615,
        timezone: "America/Chicago"
    },

    // Ideal conditions (used by scoring.js)
    ideal: {
        airTemperature: 85,
        waterTemperature: 80,
        perfectWindMin: 0,
        perfectWindMax: 5
    },

    // Per-activity weights — how much each factor matters.
    // These mirror what scoring.js currently hardcodes, but living
    // here means the Adaptive AI feature (later phase) and the
    // What-If Simulator can read/adjust them in one place.
    weights: {
        wakeboard: { wind: 0.50, air: 0.25, water: 0.20, weather: 0.05 },
        surf:      { wind: 0.45, air: 0.25, water: 0.25, weather: 0.05 },
        ski:       { wind: 0.50, air: 0.25, water: 0.20, weather: 0.05 },
        tube:      { wind: 0.30, air: 0.35, water: 0.25, weather: 0.10 }
    },

    // Adaptive AI multipliers (start neutral at 1.0).
    // journal.js / analytics.js will nudge these over time based on
    // how accurate/fun the user rated each session.
    adaptive: {
        scoreAccuracyMultiplier: 1.0,
        funMultiplier: 1.0
    },

    // Favorites / preferences
    preferences: {
        mainActivity: "wakeboard",
        favoriteLake: "Stella Lake",
        favoriteWindowStart: 8,
        favoriteWindowEnd: 18
    }

};
