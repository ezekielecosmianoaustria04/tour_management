
"use strict";

/* ==========================================
   TOUR PACKAGE DATA
   Used for cards, prices and cart only.
   Descriptions remain in HTML.
========================================== */

const tourPackages = [
    {
        id: 1,
        destination: "Puerto Princesa",
        name: "Underground River Tour",
        price: 2800,
        image: "underground-river.jpg"
    },
    {
        id: 2,
        destination: "Puerto Princesa",
        name: "Honda Bay Island Hopping",
        price: 2300,
        image: "honda-bay.jpg"
    },
    {
        id: 3,
        destination: "Puerto Princesa",
        name: "Jungle Firefly Watching",
        price: 2200,
        image: "firefly.jpg"
    },
    {
        id: 4,
        destination: "Puerto Princesa",
        name: "Halfday City Tour",
        price: 990,
        image: "puerto-princesa.jpg"
    },
    {
        id: 5,
        destination: "Puerto Princesa",
        name: "Bay Cruise & Firefly Watching",
        price: 2000,
        image: "bay-cruise.jpg"
    },
    {
        id: 6,
        destination: "Puerto Princesa",
        name: "Dolphin Watching",
        price: 1500,
        image: "dolphin-watching.jpg"
    },
    {
        id: 7,
        destination: "El Nido",
        name: "El Nido Island Hopping Tour A Package",
        price: 1600,
        image: "el-nido-tour-a.png"
    },
    {
        id: 8,
        destination: "El Nido",
        name: "El Nido Island Hopping Tour B Package",
        price: 1700,
        image: "el-nido-tour-b.png"
    },
    {
        id: 9,
        destination: "El Nido",
        name: "El Nido Island Hopping Tour C Package",
        price: 1800,
        image: "el-nido-tour-c.png"
    },
    {
        id: 10,
        destination: "El Nido",
        name: "El Nido Island Hopping Tour D Package",
        price: 1900,
        image: "el-nido-tour-d.png"
    },
    {
        id: 11,
        destination: "Coron",
        name: "Coron: Island Hopping Tour A",
        price: 1300,
        image: "coron.jpg"
    },
    {
        id: 12,
        destination: "Coron",
        name: "Coron: Town Tour",
        price: 1200,
        image: "coron.jpg"
    },
    {
        id: 13,
        destination: "Coron",
        name: "Coron: Island Escapade Tour",
        price: 1800,
        image: "coron.jpg"
    },
    {
        id: 14,
        destination: "Coron",
        name: "Coron: Island Hopping Tour B",
        price: 1800,
        image: "coron.jpg"
    }
];


/* ==========================================
   PAGE NAVIGATION
========================================== */

const tripPlannerPages = [
    "planner-page",
    "destination-page",
    "tours-page",
    "customize-choice-page"
];

function showTripPlannerPage(pageId) {

    if (!tripPlannerPages.includes(pageId)) {
        console.warn("Unknown page:", pageId);
        return;
    }

    tripPlannerPages.forEach(id => {

        const page = document.getElementById(id);

        if (page) {
            page.style.display =
                id === pageId ? "block" : "none";
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Compatibility with existing HTML onclick="showPage(...)"
function showPage(pageId) {
    showTripPlannerPage(pageId);
}


/* ==========================================
   TOUR ONLY
========================================== */

function openTourOnly() {
    showTripPlannerPage("destination-page");
}


/* ==========================================
   SELECT DESTINATION
========================================== */

let selectedTourDestination = "";

function normalizeTourDestination(destination) {

    const value = String(destination || "")
        .trim()
        .toLowerCase();

    const destinations = {
        "puerto princesa": "Puerto Princesa",
        "puerto-princesa": "Puerto Princesa",
        "elnido": "El Nido",
        "el nido": "El Nido",
        "el-nido": "El Nido",
        "coron": "Coron"
    };

    return destinations[value] || "";
}

function chooseTourDestination(destination) {

    const normalized = normalizeTourDestination(destination);

    if (!normalized) {
        console.warn("Unknown destination:", destination);
        return;
    }

    selectedTourDestination = normalized;

    renderTourCatalog();

    showTripPlannerPage("tours-page");
}


/* ==========================================
   RENDER TOUR CARDS
========================================== */

function renderTourCatalog() {

    const container = document.getElementById("tour-tiles");

    const title = document.getElementById(
        "selected-destination-title"
    );

    const description = document.getElementById(
        "selected-destination-description"
    );

    if (!container) {
        console.error("Missing element: #tour-tiles");
        return;
    }

    const selectedTours = tourPackages.filter(
        tour => tour.destination === selectedTourDestination
    );

    if (title) {
        title.textContent =
            selectedTourDestination + " Tour Packages";
    }

    if (description) {
        description.textContent =
            "Choose from our available tour packages in " +
            selectedTourDestination + ".";
    }

    container.replaceChildren();

    if (selectedTours.length === 0) {
        container.textContent =
            "No tour packages available.";
        return;
    }

    selectedTours.forEach(tour => {

        // CARD
        const card = document.createElement("article");
        card.className = "tour-card";
        card.dataset.destination = tour.destination;

        // IMAGE
        const image = document.createElement("img");
        image.src = tour.image;
        image.alt = tour.name;
        image.loading = "lazy";

        // CONTENT
        const content = document.createElement("div");
        content.className = "tour-card-content";

        // LOCATION
        const location = document.createElement("span");
        location.className = "tour-location";
        location.textContent = tour.destination;

        // NAME
        const name = document.createElement("h3");
        name.textContent = tour.name;

        // PRICE
        const price = document.createElement("p");
        price.className = "tour-price";

        price.textContent =
            "₱" + tour.price.toLocaleString("en-PH");

        const perPerson = document.createElement("small");
        perPerson.textContent = " / person";

        price.appendChild(perPerson);

        // ADD TO CART BUTTON
        const cartButton = document.createElement("button");
        cartButton.type = "button";
        cartButton.className = "tour-book-btn";
        cartButton.textContent = "Add to Cart";

        cartButton.addEventListener("click", () => {
            addTourToCart(tour.id);
        });

        // DETAILS BUTTON
        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "tour-details-btn";
        detailsButton.textContent = "Details →";

        detailsButton.addEventListener("click", () => {
            openTourDetails(tour.id);
        });

        content.append(
            location,
            name,
            price,
            cartButton,
            detailsButton
        );

        card.append(image, content);

        container.appendChild(card);
    });
}


/* ==========================================
   CART STORAGE
========================================== */

function getTripCart() {

    try {

        const savedCart = JSON.parse(
            localStorage.getItem("travelCart") || "[]"
        );

        return Array.isArray(savedCart) ? savedCart : [];

    } catch (error) {

        console.error("Unable to read cart:", error);
        return [];
    }
}


/* ==========================================
   ADD TOUR TO CART
========================================== */

function addTourToCart(tourId) {

    const selectedTour = tourPackages.find(
        tour => tour.id === Number(tourId)
    );

    if (!selectedTour) {
        console.warn("Tour not found:", tourId);
        return;
    }

    const cart = getTripCart();

    const existing = cart.find(
        item => Number(item.id) === selectedTour.id
    );

    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

    } else {

        cart.push({
            id: selectedTour.id,
            name: selectedTour.name,
            destination: selectedTour.destination,
            price: selectedTour.price,
            image: selectedTour.image,
            quantity: 1
        });
    }

    try {

        localStorage.setItem(
            "travelCart",
            JSON.stringify(cart)
        );

        updateTripCartCount();

        alert(selectedTour.name + " added to cart!");

    } catch (error) {

        console.error("Unable to save cart:", error);
        alert("Unable to save your cart. Please try again.");
    }
}

// Compatibility with existing onclick="selectTour(8)"
function selectTour(tourId) {
    addTourToCart(tourId);
}


/* ==========================================
   UPDATE CART COUNT
========================================== */

function updateTripCartCount() {

    const cart = getTripCart();

    const total = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );

    document.querySelectorAll("#cart-count").forEach(element => {
        element.textContent = total;
    });
}


/* ==========================================
   CUSTOMIZE YOUR TRIP
========================================== */

function openCustomizeTrip() {
    showTripPlannerPage("customize-choice-page");
}

function selectTripLocation(location) {

    if (location === "local") {

        window.location.href = "customize-local.html";

    } else if (location === "international") {

        window.location.href = "customize-international.html";

    } else {

        console.warn("Invalid trip location:", location);
    }
}

function openBuilder(destination, travelers) {

    alert(
        "Customize Your Trip\n\n" +
        "Destination: " + destination + "\n" +
        "Travelers: " + travelers + "\n\n" +
        "Trip customization feature is not yet connected."
    );
}


/* ==========================================
   FULL SCREEN TOUR DETAILS DRAWER
   Content comes directly from HTML.
========================================== */

let previousTourFocus = null;
let previousBodyOverflow = "";

function openTourDetails(tourId) {

    const drawer = document.getElementById(
        "tourDetailsDrawer"
    );

    if (!drawer) {
        console.error("Missing #tourDetailsDrawer");
        return;
    }

    const selectedTour = Array.from(
        drawer.querySelectorAll(".tour-detail-content")
    ).find(section =>
        Number(section.dataset.tourId) === Number(tourId)
    );

    if (!selectedTour) {

        console.warn(
            "Missing HTML tour details for ID:",
            tourId
        );

        alert("Tour details are not available yet.");
        return;
    }

    if (!drawer.classList.contains("active")) {
        previousTourFocus = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;
    }

    // Hide all other tour descriptions
    drawer.querySelectorAll(
        ".tour-detail-content"
    ).forEach(section => {
        section.hidden = true;
    });

    // Show only selected tour
    selectedTour.hidden = false;

    // Open full-screen drawer
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    // Reset drawer scroll
    const body = drawer.querySelector(".tour-drawer-body");

    if (body) {
        body.scrollTop = 0;
    }

    // Focus close button
    const closeButton = drawer.querySelector(
        ".tour-drawer-close"
    );

    if (closeButton) {
        closeButton.focus();
    }
}


/* ==========================================
   CLOSE TOUR DETAILS
========================================== */

function closeTourDetails() {

    const drawer = document.getElementById(
        "tourDetailsDrawer"
    );

    if (!drawer) return;

    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");

    document.body.style.overflow = previousBodyOverflow;

    if (
        previousTourFocus &&
        typeof previousTourFocus.focus === "function"
    ) {
        previousTourFocus.focus();
    }
}


/* ==========================================
   ADD TOUR FROM DETAILS DRAWER
========================================== */

function addDrawerTourToCart(tourId) {

    const selectedTour = tourPackages.find(
        tour => tour.id === Number(tourId)
    );

    if (!selectedTour) {
        console.warn("Invalid tour ID:", tourId);
        return;
    }

    closeTourDetails();

    addTourToCart(tourId);
}


/* ==========================================
   KEYBOARD SUPPORT
========================================== */

document.addEventListener("keydown", function(event) {

    const drawer = document.getElementById(
        "tourDetailsDrawer"
    );

    if (!drawer || !drawer.classList.contains("active")) {
        return;
    }

    // ESCAPE TO CLOSE
    if (event.key === "Escape") {

        event.preventDefault();
        closeTourDetails();
        return;
    }

    // KEEP FOCUS INSIDE DRAWER
    if (event.key === "Tab") {

        const focusable = Array.from(
            drawer.querySelectorAll(
                'button:not([disabled]), ' +
                'a[href], ' +
                'input:not([disabled]), ' +
                'select:not([disabled]), ' +
                'textarea:not([disabled])'
            )
        ).filter(element =>
            element.getClientRects().length > 0 &&
            !element.closest("[hidden]")
        );

        if (!focusable.length) {
            event.preventDefault();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {
            event.preventDefault();
            last.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    }
});


/* ==========================================
   DIRECT LINK SUPPORT

   Examples:
   tripplanner.html?view=tour-only
   tripplanner.html?view=tour-only&destination=Coron
   tripplanner.html?view=tour-only&destination=El%20Nido
========================================== */

function handleTripPlannerDirectLink() {

    const params = new URLSearchParams(
        window.location.search
    );

    const view = params.get("view");
    const destination = params.get("destination");

    if (view === "tour-only") {

        if (destination) {

            const normalized =
                normalizeTourDestination(destination);

            if (normalized) {
                chooseTourDestination(normalized);
            } else {
                openTourOnly();
            }

        } else {

            openTourOnly();
        }

    } else if (view === "customize") {

        openCustomizeTrip();

    } else {

        showTripPlannerPage("planner-page");
    }
}


/* ==========================================
   INITIALIZE TRIP PLANNER
========================================== */

document.addEventListener("DOMContentLoaded", function() {

    updateTripCartCount();

    handleTripPlannerDirectLink();

    // Ensure all drawer sections are initially hidden
    const drawer = document.getElementById(
        "tourDetailsDrawer"
    );

    if (drawer) {

        drawer.classList.remove("active");
        drawer.setAttribute("aria-hidden", "true");

        drawer.querySelectorAll(
            ".tour-detail-content"
        ).forEach(section => {
            section.hidden = true;
        });
    }
});





function openCustomizeChoice() {
    window.location.href = "tripplaner-customized.html";
}


