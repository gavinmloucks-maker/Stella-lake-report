function isNotificationSupported() {
    return "Notification" in window;
}

function notificationsEnabled() {
    return localStorage.getItem("stellaNotificationsEnabled") === "true";
}

async function enableNotifications() {
    if (!isNotificationSupported()) {
        alert("Notifications aren't supported in this browser.");
        return;
    }

    let permission = await Notification.requestPermission();
    if (permission === "granted") {
        localStorage.setItem("stellaNotificationsEnabled", "true");
        updateNotificationButton();
        sendNotification("🌊 Stella AI", "Notifications enabled — you'll get an alert when a great window shows up while the app is open.");
        startNotificationPolling();
    } else {
        localStorage.setItem("stellaNotificationsEnabled", "false");
        updateNotificationButton();
    }
}

function disableNotifications() {
    localStorage.setItem("stellaNotificationsEnabled", "false");
    updateNotificationButton();
    stopNotificationPolling();
}

function toggleNotifications() {
    if (notificationsEnabled()) {
        disableNotifications();
    } else {
        enableNotifications();
    }
}

function updateNotificationButton() {
    let btn = document.getElementById("notifyBtn");
    if (!btn) return;
    btn.classList.toggle("active", notificationsEnabled());
    btn.innerHTML = notificationsEnabled() ? "🔔 Notifications On" : "🔕 Enable Notifications";
}

function sendNotification(title, body) {
    if (!isNotificationSupported() || Notification.permission !== "granted") return;
    try {
        new Notification(title, { body: body, icon: "assets/icons/icon-192.png" });
    } catch (e) {
        console.log("Notification error:", e);
    }
}

let notifyPollHandle = null;
let lastNotifiedScore = null;

// Re-checks conditions every 15 minutes while this tab stays open and
// the screen is on. Mobile OSes pause this when the app is backgrounded.
function startNotificationPolling() {
    if (notifyPollHandle) return;
    notifyPollHandle = setInterval(async () => {
        await startLakeReport();
        maybeNotifyGreatConditions();
    }, 15 * 60 * 1000);
}

function stopNotificationPolling() {
    if (notifyPollHandle) {
        clearInterval(notifyPollHandle);
        notifyPollHandle = null;
    }
}

function maybeNotifyGreatConditions() {
    if (!notificationsEnabled() || !lakeData) return;

    let activity = SETTINGS.preferences.mainActivity;
    let score = lakeData.activityBestHour ? lakeData.activityBestHour.score : null;
    if (score == null) return;

    if (score >= 90 && lastNotifiedScore !== score) {
        sendNotification("🌊 Great conditions!", `${activity} score is ${score}/100 right now.`);
        lastNotifiedScore = score;
    }
}

window.addEventListener("load", () => {
    updateNotificationButton();
    if (notificationsEnabled()) startNotificationPolling();
});
