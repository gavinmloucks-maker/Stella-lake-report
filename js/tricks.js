// 🌊 Stella AI (Stella Lake Report V2.2)
// Wakeboard Tricks Checklist — progress + uploaded clips/photos

const WAKEBOARD_TRICKS = [
    { id: "surface180", name: "Surface 180", category: "Beginner" },
    { id: "ollie", name: "Ollie", category: "Beginner" },
    { id: "toesideButterslide", name: "Toeside Butterslide", category: "Beginner" },
    { id: "heelsideButterslide", name: "Heelside Butterslide", category: "Beginner" },
    { id: "oneFooter", name: "One-Foot Air", category: "Beginner" },

    { id: "backroll", name: "Backroll", category: "Intermediate" },
    { id: "airRaley", name: "Air Raley", category: "Intermediate" },
    { id: "air180", name: "180 (Air)", category: "Intermediate" },
    { id: "tantrum", name: "Tantrum", category: "Intermediate" },
    { id: "scarecrow", name: "Scarecrow", category: "Intermediate" },

    { id: "raley", name: "Raley", category: "Advanced" },
    { id: "kgb", name: "KGB", category: "Advanced" },
    { id: "tantrumBlind", name: "Tantrum to Blind", category: "Advanced" },
    { id: "360", name: "360", category: "Advanced" },
    { id: "whirlybird", name: "Whirlybird", category: "Advanced" },

    { id: "doubleBackroll", name: "Double Backroll", category: "Invert / Pro" },
    { id: "mobydick", name: "Moby Dick", category: "Invert / Pro" },
    { id: "frontflip", name: "Front Flip", category: "Invert / Pro" },
    { id: "krypto", name: "Krypto", category: "Invert / Pro" }
];

const TRICKS_CATEGORY_ORDER = ["Beginner", "Intermediate", "Advanced", "Invert / Pro"];

// --- Checked/notes state (small, lives in localStorage like the journal) ---
function getTrickProgress() {
    return JSON.parse(localStorage.getItem("trickProgress")) || {};
}

function setTrickProgress(progress) {
    localStorage.setItem("trickProgress", JSON.stringify(progress));
}

function toggleTrick(id) {
    let progress = getTrickProgress();
    let entry = progress[id] || {};
    entry.checked = !entry.checked;
    entry.checkedDate = entry.checked ? new Date().toLocaleDateString() : null;
    progress[id] = entry;
    setTrickProgress(progress);
    renderTricksScreen();
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
}

// --- Rendering ---
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
            let entry = progress[trick.id] || {};
            let checked = !!entry.checked;

            html += `<div class="trickRow ${checked ? "trickDone" : ""}">`;
            html += `<div class="trickRowTop" onclick="toggleTrick('${trick.id}')">`;
            html += `<span class="trickCheckbox">${checked ? "✅" : "⬜"}</span>`;
            html += `<span class="trickName">${trick.name}</span>`;
            if (checked && entry.checkedDate) {
                html += `<span class="trickDate">${entry.checkedDate}</span>`;
            }
            html += `</div>`;

            if (checked) {
                html += `<div class="trickMedia" id="trickMedia-${trick.id}">Loading clips...</div>`;
                html += `<label class="trickUploadBtn">📸 Add photo/clip`;
                html += `<input type="file" accept="image/*,video/*" multiple style="display:none" onchange="handleTrickUpload('${trick.id}', this)">`;
                html += `</label>`;
            }

            html += `</div>`;
        }
    }

    container.innerHTML = html;

    // Fill in media thumbnails for checked tricks (async, after the list is in the DOM)
    for (let trick of WAKEBOARD_TRICKS) {
        let entry = progress[trick.id];
        if (!entry || !entry.checked) continue;

        let mediaEl = document.getElementById(`trickMedia-${trick.id}`);
        if (!mediaEl) continue;

        let items = await getTrickMediaForId(trick.id);
        if (items.length === 0) {
            mediaEl.innerHTML = "";
            continue;
        }

        let thumbHtml = "";
        for (let item of items) {
            let url = URL.createObjectURL(item.blob);
            if (item.type.startsWith("video")) {
                thumbHtml += `<video class="trickThumb" src="${url}" controls></video>`;
            } else {
                thumbHtml += `<img class="trickThumb" src="${url}">`;
            }
        }
        mediaEl.innerHTML = thumbHtml;
    }
}
