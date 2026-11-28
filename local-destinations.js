document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);


    /* ==========================================
       PHILIPPINES MAP - ISLAND GROUP BOUNDS
    ========================================== */

    const bounds = {

        Luzon: [
            [8, 116.8],
            [21.5, 123.5]
        ],

        Visayas: [
            [9, 121],
            [12.8, 126]
        ],

        Mindanao: [
            [4.8, 122],
            [9.6, 127]
        ]

    };


    /* ==========================================
       HTML ELEMENTS
    ========================================== */

    const choices = [
        ...document.querySelectorAll(".island-choice")
    ];

    const groups = [
        ...document.querySelectorAll(".region-group")
    ];

    const places = [
        ...document.querySelectorAll(".place-card")
    ];

    const title = $("selectedIslandTitle");

    const hint = $("selectionHint");

    const mapLabel = $("mapSelection");

    const palawanPackages = $("palawan-packages");

    let map = null;

    let marker = null;


    /* ==========================================
       PALAWAN PRE-PACKAGED TOURS VISIBILITY
    ========================================== */

    function showPalawanPackages(show = false) {

        if (palawanPackages) {

            palawanPackages.hidden = !show;

        }

    }


    /* HIDE PACKAGES WHEN PAGE FIRST LOADS */

    showPalawanPackages(false);


    /* ==========================================
       INITIALIZE INTERACTIVE SATELLITE MAP
    ========================================== */

    if (typeof L !== "undefined") {

        map = L.map("philippinesMap", {

            scrollWheelZoom: false

        }).setView([12.5, 122.3], 6);


        /* ESRI WORLD IMAGERY */

        L.tileLayer(

            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

            {

                maxZoom: 18,

                attribution:
                    "Imagery © Esri and its data providers"

            }

        ).addTo(map).on("tileerror", () => {

            mapLabel.textContent =
                "Map imagery could not load. Destination selection still works.";

        });

    } else {

        $("philippinesMap").textContent =
            "Map unavailable. Check your internet connection.";

    }


    /* ==========================================
       SELECT ISLAND GROUP
       LUZON / VISAYAS / MINDANAO
    ========================================== */

    function selectIsland(island) {


        /* HIDE PALAWAN PACKAGES */

        showPalawanPackages(false);


        /* UPDATE ISLAND BUTTONS */

        choices.forEach(button => {

            const active =
                button.dataset.island === island;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        });


        /* SHOW SELECTED REGIONS */

        groups.forEach(group => {

            group.hidden =
                group.dataset.island !== island;

            const grid =
                group.querySelector(".place-grid");

            const toggle =
                group.querySelector(".region-toggle");

            grid.hidden = true;

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });


        /* REMOVE PREVIOUS SELECTED PLACE */

        places.forEach(place => {

            place.classList.remove("active");

        });


        /* UPDATE TEXT */

        title.textContent =
            island + " Regions";

        hint.textContent =
            "Choose a region below to view provinces and cities.";

        mapLabel.textContent =
            "Showing " + island +
            ". Select a province or city to zoom in.";


        /* ZOOM MAP TO SELECTED ISLAND */

        if (map) {

            if (marker) {

                map.removeLayer(marker);

                marker = null;

            }

            map.fitBounds(bounds[island], {

                padding: [20, 20]

            });

            setTimeout(() => {

                map.invalidateSize();

            }, 100);

        }

    }


    /* ==========================================
       ISLAND BUTTON CLICK EVENTS
    ========================================== */

    choices.forEach(button => {

        button.addEventListener("click", () => {

            selectIsland(button.dataset.island);

        });

    });


    /* ==========================================
       REGION DROPDOWN FUNCTION
    ========================================== */

    groups.forEach(group => {

        const toggle =
            group.querySelector(".region-toggle");

        const grid =
            group.querySelector(".place-grid");


        toggle.addEventListener("click", () => {


            /* HIDE PALAWAN PACKAGES */

            showPalawanPackages(false);


            /* REMOVE ACTIVE PROVINCE */

            places.forEach(place => {

                place.classList.remove("active");

            });


            const opening = grid.hidden;


            /* CLOSE OTHER OPEN REGIONS */

            groups

                .filter(item => !item.hidden)

                .forEach(item => {

                    item.querySelector(".place-grid")
                        .hidden = true;

                    item.querySelector(".region-toggle")
                        .setAttribute(
                            "aria-expanded",
                            "false"
                        );

                });


            /* OPEN OR CLOSE SELECTED REGION */

            grid.hidden = !opening;

            toggle.setAttribute(

                "aria-expanded",

                String(opening)

            );


            /* UPDATE REGION INFORMATION */

            if (opening) {

                hint.textContent =
                    "Select a province or city in " +
                    group.dataset.region + ".";

                mapLabel.textContent =
                    group.dataset.region;

            }

        });

    });


    /* ==========================================
       SELECT PROVINCE OR CITY
    ========================================== */

    places.forEach(button => {

        button.addEventListener("click", () => {


            /* REMOVE PREVIOUS ACTIVE PLACE */

            places.forEach(place => {

                place.classList.remove("active");

            });

            button.classList.add("active");


            /* GET LOCATION DATA FROM HTML */

            const name = button.dataset.place;

            const lat = Number(button.dataset.lat);

            const lng = Number(button.dataset.lng);


            /* ======================================
               SHOW PALAWAN PRE-PACKAGED TOURS

               LUZON > MIMAROPA > PALAWAN
            ====================================== */

            const selectedRegion =
                button.closest(".region-group");


            const isPalawan =

                name === "Palawan" &&

                selectedRegion?.dataset.island === "Luzon" &&

                selectedRegion?.dataset.region.includes("MIMAROPA") &&

                !selectedRegion.hidden &&

                !selectedRegion.querySelector(".place-grid").hidden;


            showPalawanPackages(isPalawan);


            /* ======================================
               UPDATE SELECTED LOCATION
            ====================================== */

            mapLabel.textContent =
                "Selected: " + name +
                " (approximate location)";


            /* ======================================
               UPDATE MAP MARKER
            ====================================== */

            if (

                map &&

                Number.isFinite(lat) &&

                Number.isFinite(lng)

            ) {

                if (marker) {

                    map.removeLayer(marker);

                }


                /* CREATE MAP POPUP */

                const popup =
                    document.createElement("strong");

                popup.textContent = name;


                /* ADD LOCATION MARKER */

                marker = L.marker([lat, lng])

                    .addTo(map)

                    .bindPopup(popup);


                /* SMOOTH MAP ZOOM */

                map.flyTo(

                    [lat, lng],

                    9,

                    {

                        duration: 1.1

                    }

                );

                marker.openPopup();

            }


            /* SCROLL TO MAP */

            document.querySelector(".map-panel")

                .scrollIntoView({

                    behavior: "smooth",

                    block: "nearest"

                });

        });

    });


    /* ==========================================
       OPEN SELECTED DESTINATION
    ========================================== */

    function openDestination(name) {

        const place = places.find(place =>

            place.dataset.place === name

        );

        const region = groups.find(group =>

            group.dataset.region === name

        );


        /* OPEN REGION OR PROVINCE */

        if (place || region) {

            const group =

                region || place.closest(".region-group");


            selectIsland(group.dataset.island);


            group.querySelector(".region-toggle")
                .click();


            if (place) {

                place.click();

            } else {

                group.scrollIntoView({

                    behavior: "smooth",

                    block: "center"

                });

            }


            /* CLOSE HEADER SEARCH */

            $("headerSearchForm").hidden = true;

            $("headerSearchToggle").setAttribute(

                "aria-expanded",

                "false"

            );

            $("headerSearchToggle")

                .querySelector("i")

                .className = "bi bi-search";

            return;

        }


        /* ======================================
           PALAWAN TOUR PACKAGES
        ====================================== */

        if ([

            "Puerto Princesa",

            "El Nido",

            "Coron",

            "Port Barton"

        ].includes(name)) {

            location.href =

                "tripplanner.html?view=tour-only&destination=" +

                encodeURIComponent(name);

            return;

        }


        /* ======================================
           INTERNATIONAL DESTINATIONS
        ====================================== */

        if (["Japan", "Vietnam"].includes(name)) {

            location.href =
                "beyond-philippines.html";

            return;

        }


        /* DESTINATION NOT AVAILABLE */

        mapLabel.textContent =

            "No map entry for " + name +

            " in the current directory.";

    }


    /* ==========================================
       HEADER SEARCH DESTINATIONS
    ========================================== */

    const destinations = [

        /* PALAWAN */

        "Puerto Princesa",
        "El Nido",
        "Coron",
        "Port Barton",

        /* LUZON */

        "Baguio",
        "Benguet",
        "Ilocos",
        "Pangasinan",
        "Pampanga",
        "Zambales",
        "Olongapo",

        /* VISAYAS */

        "Cebu",
        "Bohol",
        "Boracay",
        "Iloilo",
        "Bacolod",
        "Siquijor",
        "Dumaguete",
        "Samar",
        "Leyte",

        /* MINDANAO */

        "Davao",
        "Cagayan de Oro",
        "Camiguin",
        "Siargao",
        "Bukidnon",
        "General Santos",

        /* INTERNATIONAL */

        "Japan",
        "Vietnam"

    ];


    /* ==========================================
       DESTINATION PAGE URL
    ========================================== */

    function destinationURL(destination) {

        if (["Japan", "Vietnam"].includes(destination)) {

            return "beyond-philippines.html";

        }

        return "local-destinations.html";

    }


    /* ==========================================
       NORMALIZE SEARCH
    ========================================== */

    function normalizeSearch(value) {

        return String(value || "")

            .toLowerCase()

            .trim()

            .replace(/[\s-]+/g, "");

    }


    /* ==========================================
       LIVE DESTINATION SEARCH
    ========================================== */

    function searchDestinations(openFirst = false) {

        const input = $("home-location-search");

        const results = $("home-search-results");

        if (!input || !results) return;


        /* GET SEARCH QUERY */

        const query = normalizeSearch(input.value);

        results.replaceChildren();

        results.style.display =

            query ? "flex" : "none";


        if (!query) return;


        /* COMBINE ALL SEARCH DESTINATIONS */

        const allDestinations = [

            ...new Set([

                ...places.map(

                    place => place.dataset.place

                ),

                ...groups.map(

                    group => group.dataset.region

                ),

                ...destinations

            ])

        ];


        /* FILTER SEARCH RESULTS */

        const matches = allDestinations.filter(

            destination =>

                normalizeSearch(destination)
                    .includes(query)

        );


        /* OPEN FIRST MATCH */

        if (openFirst && matches.length) {

            openDestination(matches[0]);

            return;

        }


        /* NO MATCHING DESTINATIONS */

        if (!matches.length) {

            const message =
                document.createElement("p");

            message.textContent =
                "No matching destinations.";

            message.style.padding = "14px";

            results.append(message);

            return;

        }


        /* DISPLAY SEARCH RESULTS */

        matches.forEach(destination => {

            const link =
                document.createElement("a");

            link.href =
                destinationURL(destination);

            link.textContent = destination;


            link.addEventListener("click", event => {

                event.preventDefault();

                openDestination(destination);

            });


            results.append(link);

        });

    }


    /* ==========================================
       HEADER INITIALIZATION
       SAME FUNCTIONALITY AS HOMEPAGE
    ========================================== */

    function initializeHeader() {

        const header =
            document.querySelector(".ppow-header");

        const searchForm =
            $("headerSearchForm");

        const searchToggle =
            $("headerSearchToggle");

        const searchInput =
            $("home-location-search");

        const searchResults =
            $("home-search-results");

        const mobileMenu =
            $("mobileMenuToggle");

        const navigation =
            $("mainNavigation");


        if (!header) return;


        /* ======================================
           OPEN OR CLOSE HEADER SEARCH
        ====================================== */

        function setSearch(open) {

            if (!searchForm || !searchToggle) return;


            searchForm.hidden = !open;


            searchToggle.setAttribute(

                "aria-expanded",

                String(open)

            );


            searchToggle.setAttribute(

                "aria-label",

                open ? "Close search" : "Open search"

            );


            /* CHANGE SEARCH ICON */

            const icon =
                searchToggle.querySelector("i");


            if (icon) {

                icon.className = open

                    ? "bi bi-x-lg"

                    : "bi bi-search";

            }


            /* OPEN SEARCH INPUT */

            if (open) {

                setMenu(false);


                if (searchInput) {

                    searchInput.focus();

                    searchDestinations();

                }

            } else {

                if (searchResults) {

                    searchResults.style.display =
                        "none";

                }

            }

        }


        /* ======================================
           MOBILE NAVIGATION
        ====================================== */

        function setMenu(open) {

            if (!navigation || !mobileMenu) return;


            navigation.classList.toggle(

                "open",

                open

            );


            mobileMenu.setAttribute(

                "aria-expanded",

                String(open)

            );


            /* CHANGE MOBILE MENU ICON */

            const icon =
                mobileMenu.querySelector("i");


            if (icon) {

                icon.className = open

                    ? "bi bi-x-lg"

                    : "bi bi-list";

            }


            /* CLOSE SEARCH IF MENU IS OPEN */

            if (open) {

                setSearch(false);

            }

        }


        /* ======================================
           SEARCH BUTTON CLICK
        ====================================== */

        if (searchToggle && searchForm) {

            searchToggle.addEventListener(

                "click",

                () => {

                    setSearch(searchForm.hidden);

                }

            );

        }


        /* ======================================
           LIVE SEARCH INPUT
        ====================================== */

        if (searchInput) {

            searchInput.addEventListener(

                "input",

                () => {

                    searchDestinations();

                }

            );

        }


        /* ======================================
           SEARCH FORM SUBMISSION
        ====================================== */

        if (searchForm) {

            searchForm.addEventListener(

                "submit",

                event => {

                    event.preventDefault();

                    searchDestinations(true);

                }

            );

        }


        /* ======================================
           MOBILE MENU BUTTON
        ====================================== */

        if (mobileMenu && navigation) {

            mobileMenu.addEventListener(

                "click",

                () => {

                    setMenu(

                        !navigation.classList
                            .contains("open")

                    );

                }

            );


            /* CLOSE MENU AFTER CLICKING LINK */

            navigation.querySelectorAll("a")

                .forEach(link => {

                    link.addEventListener(

                        "click",

                        () => {

                            setMenu(false);

                        }

                    );

                });

        }


        /* ======================================
           CLOSE SEARCH WHEN CLICKING OUTSIDE
        ====================================== */

        document.addEventListener("click", event => {

            if (

                !event.target.closest(

                    ".header-search-wrapper"

                )

            ) {

                setSearch(false);

            }


            if (!header.contains(event.target)) {

                setMenu(false);

            }

        });


        /* ======================================
           ESCAPE KEY FUNCTION
        ====================================== */

        document.addEventListener(

            "keydown",

            event => {

                if (event.key === "Escape") {

                    setSearch(false);

                    setMenu(false);

                }

            }

        );


        /* ======================================
           ACTIVE NAVIGATION LINK
        ====================================== */

        const currentPage =

            window.location.pathname.split("/").pop()

            || "index.html";


        if (navigation) {

            navigation.querySelectorAll("a")

                .forEach(link => {

                    const linkPage = new URL(

                        link.href,

                        window.location.href

                    ).pathname.split("/").pop();


                    const active =
                        linkPage === currentPage;


                    link.classList.toggle(

                        "active",

                        active

                    );


                    if (active) {

                        link.setAttribute(

                            "aria-current",

                            "page"

                        );

                    } else {

                        link.removeAttribute(

                            "aria-current"

                        );

                    }

                });

        }

    }


    /* ==========================================
       CUSTOMER ACCOUNT FUNCTION
    ========================================== */

    function updateCustomerAccount() {

        const account =
            $("customerAccountButton");


        if (!account) return;


        try {


            /* CHECK CUSTOMER LOGIN STATUS */

            const loggedIn = JSON.parse(

                localStorage.getItem(

                    "ppowCustomerLoggedIn_v1"

                ) || "false"

            );


            /* GET CUSTOMER PROFILE */

            const profile = JSON.parse(

                localStorage.getItem(

                    "ppowCustomerProfile_v1"

                ) || "null"

            );


            /* CUSTOMER IS LOGGED IN */

            if (loggedIn === true) {

                account.href =
                    "customer-account.html";


                account.title =

                    profile?.fullName ||

                    profile?.name ||

                    "Customer Account";

            } else {


                /* CUSTOMER IS NOT LOGGED IN */

                account.href = "login.html";

                account.title = "Login or Sign Up";

            }

        } catch (error) {

            console.error(

                "Account error:",

                error

            );

            account.href = "login.html";

        }

    }


    /* ==========================================
       INITIALIZE ALL FUNCTIONS
    ========================================== */

    initializeHeader();

    updateCustomerAccount();


    /* UPDATE ACCOUNT WHEN RETURNING TO PAGE */

    window.addEventListener(

        "pageshow",

        updateCustomerAccount

    );


    /* UPDATE ACCOUNT WHEN STORAGE CHANGES */

    window.addEventListener(

        "storage",

        updateCustomerAccount

    );

});