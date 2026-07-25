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

    weights: {
        wakeboard: { wind: 0.50, air: 0.25, water: 0.20, weather: 0.05 },
        surf:      { wind: 0.45, air: 0.25, water: 0.25, weather: 0.05 },
        ski:       { wind: 0.50, air: 0.25, water: 0.20, weather: 0.05 },
        tube:      { wind: 0.30, air: 0.35, water: 0.25, weather: 0.10 }
    },

    adaptive: {
        scoreAccuracyMultiplier: 1.0,
        funMultiplier: 1.0
    },

    preferences: {
        mainActivity: "wakeboard",
        favoriteLake: "Stella Lake",
        favoriteWindowStart: 8,
        favoriteWindowEnd: 18
    }

};
