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
        wakeboard: { wind: 0.40, air: 0.20, water: 0.15, weather: 0.05, timeOfDay: 0.20 },
        surf:      { wind: 0.35, air: 0.20, water: 0.20, weather: 0.05, timeOfDay: 0.20 },
        ski:       { wind: 0.40, air: 0.20, water: 0.15, weather: 0.05, timeOfDay: 0.20 },
        tube:      { wind: 0.25, air: 0.30, water: 0.20, weather: 0.05, timeOfDay: 0.20 }
    },

    preferences: {
        mainActivity: "wakeboard",
        favoriteLake: "Stella Lake",
        favoriteWindowStart: 8,
        favoriteWindowEnd: 18,
        theme: "blue"
    }

};

const THEMES = ["blue", "sunset", "purple", "forest"];
const ACTIVITIES = ["wakeboard", "surf", "ski", "tube"];

const THEME_COLORS = {
    blue: "#0077b6",
    sunset: "#c1440e",
    purple: "#3a0ca3",
    forest: "#1b4332"
};

function loadUserSettings() {
    let saved = {};
    try {
        saved = JSON.parse(localStorage.getItem("stellaUserSettings")) || {};
    } catch (e) {
        saved = {};
    }

    if (saved.mainActivity && ACTIVITIES.includes(saved.mainActivity)) {
        SETTINGS.preferences.mainActivity = saved.mainActivity;
    }
    if (saved.theme && THEMES.includes(saved.theme)) {
        SETTINGS.preferences.theme = saved.theme;
    }

    applyTheme(SETTINGS.preferences.theme);
    applyActivityButtons(SETTINGS.preferences.mainActivity);
}

function saveUserSettings() {
    localStorage.setItem("stellaUserSettings", JSON.stringify({
        mainActivity: SETTINGS.preferences.mainActivity,
        theme: SETTINGS.preferences.theme
    }));
}

// Theme class lives on <html>, not <body> — this is what lets the
// background paint under the iOS notch/status bar and during
// overscroll instead of showing white there.
function applyTheme(theme) {
    document.documentElement.className = "theme-" + theme;

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && THEME_COLORS[theme]) {
        metaTheme.setAttribute("content", THEME_COLORS[theme]);
    }

    document.querySelectorAll(".themeSwatch").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === theme);
    });
}

function applyActivityButtons(activity) {
    document.querySelectorAll(".activityBtn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.activity === activity);
    });
}

function setTheme(theme) {
    SETTINGS.preferences.theme = theme;
    applyTheme(theme);
    saveUserSettings();
}

function setMainActivity(activity) {
    SETTINGS.preferences.mainActivity = activity;
    applyActivityButtons(activity);
    saveUserSettings();
    startLakeReport();
}

loadUserSettings();
