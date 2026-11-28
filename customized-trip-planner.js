const TOURS = JSON.parse(document.getElementById("tourCatalog").textContent);

/* ==========================================
   CUSTOMIZED TRIP PLANNER
   Tour data is declared in HTML.
========================================== */

const $ = id => document.getElementById(id);

const BASE_PRICE_PER_PAX = 8999;

const DEFAULT_DAYS = [
    {
        id: "day-1",
        title: "Arrival & Island Hopping",
        tours: ["pp-underground"]
    },
    {
        id: "day-2",
        title: "Island Adventure",
        tours: ["en-tour-a"]
    },
    {
        id: "day-3",
        title: "Relax & Explore",
        tours: ["pp-city"]
    }
];

let paxCount = 2;
let currentLocationFilter = "ALL";
let days = JSON.parse(JSON.stringify(DEFAULT_DAYS));

let dragState = {
    sourceType: null,
    tourId: null,
    sourceDayId: null,
    sourceIndex: null
};


/* ==========================================
   HELPER FUNCTIONS
========================================== */

function getTourById(id) {
    return TOURS.find(tour => tour.id === id);
}

function formatPHP(amount) {
    return "₱" + Number(amount).toLocaleString("en-PH");
}

function getScheduledDayIndex(tourId) {
    return days.findIndex(day => day.tours.includes(tourId));
}

function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


/* ==========================================
   LOAD AND SAVE ITINERARY
========================================== */

function loadSavedItinerary() {

    try {

        const saved = JSON.parse(
            localStorage.getItem("ppw_custom_trip_draft")
        );

        if (
            Array.isArray(saved) &&
            saved.length >= 1 &&
            saved.length <= 30 &&
            saved.every(day => Array.isArray(day.tours))
        ) {

            const usedTours = new Set();

            days = saved.map((day, index) => {

                const tourId = day.tours.find(id =>
                    getTourById(id) && !usedTours.has(id)
                );

                if (tourId) {
                    usedTours.add(tourId);
                }

                return {
                    id: `day-${index + 1}`,
                    title: day.title || `Day ${index + 1} Activities`,
                    tours: tourId ? [tourId] : []
                };

            });

        }

    } catch (error) {

        console.warn("Unable to load saved itinerary.", error);

    }

}

function saveItineraryDraft() {

    try {

        localStorage.setItem(
            "ppw_custom_trip_draft",
            JSON.stringify(days)
        );

    } catch (error) {

        console.warn("Unable to save itinerary.", error);

    }

}


/* ==========================================
   LOCATION FILTER
========================================== */

function setLocationFilter(location) {

    currentLocationFilter = location;

    document.querySelectorAll(".filter-pill").forEach(button => {

        const active = button.dataset.filter === location;

        button.className = active

            ? "filter-pill flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold bg-sky-600 text-white shadow-sm transition"

            : "filter-pill flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-yellow-100 transition";

        button.setAttribute("aria-pressed", String(active));

    });

    renderAvailableTours();

}

function resetTourSearch() {

    if ($("tourSearchInput")) {
        $("tourSearchInput").value = "";
    }

    setLocationFilter("ALL");

}


/* ==========================================
   RENDER AVAILABLE TOURS
========================================== */

function renderAvailableTours() {

    const container = $("availableToursList");

    if (!container) {
        console.error("Missing availableToursList in HTML.");
        return;
    }

    const query = ($("tourSearchInput")?.value || "")
        .trim()
        .toLowerCase();

    const filtered = TOURS.filter(tour => {

        const matchesLocation =
            currentLocationFilter === "ALL" ||
            tour.location === currentLocationFilter;

        const matchesSearch =
            !query ||
            tour.title.toLowerCase().includes(query) ||
            tour.location.toLowerCase().includes(query) ||
            (tour.spots || []).some(spot =>
                spot.toLowerCase().includes(query)
            );

        return matchesLocation && matchesSearch;

    });

    setText(
        "availableCountBadge",
        `${filtered.length} Tour${filtered.length === 1 ? "" : "s"}`
    );

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="text-center py-8 px-4">

                <i class="fa-solid fa-compass text-2xl text-slate-300 mb-2"></i>

                <p class="text-xs font-semibold text-slate-500">
                    No matching tours found.
                </p>

                <button type="button"
                    onclick="resetTourSearch()"
                    class="mt-2 text-xs font-bold text-sky-600">

                    Reset Filters

                </button>

            </div>
        `;

        return;

    }

    container.innerHTML = filtered.map(tour => {

        const scheduledIndex = getScheduledDayIndex(tour.id);

        const isAdded = scheduledIndex !== -1;

        const priceBadge = tour.includedInBase

            ? `<span class="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md">
                    Included
               </span>`

            : `<span class="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md">
                    +${formatPHP(tour.addonPrice)}/pax
               </span>`;

        const actionButton = isAdded

            ? `<span class="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md">

                    <i class="fa-solid fa-check text-emerald-600"></i>

                    Day ${scheduledIndex + 1}

               </span>`

            : `<button type="button"
                    onclick="quickAddTour('${tour.id}')"
                    class="text-[10px] font-bold px-2 py-1 rounded-md bg-sky-600 hover:bg-yellow-400 hover:text-slate-900 text-white transition">

                    + Add

               </button>`;

        return `

            <div
                draggable="${!isAdded}"

                ${!isAdded
                    ? `ondragstart="handleCatalogDragStart(event, '${tour.id}')"
                       ondragend="handleDragEnd(event)"`
                    : ""}

                class="draggable-tour group border rounded-xl p-2.5 mb-3 select-none transition
                    ${isAdded
                        ? "bg-slate-50 border-slate-200 opacity-75"
                        : "bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50 cursor-grab"}">

                <div class="flex items-center gap-2.5">

                    <div class="text-slate-400">

                        <i class="fa-solid ${isAdded
                            ? "fa-lock"
                            : "fa-grip-vertical"}"></i>

                    </div>

                    <div class="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">

                        <img
                            src="${escapeHTML(tour.image)}"
                            alt="${escapeHTML(tour.title)}"
                            onerror="this.onerror=null;this.src='${escapeHTML(tour.fallbackImg || "palawan.jpg")}'"
                            class="w-full h-full object-cover group-hover:scale-105 transition">

                    </div>

                    <div class="flex-1 min-w-0">

                        <div class="flex flex-wrap items-center gap-1 mb-1">

                            <span class="text-[10px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded">

                                ${escapeHTML(tour.location)}

                            </span>

                            <span class="text-[10px] text-slate-400">

                                ${escapeHTML(tour.durationType)}

                            </span>

                        </div>

                        <h3 class="text-xs font-extrabold text-[#0F2942] leading-snug">

                            ${escapeHTML(tour.title)}

                        </h3>

                        <div class="mt-2 flex flex-wrap items-center justify-between gap-1">

                            ${priceBadge}

                            <div class="flex items-center gap-1">

                                ${actionButton}

                                <button type="button"
                                    onclick="openTourModal('${tour.id}')"
                                    title="View tour details"
                                    class="w-6 h-6 rounded-full bg-slate-100 hover:bg-yellow-400 text-slate-600 transition">

                                    <i class="fa-solid fa-chevron-right text-[10px]"></i>

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }).join("");

}


/* ==========================================
   GENERATE ITINERARY DAYS
========================================== */

function generateItineraryDays() {

    const input = $("tripDayCount");

    if (!input) return;

    const count = Number(input.value);

    if (!Number.isInteger(count) || count < 1 || count > 30) {

        showToast(
            "Please enter a number from 1 to 30 days.",
            "warning"
        );

        input.value = days.length;

        return;

    }

    if (
        count < days.length &&
        days.slice(count).some(day => day.tours.length > 0)
    ) {

        const confirmed = window.confirm(
            "Reducing the number of days will remove tours from later days. Continue?"
        );

        if (!confirmed) {

            input.value = days.length;

            return;

        }

    }

    days = Array.from({ length: count }, (_, index) =>

        days[index] || {

            id: `day-${index + 1}`,

            title: `Day ${index + 1} Activities`,

            tours: []

        }

    );

    renderItinerary();

    showToast(
        `Successfully generated ${count} itinerary day(s).`,
        "success"
    );

}


/* ==========================================
   RENDER ITINERARY
========================================== */

function renderItinerary() {

    const container = $("itineraryDaysContainer");

    if (!container) {

        console.error("Missing itineraryDaysContainer in HTML.");

        return;

    }

    setText("itineraryDayCount", days.length);

    if ($("tripDayCount")) {
        $("tripDayCount").value = days.length;
    }

    container.innerHTML = days.map((day, index) => {

        const dayTours = day.tours
            .map(getTourById)
            .filter(Boolean);

        const cards = dayTours.length > 0

            ? dayTours.map((tour, tourIndex) => `

                <div
                    draggable="true"
                    ondragstart="handleItineraryDragStart(event, '${day.id}', ${tourIndex}, '${tour.id}')"
                    ondragend="handleDragEnd(event)"

                    class="itinerary-card group bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row cursor-grab">

                    <div class="relative h-32 sm:h-auto sm:w-40 shrink-0 overflow-hidden bg-slate-100">

                        <img
                            src="${escapeHTML(tour.image)}"
                            alt="${escapeHTML(tour.title)}"
                            onerror="this.onerror=null;this.src='${escapeHTML(tour.fallbackImg || "palawan.jpg")}'"
                            class="w-full h-full object-cover group-hover:scale-105 transition">

                        <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full text-white
                            ${tour.includedInBase
                                ? "bg-emerald-500"
                                : "bg-amber-500"}">

                            ${tour.includedInBase
                                ? "Included"
                                : "+" + formatPHP(tour.addonPrice)}

                        </span>

                    </div>

                    <div class="p-3.5 flex-1 min-w-0">

                        <div class="flex items-start justify-between gap-2">

                            <div>

                                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">

                                    <i class="fa-solid fa-circle-check"></i>

                                    Selected for Day ${index + 1}

                                </span>

                                <h4 class="text-sm font-extrabold text-[#0F2942] mt-2">

                                    ${escapeHTML(tour.title)}

                                </h4>

                                <p class="text-[11px] text-slate-500 mt-1">

                                    ${escapeHTML(tour.description)}

                                </p>

                            </div>

                            <button
                                type="button"
                                onclick="removeTourFromDay('${day.id}', ${tourIndex})"
                                title="Remove tour"
                                class="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-500 shrink-0 transition">

                                <i class="fa-solid fa-xmark"></i>

                            </button>

                        </div>

                        <div class="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">

                            <span class="text-[11px] font-semibold text-slate-500">

                                <i class="fa-regular fa-clock text-sky-600 mr-1"></i>

                                ${escapeHTML(tour.schedule)}

                            </span>

                            <button
                                type="button"
                                onclick="openTourModal('${tour.id}')"
                                class="text-xs font-bold text-sky-600 hover:bg-yellow-100 px-2 py-1 rounded-lg transition">

                                View Spots & Details →

                            </button>

                        </div>

                    </div>

                </div>

            `).join("")

            : `

                <div class="py-7 px-4 text-center flex flex-col items-center justify-center">

                    <div class="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center mb-2">

                        <i class="fa-solid fa-cloud-arrow-down"></i>

                    </div>

                    <p class="text-xs font-bold text-slate-600">

                        Drop 1 tour here for Day ${index + 1}

                    </p>

                    <p class="text-[11px] text-slate-400 mt-1">

                        Maximum of 1 tour per day

                    </p>

                </div>

            `;

        return `

            <div class="bg-[#F5FAFF] border border-sky-200 rounded-2xl p-4 mb-4 transition">

                <div class="flex items-center justify-between gap-2 mb-3">

                    <div class="flex items-center gap-2.5">

                        <span class="w-7 h-7 rounded-full bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">

                            ${index + 1}

                        </span>

                        <h3 class="text-sm font-extrabold text-[#0F2942]">

                            Day ${index + 1} – ${escapeHTML(day.title)}

                        </h3>

                    </div>

                    <span class="text-[11px] font-bold px-2.5 py-1 rounded-full
                        ${dayTours.length
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-white text-sky-700"}">

                        ${dayTours.length} / 1 Tour

                    </span>

                </div>

                <div
                    class="drop-zone min-h-[115px] rounded-xl border-2 border-dashed p-3
                        ${dayTours.length
                            ? "border-emerald-300 bg-white"
                            : "border-sky-300 bg-white/75"}"

                    ondragover="handleDragOver(event)"

                    ondragleave="handleDragLeave(event)"

                    ondrop="handleDropOnDay(event, '${day.id}')">

                    ${cards}

                </div>

            </div>

        `;

    }).join("");

    renderAvailableTours();

    updatePricing();

    updateProgress();

    saveItineraryDraft();

}


/* ==========================================
   ITINERARY PROGRESS
========================================== */

function updateProgress() {

    const planned = days.filter(
        day => day.tours.length > 0
    ).length;

    const percentage = Math.round(
        planned / days.length * 100
    );

    setText(
        "plannerProgressText",
        `${planned} of ${days.length} days planned`
    );

    const progressBar = $("plannerProgressBar");

    if (progressBar) {

        progressBar.style.width = `${percentage}%`;

    }

}


/* ==========================================
   DRAG FROM AVAILABLE TOURS
========================================== */

function handleCatalogDragStart(event, tourId) {

    if (getScheduledDayIndex(tourId) !== -1) {

        event.preventDefault();

        return;

    }

    dragState = {

        sourceType: "catalog",

        tourId: tourId,

        sourceDayId: null,

        sourceIndex: null

    };

    event.dataTransfer.effectAllowed = "copy";

    event.dataTransfer.setData("text/plain", tourId);

    event.currentTarget.classList.add("dragging");

}


/* ==========================================
   DRAG FROM EXISTING ITINERARY
========================================== */

function handleItineraryDragStart(
    event,
    dayId,
    tourIndex,
    tourId
) {

    dragState = {

        sourceType: "itinerary",

        tourId: tourId,

        sourceDayId: dayId,

        sourceIndex: tourIndex

    };

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData("text/plain", tourId);

    event.currentTarget.classList.add("dragging");

}


/* ==========================================
   DRAG EVENTS
========================================== */

function handleDragEnd(event) {

    event.currentTarget.classList.remove("dragging");

    document.querySelectorAll(".drop-zone").forEach(zone => {

        zone.classList.remove("drag-over");

    });

    dragState = {

        sourceType: null,

        tourId: null,

        sourceDayId: null,

        sourceIndex: null

    };

}

function handleDragOver(event) {

    event.preventDefault();

    event.dataTransfer.dropEffect =
        dragState.sourceType === "itinerary"
            ? "move"
            : "copy";

    event.currentTarget.classList.add("drag-over");

}

function handleDragLeave(event) {

    if (!event.currentTarget.contains(event.relatedTarget)) {

        event.currentTarget.classList.remove("drag-over");

    }

}


/* ==========================================
   DROP TOUR ON SELECTED DAY
========================================== */

function handleDropOnDay(event, targetDayId) {

    event.preventDefault();

    event.currentTarget.classList.remove("drag-over");

    const tourId = dragState.tourId ||
        event.dataTransfer.getData("text/plain");

    const targetDay = days.find(
        day => day.id === targetDayId
    );

    const tour = getTourById(tourId);

    if (!targetDay || !tour) return;

    if (dragState.sourceDayId === targetDayId) return;

    if (targetDay.tours.length >= 1) {

        showToast(
            "This day already has a tour. Remove it first.",
            "warning"
        );

        return;

    }

    if (dragState.sourceType === "itinerary") {

        const sourceDay = days.find(
            day => day.id === dragState.sourceDayId
        );

        if (!sourceDay || !sourceDay.tours.includes(tourId)) {
            return;
        }

        sourceDay.tours = sourceDay.tours.filter(
            id => id !== tourId
        );

        targetDay.tours.push(tourId);

        renderItinerary();

        showToast(
            "Tour successfully moved.",
            "success"
        );

    } else {

        addTourToDay(tourId, targetDayId);

    }

}


/* ==========================================
   ADD TOUR TO DAY
========================================== */

function addTourToDay(tourId, dayId) {

    const tour = getTourById(tourId);

    const day = days.find(item => item.id === dayId);

    if (!tour || !day) return false;

    const scheduledIndex = getScheduledDayIndex(tourId);

    if (scheduledIndex !== -1) {

        showToast(
            `This tour is already scheduled on Day ${scheduledIndex + 1}.`,
            "warning"
        );

        return false;

    }

    if (day.tours.length >= 1) {

        showToast(
            "This day already has a tour.",
            "warning"
        );

        return false;

    }

    day.tours.push(tourId);

    renderItinerary();

    showToast(
        `${tour.title} successfully added.`,
        "success"
    );

    return true;

}


/* ==========================================
   QUICK ADD TOUR
========================================== */

function quickAddTour(tourId) {

    if (getScheduledDayIndex(tourId) !== -1) {

        showToast(
            "This tour is already scheduled.",
            "warning"
        );

        return;

    }

    const emptyDay = days.find(
        day => day.tours.length === 0
    );

    if (!emptyDay) {

        showToast(
            "All itinerary days are full. Generate more days or remove a tour.",
            "warning"
        );

        return;

    }

    addTourToDay(tourId, emptyDay.id);

}


/* ==========================================
   REMOVE TOUR
========================================== */

function removeTourFromDay(dayId, tourIndex) {

    const day = days.find(item => item.id === dayId);

    if (!day) return;

    const removed = day.tours.splice(tourIndex, 1);

    const tour = getTourById(removed[0]);

    renderItinerary();

    showToast(
        tour ? `${tour.title} removed.` : "Tour removed.",
        "info"
    );

}


/* ==========================================
   CLEAR ALL TOURS
========================================== */

function clearAllDays() {

    days.forEach(day => {

        day.tours = [];

    });

    renderItinerary();

    showToast(
        "All itinerary tours cleared.",
        "info"
    );

}


/* ==========================================
   RESET ITINERARY
========================================== */

function resetToDefault() {

    days = JSON.parse(JSON.stringify(DEFAULT_DAYS));

    renderItinerary();

    showToast(
        "Itinerary successfully reset.",
        "success"
    );

}


/* ==========================================
   NUMBER OF TRAVELERS
========================================== */

function changePax(delta) {

    paxCount = Math.max(
        1,
        Math.min(20, paxCount + Number(delta))
    );

    setText("paxDisplay", paxCount);

    updatePricing();

}


/* ==========================================
   AUTOMATIC PRICE COMPUTATION
========================================== */

function calculatePricing() {

    let addonPerPax = 0;

    let addonCount = 0;

    days.forEach(day => {

        day.tours.forEach(id => {

            const tour = getTourById(id);

            if (tour && !tour.includedInBase) {

                addonPerPax += Number(tour.addonPrice) || 0;

                addonCount++;

            }

        });

    });

    const perPaxTotal =
        BASE_PRICE_PER_PAX + addonPerPax;

    const grandTotal =
        perPaxTotal * paxCount;

    return {

        addonPerPax,

        addonCount,

        perPaxTotal,

        grandTotal

    };

}


/* ==========================================
   UPDATE PRICE DISPLAY
========================================== */

function updatePricing() {

    const {

        addonCount,

        perPaxTotal,

        grandTotal

    } = calculatePricing();

    setText(
        "totalPriceDisplay",
        formatPHP(grandTotal)
    );

    setText(
        "perPersonBreakdown",
        `${formatPHP(perPaxTotal)} / pax × ${paxCount} guest(s)`
    );

    const badge = $("extraToursBadge");

    if (badge) {

        badge.classList.toggle(
            "hidden",
            addonCount === 0
        );

        badge.textContent = `+${addonCount} Add-on(s)`;

    }

}


/* ==========================================
   TOUR INCLUSIONS AND EXCLUSIONS
========================================== */

function switchInfoTab(tab) {

    const tabInc = $("tabInclusions");

    const tabExc = $("tabExclusions");

    const panelInc = $("panelInclusions");

    const panelExc = $("panelExclusions");

    if (!tabInc || !tabExc || !panelInc || !panelExc) {
        return;
    }

    const inclusions = tab === "inclusions";

    const activeClass =
        "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold bg-sky-600 text-white shadow-sm transition";

    const inactiveClass =
        "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-yellow-100 transition";

    tabInc.className =
        inclusions ? activeClass : inactiveClass;

    tabExc.className =
        inclusions ? inactiveClass : activeClass;

    panelInc.classList.toggle(
        "hidden",
        !inclusions
    );

    panelExc.classList.toggle(
        "hidden",
        inclusions
    );

}


/* ==========================================
   TOUR DETAILS MODAL
========================================== */

function openTourModal(tourId) {

    const tour = getTourById(tourId);

    if (!tour) return;

    const modal = $("tourDetailModal");

    if (!modal) return;

    const image = $("modalTourImg");

    if (image) {

        image.onerror = function () {

            this.onerror = null;

            this.src = tour.fallbackImg || "palawan.jpg";

        };

        image.src = tour.image;

        image.alt = tour.title;

    }

    setText("modalTourLocation", tour.location);

    setText("modalTourDuration", tour.durationLabel);

    setText("modalTourTitle", tour.title);

    setText("modalTourSchedule", tour.schedule);

    setText("modalTourDesc", tour.description);

    setText(

        "modalTourPrice",

        tour.includedInBase
            ? "Included in Base"
            : `+${formatPHP(tour.addonPrice)} / pax`

    );

    const priceElement = $("modalTourPrice");

    if (priceElement) {

        priceElement.className = tour.includedInBase

            ? "text-sm font-extrabold text-emerald-700"

            : "text-sm font-extrabold text-amber-700";

    }


    /* TOURIST ATTRACTIONS */

    const spotsContainer = $("modalTourSpots");

    if (spotsContainer) {

        spotsContainer.innerHTML = (tour.spots || [])
            .map(spot => `

                <div class="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700">

                    <i class="fa-solid fa-location-dot text-sky-600"></i>

                    ${escapeHTML(spot)}

                </div>

            `).join("");

    }


    /* SELECT DAY */

    const daySelect = $("modalTargetDay");

    const addButton = $("modalAddBtn");

    const scheduledIndex = getScheduledDayIndex(tour.id);

    const availableDay = days.find(
        day => day.tours.length === 0
    );

    if (daySelect && addButton) {

        daySelect.innerHTML = days.map((day, index) => `

            <option value="${day.id}"
                ${day.tours.length ? "disabled" : ""}>

                Day ${index + 1} – ${escapeHTML(day.title)}

                ${day.tours.length ? "(Full)" : "(Available)"}

            </option>

        `).join("");

        if (scheduledIndex !== -1) {

            daySelect.disabled = true;

            addButton.disabled = true;

            addButton.textContent =
                `Already in Day ${scheduledIndex + 1}`;

            addButton.onclick = null;

        } else if (!availableDay) {

            daySelect.disabled = true;

            addButton.disabled = true;

            addButton.textContent = "All Days Full";

            addButton.onclick = null;

        } else {

            daySelect.disabled = false;

            daySelect.value = availableDay.id;

            addButton.disabled = false;

            addButton.innerHTML = `
                <i class="fa-solid fa-plus"></i>
                Add to Day
            `;

            addButton.onclick = () => {

                const added = addTourToDay(
                    tour.id,
                    daySelect.value
                );

                if (added) {
                    closeTourModal();
                }

            };

        }

        addButton.className = addButton.disabled

            ? "px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 text-slate-500 cursor-not-allowed"

            : "px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-yellow-400 hover:text-slate-900 text-white transition";

    }

    modal.classList.remove("hidden");

    modal.classList.add("flex");

}


/* ==========================================
   CLOSE TOUR MODAL
========================================== */

function closeTourModal() {

    const modal = $("tourDetailModal");

    if (!modal) return;

    modal.classList.add("hidden");

    modal.classList.remove("flex");

}


/* ==========================================
   SAVE AND REVIEW YOUR TRIP
========================================== */

function openSummaryModal() {

    const totalScheduled = days.reduce(
        (sum, day) => sum + day.tours.length,
        0
    );

    if (totalScheduled === 0) {

        showToast(
            "Please add at least one tour before reviewing your trip.",
            "warning"
        );

        return;

    }

    const modal = $("summaryModal");

    const body = $("summaryModalBody");

    if (!modal || !body) return;

    const {

        addonPerPax,

        perPaxTotal,

        grandTotal

    } = calculatePricing();

    const daysHTML = days.map((day, index) => {

        const tours = day.tours
            .map(getTourById)
            .filter(Boolean);

        return `

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">

                <div class="flex justify-between items-center gap-2 mb-3">

                    <h4 class="font-extrabold text-[#0F2942]">

                        Day ${index + 1} – ${escapeHTML(day.title)}

                    </h4>

                    <span class="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">

                        ${tours.length} Tour(s)

                    </span>

                </div>

                ${tours.length

                    ? tours.map(tour => `

                        <div class="flex justify-between items-center gap-3 bg-white border border-slate-100 rounded-lg p-3 text-xs">

                            <span class="font-bold text-slate-800">

                                <i class="fa-solid fa-check text-emerald-500"></i>

                                ${escapeHTML(tour.title)}

                            </span>

                            <span class="font-bold
                                ${tour.includedInBase
                                    ? "text-emerald-600"
                                    : "text-amber-700"}">

                                ${tour.includedInBase
                                    ? "Included"
                                    : "+" + formatPHP(tour.addonPrice) + "/pax"}

                            </span>

                        </div>

                    `).join("")

                    : `<p class="text-xs text-slate-400 italic">

                        Free & easy day

                       </p>`

                }

            </div>

        `;

    }).join("");

    body.innerHTML = `

        ${daysHTML}

        <div class="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-3 text-xs">

            <div class="flex justify-between gap-3 text-slate-600">

                <span>

                    Base Package (${paxCount} pax)

                </span>

                <strong>

                    ${formatPHP(BASE_PRICE_PER_PAX * paxCount)}

                </strong>

            </div>

            <div class="flex justify-between gap-3 text-slate-600">

                <span>Selected Add-on Tours</span>

                <strong>

                    ${formatPHP(addonPerPax * paxCount)}

                </strong>

            </div>

            <div class="flex justify-between gap-3 text-slate-600">

                <span>Rate Per Person</span>

                <strong>

                    ${formatPHP(perPaxTotal)}

                </strong>

            </div>

            <div class="pt-3 border-t border-sky-200 flex justify-between items-center gap-3">

                <span class="text-base font-extrabold text-[#0F2942]">

                    Estimated Grand Total

                </span>

                <strong class="text-lg font-extrabold text-sky-700">

                    ${formatPHP(grandTotal)}

                </strong>

            </div>

        </div>

    `;

    saveItineraryDraft();

    modal.classList.remove("hidden");

    modal.classList.add("flex");

}


/* ==========================================
   CLOSE SUMMARY MODAL
========================================== */

function closeSummaryModal() {

    const modal = $("summaryModal");

    if (!modal) return;

    modal.classList.add("hidden");

    modal.classList.remove("flex");

}


/* ==========================================
   COPY ITINERARY
========================================== */

async function copyItineraryText() {

    const {

        perPaxTotal,

        grandTotal

    } = calculatePricing();

    const lines = [

        "CUSTOMIZED PALAWAN & EL NIDO ITINERARY",

        `Guests: ${paxCount}`,

        `Rate per person: ${formatPHP(perPaxTotal)}`,

        `Estimated Total: ${formatPHP(grandTotal)}`,

        "--------------------------------"

    ];

    days.forEach((day, index) => {

        lines.push(`\nDay ${index + 1} – ${day.title}`);

        if (day.tours.length === 0) {

            lines.push("Free time / Leisure");

        } else {

            day.tours.forEach(id => {

                const tour = getTourById(id);

                if (tour) {

                    lines.push(
                        `• ${tour.title} (${tour.schedule})`
                    );

                }

            });

        }

    });

    const content = lines.join("\n");

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(content);

        } else {

            const textarea = document.createElement("textarea");

            textarea.value = content;

            document.body.appendChild(textarea);

            textarea.select();

            const copied = document.execCommand("copy");

            textarea.remove();

            if (!copied) {
                throw new Error("Copy failed");
            }

        }

        showToast(
            "Itinerary copied successfully.",
            "success"
        );

    } catch (error) {

        showToast(
            "Unable to copy itinerary.",
            "warning"
        );

    }

}


/* ==========================================
   PROCEED TO HOTEL BOOKING
========================================== */

function confirmBookingSimulation() {

    const {

        addonPerPax,

        perPaxTotal,

        grandTotal

    } = calculatePricing();

    const payload = {

        destination: "El Nido",

        pax: paxCount,

        basePerPax: BASE_PRICE_PER_PAX,

        addonPerPax: addonPerPax,

        perPaxTotal: perPaxTotal,

        grandTotal: grandTotal,

        days: days.map((day, index) => ({

            day: index + 1,

            title: day.title,

            tours: day.tours

                .map(getTourById)

                .filter(Boolean)

                .map(tour => ({

                    id: tour.id,

                    title: tour.title,

                    location: tour.location,

                    image: tour.image,

                    schedule: tour.schedule,

                    included: tour.includedInBase,

                    addonPrice: tour.addonPrice

                }))

        }))

    };

    try {

        sessionStorage.setItem(
            "ppw_custom_itinerary",
            JSON.stringify(payload)
        );

        saveItineraryDraft();

    } catch (error) {
        console.warn("Unable to save itinerary:", error);
    }

    window.location.href = "hotelaccomodation.html";
}


/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

function showToast(message, type = "info") {

    let container = $("toastContainer");

    if (!container) {

        container = document.createElement("div");

        container.id = "toastContainer";

        container.style.cssText = `

            position: fixed;

            bottom: 20px;

            right: 20px;

            z-index: 9999;

            display: grid;

            gap: 10px;

            max-width: calc(100vw - 40px);

        `;

        document.body.appendChild(container);

    }

    const toast = document.createElement("div");

    const colors = {

        success: "#047857",

        warning: "#d97706",

        info: "#0F2942"

    };

    const icons = {

        success: "fa-circle-check",

        warning: "fa-triangle-exclamation",

        info: "fa-circle-info"

    };

    toast.className =
        "border px-4 py-3 rounded-xl shadow-lg text-xs font-bold flex items-center gap-2.5 max-w-sm";

    toast.style.background =
        colors[type] || colors.info;

    toast.style.color = "#ffffff";

    toast.style.transition = "all .3s ease";

    toast.setAttribute("role", "status");

    toast.innerHTML = `

        <i class="fa-solid ${icons[type] || icons.info}"></i>

        <span>${escapeHTML(message)}</span>

    `;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateY(10px)";

        setTimeout(() => toast.remove(), 300);

    }, 3200);

}


/* ==========================================
   HOMEPAGE HEADER
========================================== */

function initializeHeader() {

    const searchToggle = $("headerSearchToggle");

    const searchForm = $("headerSearchForm");

    const searchInput = $("home-location-search");

    const searchResults = $("home-search-results");

    const mobileToggle = $("mobileMenuToggle");

    const navigation = $("mainNavigation");

    const accountButton = $("customerAccountButton");

    const destinations = [

        "Puerto Princesa",

        "El Nido",

        "Coron",

        "Palawan",

        "Port Barton",

        "Balabac",

        "Aborlan",

        "Agutaya",

        "Araceli",

        "Bataraza",

        "Brooke's Point",

        "Busuanga",

        "Cagayancillo",

        "Culion",

        "Cuyo",

        "Dumaran",

        "Kalayaan",

        "Linapacan",

        "Magsaysay",

        "Narra",

        "Quezon",

        "Rizal",

        "Roxas",

        "San Vicente",

        "Sofronio Española",

        "Taytay",

        "Baguio",

        "Zambales",

        "Cebu",

        "Bohol",

        "Boracay",

        "Davao",

        "Siargao",

        "Vietnam",

        "Japan"

    ];

    function normalize(value) {

        return String(value || "")

            .toLowerCase()

            .replace(/[\s-]+/g, "");

    }

    function getDestinationPage(name) {

        if (["Vietnam", "Japan"].includes(name)) {

            return "beyond-philippines.html";

        }

        if ([

            "Baguio",

            "Zambales",

            "Cebu",

            "Bohol",

            "Boracay",

            "Davao",

            "Siargao"

        ].includes(name)) {

            return "local-destinations.html";

        }

        return "discover-palawan.html";

    }


    /* HEADER SEARCH RESULTS */

    function renderHeaderResults() {

        if (!searchInput || !searchResults) return [];

        const query = normalize(searchInput.value);

        searchResults.replaceChildren();

        if (!query) {

            searchResults.hidden = true;

            searchResults.style.display = "none";

            return [];

        }

        const matches = destinations.filter(name =>

            normalize(name).includes(query)

        );

        searchResults.hidden = false;

        searchResults.style.display = "block";

        if (!matches.length) {

            const message = document.createElement("p");

            message.textContent = "No matching destinations.";

            message.style.padding = "12px";

            searchResults.appendChild(message);

            return [];

        }

        matches.forEach(name => {

            const link = document.createElement("a");

            link.href = getDestinationPage(name);

            link.textContent = name;

            link.style.display = "block";

            link.style.padding = "12px";

            searchResults.appendChild(link);

        });

        return matches;

    }


    /* SEARCH TOGGLE */

    function setSearch(open) {

        if (!searchForm || !searchToggle) return;

        searchForm.hidden = !open;

        searchToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        const icon = searchToggle.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-search";

        }

        if (open) {

            setMenu(false);

            searchInput?.focus();

            renderHeaderResults();

        } else if (searchResults) {

            searchResults.hidden = true;

            searchResults.style.display = "none";

        }

    }


    /* MOBILE MENU */

    function setMenu(open) {

        if (!navigation || !mobileToggle) return;

        navigation.classList.toggle("open", open);

        navigation.classList.toggle("is-open", open);

        mobileToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        const icon = mobileToggle.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-list";

        }

        if (open) {

            setSearch(false);

        }

    }


    /* HEADER EVENTS */

    searchToggle?.addEventListener("click", () => {

        if (searchForm) {

            setSearch(searchForm.hidden);

        }

    });

    mobileToggle?.addEventListener("click", () => {

        if (navigation) {

            setMenu(
                !navigation.classList.contains("open")
            );

        }

    });

    searchInput?.addEventListener(
        "input",
        renderHeaderResults
    );

    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const matches = renderHeaderResults();

        const query = normalize(searchInput?.value);

        const exact = matches.find(name =>
            normalize(name) === query
        );

        if (exact) {

            window.location.href =
                getDestinationPage(exact);

        } else if (matches.length === 1) {

            window.location.href =
                getDestinationPage(matches[0]);

        }

    });

    document.addEventListener("click", event => {

        if (!event.target.closest(".header-search-wrapper")) {

            setSearch(false);

        }

        if (!event.target.closest(".ppow-header")) {

            setMenu(false);

        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setSearch(false);

            setMenu(false);

        }

    });


    /* CUSTOMER ACCOUNT */

    function updateCustomerAccount() {

        if (!accountButton) return;

        try {

            const loggedIn = JSON.parse(

                localStorage.getItem(
                    "ppowCustomerLoggedIn_v1"
                ) || "false"

            );

            accountButton.href = loggedIn === true

                ? "customer-account.html"

                : "login.html";

        } catch (error) {

            accountButton.href = "login.html";

        }

    }

    updateCustomerAccount();

    window.addEventListener(
        "pageshow",
        updateCustomerAccount
    );

    window.addEventListener(
        "storage",
        updateCustomerAccount
    );

}


/* ==========================================
   CLOSE MODALS WITH ESCAPE
========================================== */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeTourModal();

        closeSummaryModal();

    }

});


/* ==========================================
   INITIALIZE TRIP PLANNER
   IMPORTANT: DO NOT REMOVE
========================================== */

function bindStaticActions() {
    document.querySelectorAll('[data-action-error="0"]').forEach(el => {
        const handler = function(event) { this.hidden=true;this.nextElementSibling.hidden=false; };
        el.addEventListener("error", handler);
        if (el.complete && !el.naturalWidth) handler.call(el);
    });
    document.querySelectorAll('[data-action-error="1"]').forEach(el => {
        const handler = function(event) { this.hidden=true;this.nextElementSibling.hidden=false;this.nextElementSibling.style.display='flex'; };
        el.addEventListener("error", handler);
        if (el.complete && !el.naturalWidth) handler.call(el);
    });
    document.querySelectorAll('[data-action-click="3"]').forEach(el => {
        const handler = function(event) { setLocationFilter('ALL'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="4"]').forEach(el => {
        const handler = function(event) { setLocationFilter('El Nido'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="5"]').forEach(el => {
        const handler = function(event) { setLocationFilter('Puerto Princesa'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="6"]').forEach(el => {
        const handler = function(event) { generateItineraryDays(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="7"]').forEach(el => {
        const handler = function(event) { clearAllDays(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="8"]').forEach(el => {
        const handler = function(event) { resetToDefault(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="9"]').forEach(el => {
        const handler = function(event) { openSummaryModal(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="10"]').forEach(el => {
        const handler = function(event) { switchInfoTab('inclusions'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="11"]').forEach(el => {
        const handler = function(event) { switchInfoTab('exclusions'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="12"]').forEach(el => {
        const handler = function(event) { switchInfoTab('inclusions'); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="13"]').forEach(el => {
        const handler = function(event) { closeTourModal(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="14"]').forEach(el => {
        const handler = function(event) { closeSummaryModal(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="15"]').forEach(el => {
        const handler = function(event) { copyItineraryText(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="16"]').forEach(el => {
        const handler = function(event) { closeSummaryModal(); };
        el.addEventListener("click", handler);
    });
    document.querySelectorAll('[data-action-click="17"]').forEach(el => {

    const handler = function(event) {

        event.preventDefault();

        window.location.href = "hotelaccomodation.html";

    };

    el.addEventListener("click", handler);

});
}

function initializePlanner() {

    console.log("Initializing Customized Trip Planner...");

    initializeHeader();
    bindStaticActions();


    /* CHECK TOUR DATA FROM HTML */

    if (typeof TOURS === "undefined" || !Array.isArray(TOURS)) {

        console.error(
            "TOURS is missing. Declare const TOURS in the HTML before loading this JavaScript."
        );

        const container = $("availableToursList");

        if (container) {

            container.textContent =
                "Unable to load tours. Please check the tour data in HTML.";

        }

        return;

    }


    /* LOAD SAVED DATA */

    loadSavedItinerary();

    days.forEach(day => {

        day.tours = day.tours.filter(
            id => Boolean(getTourById(id))
        );

    });


    /* LOAD NUMBER OF TRAVELERS */

    try {

        const context = JSON.parse(
            sessionStorage.getItem("ppw_booking_context")
        );

        if (context && Number(context.pax) > 0) {

            paxCount = Math.max(

                1,

                Math.min(
                    20,
                    Math.floor(Number(context.pax))
                )

            );

        }

    } catch (error) {

        paxCount = 2;

    }

    setText("paxDisplay", paxCount);

    setText("itineraryDayCount", days.length);

    if ($("tripDayCount")) {

        $("tripDayCount").value = days.length;

    }


    /* TOUR SEARCH */

    $("tourSearchInput")?.addEventListener(
        "input",
        renderAvailableTours
    );


    /* RENDER TOUR CARDS */

    renderAvailableTours();


    /* RENDER ITINERARY DAY BOXES */

    renderItinerary();


    /* UPDATE PRICE */

    updatePricing();


    /* UPDATE PROGRESS */

    updateProgress();

    console.log("Customized Trip Planner initialized.");

}


/* ==========================================
   EXPOSE FUNCTIONS TO HTML BUTTONS
========================================== */

Object.assign(window, {

    setLocationFilter,

    renderAvailableTours,

    resetTourSearch,

    generateItineraryDays,

    renderItinerary,

    handleCatalogDragStart,

    handleItineraryDragStart,

    handleDragEnd,

    handleDragOver,

    handleDragLeave,

    handleDropOnDay,

    addTourToDay,

    quickAddTour,

    removeTourFromDay,

    clearAllDays,

    resetToDefault,

    changePax,

    switchInfoTab,

    openTourModal,

    closeTourModal,

    openSummaryModal,

    closeSummaryModal,

    copyItineraryText,

    confirmBookingSimulation

});


/* ==========================================
   START SYSTEM WHEN HTML IS READY
========================================== */

if (document.readyState === "loading") {

    document.addEventListener(

        "DOMContentLoaded",

        initializePlanner,

        { once: true }

    );

} else {

    initializePlanner();

}






