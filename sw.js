const CACHE_NAME = "stella-ai-v2";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./js/settings.js",
    "./js/api.js",
    "./js/scoring.js",
    "./js/planner.js",
    "./js/ui.js",
    "./js/tricks.js",
    "./js/app.js",
    "./data/fortunes.js",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    // Never cache the live weather/lake data — only the app shell
    if (event.request.url.includes("open-meteo.com") || event.request.url.includes("thingspeak.com")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
