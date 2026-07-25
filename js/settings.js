const SETTINGS = {

    user: {
        name: "Gavin",
        appName: "Stella AI"
    },

    thingSpeak: {
        channel: "3432049",
        airField: 2,
        waterField: 3
    },

    location: {
        name: "Stella Lake",
        latitude: 45.7955,
        longitude: -89.1615,
        timezone: "America/Chicago"
    },

    ideal: {
        airTemperature: 85,
        waterTemperature: 80,
        perfectWindMin: 0,
        perfectWindMax: 5
    },

    // Each activity's weights include timeOfDay, which biases scoring
    // toward the 11 AM - 6 PM window regardless of wind/temp swings.
    // Every activity's weights sum to 1.0.
    weights: {
        wakeboard: { wind: 0.40, air: 0.20, water: 0.15, weather: 0.05, timeOfDay: 0.20 },
        surf:      { wind: 0.35, air: 0.20, water: 0.20, weather: 0.05, timeOfDay: 0.20 },
        ski:       { wind: 0.40, air: 0.20, water: 0.15, weather: 0.05, timeOfDay: 0.20 },
        tube:      { wind: 0.25, air: 0.30, water: 0.20, weather: 0.05, timeOfDay: 0.20 }
    },

    preferences: {
        mainActivity: "wakeboard",
        favoriteLake: "Stella Lake",
        favoriteWindowStart: 8,
        favoriteWindowEnd: 18
    }

};
