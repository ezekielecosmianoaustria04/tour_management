/* ==========================================
   DISCOVER PALAWAN
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       PALAWAN DESTINATIONS
    ====================================== */

    const destinations = [

        ["Puerto Princesa", 9.740, 118.735],
        ["Aborlan", 9.437, 118.548],
        ["Agutaya", 11.148, 120.957],
        ["Araceli", 10.552, 119.991],
        ["Balabac", 7.987, 117.064],
        ["Bataraza", 8.663, 117.624],
        ["Brooke's Point", 8.782, 117.833],
        ["Busuanga", 12.159, 119.946],
        ["Cagayancillo", 9.575, 121.200],
        ["Coron", 12.000, 120.205],
        ["Culion", 11.830, 119.994],
        ["Cuyo", 10.853, 121.008],
        ["Dumaran", 10.525, 119.768],
        ["El Nido", 11.179, 119.392],
        ["Kalayaan", 11.050, 114.283],
        ["Linapacan", 11.489, 119.868],
        ["Magsaysay", 10.875, 121.054],
        ["Narra", 9.268, 118.405],
        ["Quezon", 9.242, 117.994],
        ["Rizal", 8.684, 117.353],
        ["Roxas", 10.320, 119.345],
        ["San Vicente", 10.531, 119.270],
        ["Sofronio Española", 8.958, 118.015],
        ["Taytay", 10.817, 119.515]

    ];


    /* ======================================
       HEADER SEARCH VARIABLES
    ====================================== */

    const searchToggle =
        document.getElementById("headerSearchToggle");

    const headerSearchForm =
        document.getElementById("headerSearchForm");

    const headerSearchInput =
        document.getElementById("home-location-search");

    const headerSearchResults =
        document.getElementById("home-search-results");

    const searchWrapper =
        document.querySelector(".header-search-wrapper");


    /* ======================================
       MAP VARIABLES
    ====================================== */

    const mapNode =
        document.getElementById("philippinesTerrainMap");

    const search =
        document.getElementById("destinationSearch");

    const count =
        document.getElementById("destinationCount");

    const status =
        document.getElementById("terrainSelection");

    const buttons = new Map();

    const markers = new Map();

    let selected = null;

    let map = null;


    /* ======================================
       REDUCED MOTION
    ====================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ======================================
       NORMALIZE SEARCH TEXT
    ====================================== */

    function normalize(value) {

        return value

            .toLowerCase()

            .normalize("NFD")

            .replace(/[\u0300-\u036f]/g, "")

            .replace(/[^a-z0-9]/g, "");

    }


    /* ======================================
       OPEN HEADER SEARCH
    ====================================== */

    function openHeaderSearch() {

        if (!headerSearchForm) return;

        headerSearchForm.hidden = false;

        headerSearchForm.classList.add("active");

        searchToggle?.setAttribute(
            "aria-expanded",
            "true"
        );

        const icon = searchToggle?.querySelector("i");

        if (icon) {

            icon.className = "bi bi-x-lg";

        }

        headerSearchInput?.focus();

    }


    /* ======================================
       CLOSE HEADER SEARCH
    ====================================== */

    function closeHeaderSearch() {

        if (!headerSearchForm) return;

        headerSearchForm.hidden = true;

        headerSearchForm.classList.remove("active");

        searchToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        if (headerSearchResults) {

            headerSearchResults.hidden = true;

        }

        const icon = searchToggle?.querySelector("i");

        if (icon) {

            icon.className = "bi bi-search";

        }

    }


    /* ======================================
       SEARCH BUTTON TOGGLE
    ====================================== */

    searchToggle?.addEventListener("click", () => {

        if (headerSearchForm.hidden) {

            openHeaderSearch();

        } else {

            closeHeaderSearch();

        }

    });


    /* ======================================
       HEADER LIVE SEARCH RESULTS
    ====================================== */

    headerSearchInput?.addEventListener("input", () => {

        if (!headerSearchResults) return;

        const query = normalize(
            headerSearchInput.value.trim()
        );

        headerSearchResults.replaceChildren();

        if (!query) {

            headerSearchResults.hidden = true;

            return;

        }

        const matches = destinations.filter(([name]) =>

            normalize(name).includes(query)

        );

        headerSearchResults.hidden = false;

        if (matches.length === 0) {

            const message = document.createElement("p");

            message.textContent =
                "No matching destinations.";

            headerSearchResults.append(message);

            return;

        }

        matches.forEach(([name]) => {

            const result = document.createElement("a");

            result.href = "#terrain-planner";

            result.textContent = name;

            result.addEventListener("click", event => {

                event.preventDefault();

                if (search) {

                    search.value = name;

                    filterDestinations();

                }

                closeHeaderSearch();

                chooseDestination(name);

            });

            headerSearchResults.append(result);

        });

    });


    /* ======================================
       HEADER SEARCH SUBMISSION
    ====================================== */

    headerSearchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const query =
            headerSearchInput?.value.trim() || "";

        if (!query) return;

        if (search) {

            search.value = query;

            filterDestinations();

        }

        const exact = destinations.find(([name]) =>

            normalize(name) === normalize(query)

        );

        const matches = destinations.filter(([name]) =>

            normalize(name).includes(normalize(query))

        );

        closeHeaderSearch();

        if (exact) {

            chooseDestination(exact[0]);

        } else if (matches.length === 1) {

            chooseDestination(matches[0][0]);

        } else {

            search?.scrollIntoView({

                behavior: reducedMotion ? "auto" : "smooth",

                block: "center"

            });

        }

    });


    /* ======================================
       CLOSE SEARCH WHEN CLICKING OUTSIDE
    ====================================== */

    document.addEventListener("click", event => {

        if (

            searchWrapper &&

            !searchWrapper.contains(event.target)

        ) {

            closeHeaderSearch();

        }

    });


    /* ======================================
       MOBILE NAVIGATION
    ====================================== */

    const mobileMenuToggle =
        document.getElementById("mobileMenuToggle");

    const mainNavigation =
        document.getElementById("mainNavigation");

    function closeMobileMenu() {

        mainNavigation?.classList.remove("active", "open");

        mobileMenuToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        const icon =
            mobileMenuToggle?.querySelector("i");

        if (icon) {

            icon.className = "bi bi-list";

        }

    }

    mobileMenuToggle?.addEventListener("click", () => {

        if (!mainNavigation) return;

        const isOpen = mainNavigation.classList.toggle(
            "active"
        );

        mainNavigation.classList.toggle("open", isOpen);

        mobileMenuToggle.setAttribute(

            "aria-expanded",

            String(isOpen)

        );

        const icon =
            mobileMenuToggle.querySelector("i");

        if (icon) {

            icon.className = isOpen

                ? "bi bi-x-lg"

                : "bi bi-list";

        }

    });

    mainNavigation?.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });


    /* ======================================
       ESCAPE KEY
    ====================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closeHeaderSearch();

            closeMobileMenu();

        }

    });


    /* ======================================
       CUSTOMER ACCOUNT BUTTON
    ====================================== */

    const customerAccountButton =
        document.getElementById("customerAccountButton");

    if (customerAccountButton) {

        const loggedIn =
            localStorage.getItem(
                "ppowCustomerLoggedIn_v1"
            ) === "true";

        customerAccountButton.href = loggedIn

            ? "customer-account.html"

            : "login.html";

    }


    /* ======================================
       MAP MARKER STYLE
    ====================================== */

    function styleMarker(name, hover = false) {

        const marker = markers.get(name);

        if (!marker) return;

        const active = selected === name;

        marker.setStyle({

            radius: hover ? 12 : active ? 11 : 7,

            weight: hover || active ? 4 : 2,

            color: hover || active

                ? "#facc15"

                : "#ffffff",

            fillColor: hover

                ? "#fde047"

                : active

                    ? "#facc15"

                    : "#2563eb",

            fillOpacity: 1

        });

    }


    /* ======================================
       SELECT DESTINATION
    ====================================== */

    function chooseDestination(name) {

        const place = destinations.find(

            destination => destination[0] === name

        );

        if (!place) return;

        const previous = selected;

        selected = name;

        if (previous) {

            styleMarker(previous);

        }

        styleMarker(name);

        buttons.forEach((button, key) => {

            const active = key === name;

            button.classList.toggle("active", active);

            button.setAttribute(

                "aria-pressed",

                String(active)

            );

        });

        if (status) {

            status.textContent =
                "Selected destination: " + name;

        }

        renderAttractions(name);

        if (map) {

            const zoom = name === "Kalayaan" ? 7 : 10;

            if (reducedMotion) {

                map.setView([place[1], place[2]], zoom);

            } else {

                map.flyTo(

                    [place[1], place[2]],

                    zoom,

                    {
                        duration: 1.1
                    }

                );

            }

            markers.get(name)?.openTooltip();

        }

    }


    /* ======================================
       DISPLAY ATTRACTIONS
    ====================================== */

    function renderAttractions(name) {

        const sections = document.querySelectorAll(

            ".destination-attractions"

        );

        let selectedSection = null;

        sections.forEach(section => {

            const matches =
                section.dataset.attractionsFor === name;

            section.hidden = !matches;

            if (matches) {

                selectedSection = section;

            }

        });

        if (selectedSection) {

            selectedSection.scrollIntoView({

                behavior: reducedMotion ? "auto" : "smooth",

                block: "start"

            });

        }

    }


    /* ======================================
       DESTINATION BUTTON EVENTS
    ====================================== */

    document.querySelectorAll(

        "#terrainButtons [data-destination]"

    ).forEach(button => {

        const name = button.dataset.destination;

        buttons.set(name, button);

        button.addEventListener("click", () => {

            chooseDestination(name);

        });

        button.addEventListener("mouseenter", () => {

            styleMarker(name, true);

        });

        button.addEventListener("mouseleave", () => {

            styleMarker(name);

        });

    });


    /* ======================================
       FILTER DESTINATIONS
    ====================================== */

    function filterDestinations() {

        const query = normalize(

            search?.value.trim() || ""

        );

        let visible = 0;

        buttons.forEach((button, name) => {

            const matches = normalize(name).includes(query);

            button.hidden = !matches;

            if (matches) {

                visible++;

            }

        });

        if (count) {

            count.textContent =

                `${visible} of ${destinations.length} destinations`;

        }

    }

    search?.addEventListener(

        "input",

        filterDestinations

    );

    filterDestinations();


    /* ======================================
       CHECK LEAFLET MAP
    ====================================== */

    if (!mapNode) return;

    if (typeof L === "undefined") {

        mapNode.textContent =

            "Terrain map could not load. You can still select a destination below.";

        mapNode.style.padding = "24px";

        return;

    }


    /* ======================================
       INITIALIZE TERRAIN MAP
    ====================================== */

    map = L.map(mapNode, {

        center: [10.4, 119.2],

        zoom: 7,

        minZoom: 4,

        maxZoom: 15,

        scrollWheelZoom: false

    });


    /* ======================================
       TERRAIN MAP TILE LAYER
    ====================================== */

    L.tileLayer(

        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",

        {

            attribution:

                "Map data © OpenStreetMap contributors, SRTM | Map style © OpenTopoMap",

            maxZoom: 15

        }

    ).addTo(map);


    /* ======================================
       DEFAULT MAP VIEW
    ====================================== */

    map.fitBounds(

        [

            [7.5, 116.8],

            [12.5, 121.3]

        ],

        {

            padding: [25, 25]

        }

    );


    /* ======================================
       CREATE DESTINATION MARKERS
    ====================================== */

    destinations.forEach(([name, lat, lng]) => {

        const marker = L.circleMarker(

            [lat, lng],

            {

                radius: 7,

                color: "#ffffff",

                weight: 2,

                fillColor: "#2563eb",

                fillOpacity: 1

            }

        ).addTo(map);


        /* DESTINATION TOOLTIP */

        marker.bindTooltip(name, {

            direction: "top",

            offset: [0, -8]

        });


        /* YELLOW MARKER HOVER */

        marker.on("mouseover", () => {

            styleMarker(name, true);

            marker.openTooltip();

        });

        marker.on("mouseout", () => {

            styleMarker(name);

        });


        /* SELECT MARKER */

        marker.on("click", () => {

            chooseDestination(name);

        });

        markers.set(name, marker);

    });

});