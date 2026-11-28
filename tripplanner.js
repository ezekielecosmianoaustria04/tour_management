"use strict";

/* ==========================================
   HELPER FUNCTIONS
========================================== */

const $ = id => document.getElementById(id);

const cards = () => [
    ...document.querySelectorAll("#tour-tiles .tour-card")
];

const normalize = value =>
    String(value || "")
        .toLowerCase()
        .replace(/[\s-]+/g, "");


/* ==========================================
   TRIP PLANNER PAGE NAVIGATION
========================================== */

function showTripPlannerPage(id) {

    if (!$(id)) return;

    document.querySelectorAll(".app-page").forEach(page => {

        page.hidden = page.id !== id;

        page.style.display = page.hidden
            ? "none"
            : "block";

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================
   OPEN TOUR ONLY
========================================== */

function openTourOnly() {

    showTripPlannerPage("destination-page");

}


/* ==========================================
   OPEN CUSTOMIZE YOUR TRIP
========================================== */

function openCustomizeChoice() {

    location.href = "tripplanner-customized.html";

}


/* ==========================================
   SELECT DESTINATION
========================================== */

function chooseTourDestination(destination) {

    let count = 0;

    cards().forEach(card => {

        card.hidden =
            normalize(card.dataset.destination) !==
            normalize(destination);

        if (!card.hidden) {

            count++;

        }

    });

    $("no-tour-message").hidden = count > 0;

    $("selected-destination-title").textContent =
        destination + " Tour Packages";

    showTripPlannerPage("tours-page");

}


/* ==========================================
   GET TOUR INFORMATION FROM HTML

   Edit tour name, price and picture
   directly inside tripplanner.html.
========================================== */

function getTour(id) {

    const card = cards().find(
        c => Number(c.dataset.tourId) === Number(id)
    );

    if (!card) return null;

    const price = Number(

        card.querySelector(".tour-price")
            .textContent
            .split("/")[0]
            .replace(/[^\d.]/g, "")

    );

    return {

        id: Number(id),

        name: card.querySelector("h3")
            .textContent.trim(),

        destination: card.dataset.destination,

        price: price,

        image: card.querySelector("img")
            .getAttribute("src")

    };

}


/* ==========================================
   OPEN FULLSCREEN TOUR DETAILS
========================================== */

function openTourDetails(id) {

    const tour = getTour(id);

    const drawer = $("tourDetailsDrawer");

    const sections = [

        ...drawer.querySelectorAll(".tour-detail-content")

    ];

    const selected = sections.find(

        section =>
            Number(section.dataset.tourId) === Number(id)

    );

    if (!selected || !tour) return;

    /* HIDE OTHER TOUR DETAILS */

    sections.forEach(section => {

        section.hidden = section !== selected;

    });

    /* UPDATE TOUR NAME */

    selected.querySelector("h2").textContent =
        tour.name;

    /* UPDATE TOUR PRICE */

    selected.querySelector(".tour-detail-price")
        .textContent =

        "₱" +

        tour.price.toLocaleString("en-PH") +

        " / person";

    /* UPDATE TOUR IMAGE */

    selected.querySelector("img").src =
        tour.image;

    selected.querySelector("img").alt =
        tour.name;

    /* OPEN DIALOG */

    drawer.showModal();

    drawer.scrollTop = 0;

}


/* ==========================================
   CLOSE TOUR DETAILS
========================================== */

function closeTourDetails() {

    $("tourDetailsDrawer").close();

}


/* ==========================================
   GET SELECTED TOURS FROM LOCAL STORAGE
========================================== */

function getTripCart() {

    try {

        const cart = JSON.parse(

            localStorage.getItem("travelCart") || "[]"

        );

        return Array.isArray(cart) ? cart : [];

    } catch {

        return [];

    }

}


/* ==========================================
   UPDATE SELECTED TOUR COUNT
========================================== */

function updateTripCartCount() {

    $("cart-count").textContent =

        getTripCart().reduce(

            (total, tour) =>

                total + (Number(tour.quantity) || 1),

            0

        );

}


/* ==========================================
   ADD TOUR FROM DETAILS DRAWER
========================================== */

function addDrawerTourToCart(id) {

    const tour = getTour(id);

    if (

        !tour ||

        !Number.isFinite(tour.price) ||

        tour.price <= 0

    ) return;

    const cart = getTripCart();

    const existing = cart.find(

        item => Number(item.id) === tour.id

    );

    /* UPDATE EXISTING TOUR */

    if (existing) {

        Object.assign(existing, tour, {

            quantity:
                (Number(existing.quantity) || 1) + 1

        });

    } else {

        /* ADD NEW TOUR */

        cart.push({

            ...tour,

            quantity: 1

        });

    }

    /* SAVE SELECTED TOURS */

    try {

        localStorage.setItem(

            "travelCart",

            JSON.stringify(cart)

        );

        updateTripCartCount();

        closeTourDetails();

        openTripCart();

    } catch {

        alert("Unable to save selected tour.");

    }

}


/* ==========================================
   OPEN SELECTED TOURS
========================================== */

function openTripCart() {

    const cart = getTripCart();

    const items = $("cartItems");

    items.replaceChildren();

    let total = 0;

    cart.forEach((tour, index) => {

        const row = document.createElement("p");

        const quantity = Number(tour.quantity) || 1;

        const subtotal = Number(tour.price) * quantity;

        total += subtotal;

        row.textContent =

            `${tour.name} × ${quantity} — ₱${subtotal.toLocaleString("en-PH")} `;

        /* REMOVE TOUR BUTTON */

        const remove = document.createElement("button");

        remove.type = "button";

        remove.textContent = "Remove";

        remove.onclick = () => {

            cart.splice(index, 1);

            try {

                localStorage.setItem(

                    "travelCart",

                    JSON.stringify(cart)

                );

                updateTripCartCount();

                openTripCart();

            } catch {

                alert("Unable to update selected tours.");

            }

        };

        row.append(remove);

        items.append(row);

    });

    /* EMPTY SELECTED TOURS */

    if (!cart.length) {

        items.textContent = "No selected tours yet.";

    }

    /* DISPLAY TOTAL PRICE */

    $("cartTotal").textContent =

        "Estimated total: ₱" +

        total.toLocaleString("en-PH");

    /* OPEN SELECTED TOURS DIALOG */

    if (!$("tripCart").open) {

        $("tripCart").showModal();

    }

}


/* ==========================================
   HEADER INITIALIZATION

   SAME HEADER AS HOMEPAGE
========================================== */

function initializeHeader() {

    const form = $("headerSearchForm");

    const toggle = $("headerSearchToggle");

    const input = $("home-location-search");

    const menu = $("mobileMenuToggle");

    const nav = $("mainNavigation");

    const results = $("home-search-results");

    /* SEARCH DATA FROM HTML */

    const links = [

        ...results.querySelectorAll("a")

    ];


    /* ======================================
       FILTER DESTINATION SEARCH
    ====================================== */

    function filter() {

        const query = normalize(input.value);

        let matches = [];

        links.forEach(link => {

            link.hidden =

                !query ||

                !normalize(link.textContent)
                    .includes(query);

            if (!link.hidden) {

                matches.push(link);

            }

        });

        results.style.display = query
            ? "flex"
            : "none";

        return matches;

    }


    /* ======================================
       EXPANDABLE SEARCH BUTTON
    ====================================== */

    function setSearch(open) {

        form.hidden = !open;

        toggle.setAttribute(

            "aria-expanded",

            String(open)

        );

        toggle.querySelector("i").className = open

            ? "bi bi-x-lg"

            : "bi bi-search";

        if (open) {

            setMenu(false);

            input.focus();

            filter();

        } else {

            results.style.display = "none";

        }

    }


    /* ======================================
       RESPONSIVE MOBILE MENU
    ====================================== */

    function setMenu(open) {

        nav.classList.toggle("open", open);

        menu.setAttribute(

            "aria-expanded",

            String(open)

        );

        menu.querySelector("i").className = open

            ? "bi bi-x-lg"

            : "bi bi-list";

        if (open) {

            setSearch(false);

        }

    }


    /* ======================================
       SEARCH BUTTON CLICK
    ====================================== */

    toggle.onclick = () => {

        setSearch(form.hidden);

    };


    /* ======================================
       MOBILE MENU BUTTON CLICK
    ====================================== */

    menu.onclick = () => {

        setMenu(

            !nav.classList.contains("open")

        );

    };


    /* ======================================
       LIVE SEARCH
    ====================================== */

    input.addEventListener("input", filter);


    /* ======================================
       SEARCH FORM SUBMISSION
    ====================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();

        const matches = filter();

        if (matches.length) {

            location.href = matches[0].href;

        }

    });


    /* ======================================
       CLOSE WHEN CLICKING OUTSIDE
    ====================================== */

    document.addEventListener("click", event => {

        if (

            !event.target.closest(
                ".header-search-wrapper"
            )

        ) {

            setSearch(false);

        }

        if (

            !event.target.closest(".ppow-header")

        ) {

            setMenu(false);

        }

    });


    /* ======================================
       CLOSE USING ESCAPE KEY
    ====================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setSearch(false);

            setMenu(false);

        }

    });


    /* ======================================
       CUSTOMER ACCOUNT
    ====================================== */

    try {

        const loggedIn = JSON.parse(

            localStorage.getItem(

                "ppowCustomerLoggedIn_v1"

            ) || "false"

        );

        if (loggedIn === true) {

            $("customerAccountButton").href =

                "customer-account.html";

        }

    } catch {

        // Keep the default login page link.

    }

}


/* ==========================================
   INITIALIZE TRIP PLANNER
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* INITIALIZE HEADER */

    initializeHeader();

    /* UPDATE SELECTED TOUR COUNT */

    updateTripCartCount();

    /* GET URL PARAMETERS */

    const params = new URLSearchParams(

        location.search

    );

    const destination = params.get("destination");


    /* ======================================
       CUSTOMIZE DIRECT LINK
    ====================================== */

    if (params.get("view") === "customize") {

        openCustomizeChoice();

        return;

    }


    /* ======================================
       TOUR ONLY DIRECT LINK
    ====================================== */

    if (params.get("view") === "tour-only") {

        if (destination) {

            const match = [

                ...document.querySelectorAll(

                    ".destination-selection-card h2"

                )

            ].find(heading =>

                normalize(heading.textContent) ===

                normalize(destination)

            );

            if (match) {

                chooseTourDestination(

                    match.textContent.trim()

                );

            } else {

                openTourOnly();

            }

        } else {

            openTourOnly();

        }

    } else {

        showTripPlannerPage("planner-page");

    }

});