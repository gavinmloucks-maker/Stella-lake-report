// 🌊 Stella AI (Stella Lake Report V2.2)
// Wakeboard Tricks Checklist — progress + uploaded clips/photos
// Also includes a separate Grabs checklist with a grab "key" (glossary).

function slugify(str) {
    return "t_" + str.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

const TRICK_CATEGORY_SOURCE = {
    "Start Here": [
        "Ollie", "Surface 180", "Surface 360", "Wake Jump", "Wake to Wake",
        "Toeside Wake to Wake", "Wake to Wake 180", "Toeside Wake to Wake 180",
        "Half Cab", "Switch 180", "Toeside 180", "Ollie 180", "Ollie 360",
        "Jump 180", "Jump 360"
    ],
    "Next Up": [
        "Indy", "Slob", "Melon", "Method", "Mute", "Tailgrab", "Nosegrab",
        "Stalefish", "Roast Beef", "Tindy", "Seatbelt", "S-Mobe",
        "Toeside Ollie", "Toeside Jump", "Wake to Wake Indy", "Wake to Wake Melon",
        "Wake to Wake Method", "Wake to Wake Roast Beef", "Wake to Wake Slob",
        "Wake to Wake Tindy", "Wake to Wake Mute"
    ],
    "Progressing Further": [
        "Switch Wake to Wake", "Switch Wake to Wake 180", "Switch Wake to Wake 360",
        "Blind Judge", "Mute Wake to Wake 180", "Indy Wake to Wake 180",
        "Melon Wake to Wake 180", "Method Wake to Wake 180", "Backside 180",
        "Frontside 180", "Backside 360", "Frontside 360", "Heelside 360",
        "Toeside 360", "Raley", "TS Raley", "Backroll", "Tantrum", "Krypt",
        "Mobius", "Crow Mobe", "S-Bend", "Pete Rose", "Wrapped Backside 180",
        "Wrapped Frontside 180"
    ],
    "Bigger Tricks": [
        "Crow Mobe 540", "Mobe", "Mobe 540", "Tantrum to Blind",
        "Backroll to Blind", "Krypt to Blind", "Raley to Blind", "Roll to Blind",
        "Scarecrow", "Backside 540", "Frontside 540", "Switch Backside 180",
        "Switch Frontside 180", "Switch Backside 360", "Switch Frontside 360",
        "Toeside Backroll", "Toeside Frontroll", "KGB", "Whirlybird",
        "Switch Mobe", "Switch Mobe 540", "Heelside Backside 720",
        "Toeside Backside 720"
    ]
};

const TRICKS_CATEGORY_ORDER = ["Start Here", "Next Up", "Progressing Further", "Bigger Tricks"];

const WAKEBOARD_TRICKS = [];
for (let category of TRICKS_CATEGORY_ORDER) {
    for (let name of TRICK_CATEGORY_SOURCE[category]) {
        WAKEBOARD_TRICKS.push({ id: slugify(name), name: name, category: category });
    }
}

// --- Grabs (a separate checklist) with a "key" describing each grab ---
const GRAB_KEY = [
    { name: "Indy", key: "Trailing (back) hand grabs the heelside edge between the bindings." },
    { name: "Mute", key: "Leading (front) hand grabs the toeside edge between the bindings." },
    { name: "Melon", key: "Leading (front) hand grabs the heelside edge between the bindings." },
    { name: "Method", key: "Trailing (back) hand grabs the toeside edge, board tweaked out toeside." },
    { name: "Slob", key: "Leading (front) hand grabs the heelside edge, board tweaked heelside." },
    { name: "Tindy", key: "Toeside version of an Indy — back hand grabs the toeside edge between the bindings." },
    { name: "Roast Beef", key: "Back hand reaches between the legs to grab the heelside edge behind the back foot." },
    { name: "Tailgrab", key: "Either hand grabs the tail (back tip) of the board." },
    { name: "Nosegrab", key: "Either hand grabs the nose (front tip) of the board." },
    { name: "Stalefish", key: "Trailing (back) hand grabs the heelside edge behind the back foot." },
    { name: "Seatbelt", key: "Front hand reaches across the body to grab the toeside edge behind the back foot." },
    { name: "Crail", key: "Front hand grabs the toeside edge in front of the front foot." },
    { name: "Japan", key: "Front hand grabs the toeside edge between the feet while tweaking the board and bending the front knee." },
    { name: "Wrapped Indy", key: "An Indy grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Mute", key: "A Mute grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Melon", key: "A Melon grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Method", key: "A Method grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Slob", key: "A Slob grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Tindy", key: "A Tindy grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Roast Beef", key: "A Roast Beef grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Tailgrab", key: "A Tailgrab pulled tighter and held longer for extra style." },
    { name: "Wrapped Nosegrab", key: "A Nosegrab pulled tighter and held longer for extra style." },
    { name: "Wrapped Stalefish", key: "A Stalefish grab pulled tighter and held longer for extra style." },
    { name: "Wrapped Seatbelt", key: "A Seatbelt grab pulled tighter and held longer for extra style." }
];

const WAKEBOARD_GRABS = GRAB_KEY.map(g => ({
    id: "g_" + g.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""),
    name: g.name,
    key: g.key
}));

// --- Checked/notes state (small, lives in localStorage like the journal) ---
// Shared store for both tricks and grabs — ids are prefixed (t_ / g_) so they never collide.
function getTrickProgress() {
    return JSON.parse(localStorage.getItem("trickProgress")) || {};
}

function setTrickProgress(progress) {
    localStorage.setItem("trickProgress", JSON.stringify(progress));
}

function todayISO() {
    let d = new Date();
    let month = String(d.getMonth() + 1).padStart(2, "0");
    let day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
}

function toggleTrick(id) {
    let progress = getTrickProgress();
    let entry = progress[id] || {};
    entry.checked = !entry.checked;
    entry.checkedDate = entry.checked ? (entry.checkedDate || todayISO()) : null;
    progress[id] = entry;
    setTrickProgress(progress);
    renderTricksScreen();
    renderGrabsScreen();
}

// Lets the user change the date a trick/grab was landed via a date picker.
function setTrickDate(id, dateValue) {
    if (!dateValue) return;
    let progress = getTrickProgress();
    let entry = progress[id] || {};
    entry.checked = true;
    entry.checkedDate = dateValue;
    progress[id] = entry;
    setTrickProgress(progress);
}

function toggleGrabKey() {
    let el = document.getElementById("grabKeyBox");
    if (!el) return;
    el.style.display = (el.style.display === "none" || !el.style.display) ? "block" : "none";
}

// --- Media storage (photos/clips) — IndexedDB, since clips can be a few MB
// and localStorage's ~5MB string limit isn't a good fit for that. ---
const TRICK_DB_NAME = "stellaTrickMedia";
const TRICK_STORE_NAME = "media";

function openTrickDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open(TRICK_DB_NAME, 1);
        request.onupgradeneeded = () => {
            let db = request.result;
            if (!db.objectStoreNames.contains(TRICK_STORE_NAME)) {
                db.createObjectStore(TRICK_STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveTrickMedia(trickId, file) {
    let db = await openTrickDB();
    return new Promise((resolve, reject) => {
        let tx = db.transaction(TRICK_STORE_NAME, "readwrite");
        let store = tx.objectStore(TRICK_STORE_NAME);
        let record = {
            trickId: trickId,
            type: file.type,
            name: file.name,
            blob: file,
            addedAt: new Date().toISOString()
        };
        let req = store.add(record);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function getTrickMediaForId(trickId) {
    let db = await openTrickDB();
    return new Promise((resolve, reject) => {
        let tx = db.transaction(TRICK_STORE_NAME, "readonly");
        let store = tx.objectStore(TRICK_STORE_NAME);
        let req = store.getAll();
        req.onsuccess = () => resolve(req.result.filter(r => r.trickId === trickId));
        req.onerror = () => reject(req.error);
    });
}

async function deleteTrickMedia(mediaId) {
    let db = await openTrickDB();
    return new Promise((resolve, reject) => {
        let tx = db.transaction(TRICK_STORE_NAME, "readwrite");
        tx.objectStore(TRICK_STORE_NAME).delete(mediaId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

async function handleTrickUpload(id, inputEl) {
    let files = inputEl.files;
    if (!files || files.length === 0) return;

    for (let file of files) {
        await saveTrickMedia(id, file);
    }
    inputEl.value = "";
    renderTricksScreen();
    renderGrabsScreen();
}

// --- Shared row renderer (used by both the Tricks list and the Grabs list) ---
function renderTrickRowHtml(item, entry) {
    let checked = !!(entry && entry.checked);
    let dateVal = (entry && entry.checkedDate) ? entry.checkedDate : todayISO();

    let html = `<div class="trickRow ${checked ? "trickDone" : ""}">`;
    html += `<div class="trickRowTop" onclick="toggleTrick('${item.id}')">`;
    html += `<span class="trickCheckbox">${checked ? "✅" : "⬜"}</span>`;
    html += `<span class="trickName">${item.name}</span>`;
    html += `</div>`;

    if (checked) {
        html += `<div class="trickDateRow">`;
        html += `<label>Landed on</label>`;
        html += `<input type="date" class="trickDateInput" value="${dateVal}" onclick="event.stopPropagation()" onchange="setTrickDate('${item.id}', this.value)">`;
        html += `</div>`;
        html += `<div class="trickMedia" id="trickMedia-${item.id}">Loading clips...</div>`;
        html += `<label class="trickUploadBtn">📸 Add photo/clip`;
        html += `<input type="file" accept="image/*,video/*" multiple style="display:none" onchange="handleTrickUpload('${item.id}', this)">`;
        html += `</label>`;
    }

    html += `</div>`;
    return html;
}

async function fillTrickMediaThumbs(items, progress) {
    for (let item of items) {
        let entry = progress[item.id];
        if (!entry || !entry.checked) continue;

        let mediaEl = document.getElementById(`trickMedia-${item.id}`);
        if (!mediaEl) continue;

        let media = await getTrickMediaForId(item.id);
        if (media.length === 0) {
            mediaEl.innerHTML = "";
            continue;
        }

        let thumbHtml = "";
        for (let m of media) {
            let url = URL.createObjectURL(m.blob);
            if (m.type.startsWith("video")) {
                thumbHtml += `<video class="trickThumb" src="${url}" controls></video>`;
            } else {
                thumbHtml += `<img class="trickThumb" src="${url}">`;
            }
        }
        mediaEl.innerHTML = thumbHtml;
    }
}

// --- Rendering: Tricks screen ---
async function renderTricksScreen() {
    let container = document.getElementById("tricksList");
    if (!container) return;

    let progress = getTrickProgress();
    let total = WAKEBOARD_TRICKS.length;
    let done = WAKEBOARD_TRICKS.filter(t => progress[t.id] && progress[t.id].checked).length;

    let summaryEl = document.getElementById("tricksSummary");
    if (summaryEl) {
        summaryEl.innerHTML = `${done} / ${total} tricks landed`;
    }
    let barEl = document.getElementById("tricksProgressBar");
    if (barEl) {
        barEl.style.width = total ? Math.round((done / total) * 100) + "%" : "0%";
    }

    let html = "";
    for (let category of TRICKS_CATEGORY_ORDER) {
        let tricksInCategory = WAKEBOARD_TRICKS.filter(t => t.category === category);
        if (tricksInCategory.length === 0) continue;

        html += `<h3 class="trickCategoryTitle">${category}</h3>`;
        for (let trick of tricksInCategory) {
            html += renderTrickRowHtml(trick, progress[trick.id]);
        }
    }

    container.innerHTML = html;
    await fillTrickMediaThumbs(WAKEBOARD_TRICKS, progress);
}

// --- Rendering: Grabs screen ---
async function renderGrabsScreen() {
    let container = document.getElementById("grabsList");
    if (!container) return;

    let progress = getTrickProgress();
    let done = WAKEBOARD_GRABS.filter(g => progress[g.id] && progress[g.id].checked).length;

    let summaryEl = document.getElementById("grabsSummary");
    if (summaryEl) {
        summaryEl.innerHTML = `${done} grabs landed`;
    }

    let keyBox = document.getElementById("grabKeyBox");
    if (keyBox && !keyBox.dataset.filled) {
        let keyHtml = "";
        for (let g of GRAB_KEY) {
            keyHtml += `<div class="grabKeyRow"><span class="grabKeyName">${g.name}</span><span class="grabKeyDesc">${g.key}</span></div>`;
        }
        keyBox.innerHTML = keyHtml;
        keyBox.dataset.filled = "1";
    }

    let html = "";
    for (let grab of WAKEBOARD_GRABS) {
        html += renderTrickRowHtml(grab, progress[grab.id]);
    }

    container.innerHTML = html;
    await fillTrickMediaThumbs(WAKEBOARD_GRABS, progress);
}

// --- Subview toggle (Tricks vs Grabs) ---
function showTrickSubview(which) {
    let tricksBox = document.getElementById("tricksSubview");
    let grabsBox = document.getElementById("grabsSubview");
    if (tricksBox) tricksBox.style.display = which === "tricks" ? "block" : "none";
    if (grabsBox) grabsBox.style.display = which === "grabs" ? "block" : "none";

    document.querySelectorAll(".trickSubviewBtn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.subview === which);
    });

    if (which === "tricks") renderTricksScreen();
    if (which === "grabs") renderGrabsScreen();
}
