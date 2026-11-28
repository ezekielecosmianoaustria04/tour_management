document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);


    /* ==========================================
       INTERNATIONAL TOUR PACKAGE ELEMENTS
    ========================================== */

    const filters = [
        ...document.querySelectorAll(".country-filter")
    ];

    const sections = [
        ...document.querySelectorAll("[data-country-section]")
    ];

    const cards = [
        ...document.querySelectorAll("#international .package-card")
    ];

    const noResults = $("noPackageResults");

    const resetButton = $("resetPackages");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ==========================================
       NORMALIZE SEARCH TEXT
    ========================================== */

    function normalize(value) {

        return String(value || "")

            .toLowerCase()

            .trim()

            .replace(/[\s-]+/g, "");

    }


    /* ==========================================
       SMOOTH SCROLL
    ========================================== */

    function scrollToElement(element) {

        element?.scrollIntoView({

            behavior: reducedMotion ? "auto" : "smooth",

            block: "start"

        });

    }


    /* ==========================================
       ENTRANCE ANIMATION
    ========================================== */

    function animateElement(element) {

        if (!element || reducedMotion) return;

        element.classList.remove("reveal");

        void element.offsetWidth;

        element.classList.add("reveal");

    }


    /* ==========================================
       FILTER COUNTRY PACKAGES
    ========================================== */

    function filterCountry(country = "all") {

        filters.forEach(button => {

            const active =
                button.dataset.country === country;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );

        });


        /* RESET PACKAGE CARDS */

        cards.forEach(card => {

            card.hidden = false;

        });


        /* SHOW SELECTED COUNTRY */

        sections.forEach(section => {

            const visible =

                country === "all" ||

                section.dataset.countrySection === country;

            section.hidden = !visible;

            if (visible) {

                animateElement(section);

            }

        });


        /* HIDE NO RESULTS MESSAGE */

        if (noResults) {

            noResults.hidden = true;

        }

    }


    /* ==========================================
       COUNTRY FILTER BUTTON EVENTS
    ========================================== */

    filters.forEach(button => {

        button.addEventListener("click", () => {

            filterCountry(button.dataset.country);

        });

    });


    /* ==========================================
       SEARCH INTERNATIONAL PACKAGES
    ========================================== */

    function searchPackages(query) {

        const keyword = normalize(query);


        /* EMPTY SEARCH */

        if (!keyword) {

            filterCountry("all");

            return;

        }


        /* SEARCH COUNTRY NAME */

        const matchedCountry = sections.find(section =>

            normalize(section.dataset.countrySection)
                === keyword

        );


        if (matchedCountry) {

            filterCountry(
                matchedCountry.dataset.countrySection
            );

            scrollToElement(matchedCountry);

            return;

        }


        /* REMOVE ACTIVE FILTER BUTTON */

        filters.forEach(button => {

            button.classList.remove("active");

            button.setAttribute(
                "aria-pressed",
                "false"
            );

        });


        let totalMatches = 0;


        /* SEARCH PACKAGE DETAILS */

        sections.forEach(section => {

            let sectionMatches = 0;

            const country =
                section.dataset.countrySection;

            const sectionCards =
                section.querySelectorAll(".package-card");


            sectionCards.forEach(card => {

                const searchableText = normalize(

                    country + " " + card.textContent

                );

                const match =
                    searchableText.includes(keyword);

                card.hidden = !match;

                if (match) {

                    sectionMatches++;

                    totalMatches++;

                }

            });


            section.hidden = sectionMatches === 0;

            if (sectionMatches > 0) {

                animateElement(section);

            }

        });


        /* DISPLAY NO RESULTS */

        if (noResults) {

            noResults.hidden = totalMatches !== 0;

        }


        /* SCROLL TO SEARCH RESULTS */

        scrollToElement(
            $("internationalPackages")
        );

    }


    /* ==========================================
       RESET PACKAGE SEARCH
    ========================================== */

    resetButton?.addEventListener("click", () => {

        filterCountry("all");

        const input = $("home-location-search");

        if (input) {

            input.value = "";

        }

    });


    /* ==========================================
       HEADER ELEMENTS
    ========================================== */

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


    /* ==========================================
       HEADER SEARCH DESTINATIONS
    ========================================== */

    const searchableDestinations = [

        {
            name: "Vietnam",
            type: "country"
        },

        {
            name: "Japan",
            type: "country"
        },

        {
            name: "Puerto Princesa",
            type: "local"
        },

        {
            name: "El Nido",
            type: "local"
        },

        {
            name: "Coron",
            type: "local"
        },

        {
            name: "Palawan",
            type: "local"
        },

        {
            name: "Port Barton",
            type: "local"
        },

        {
            name: "Baguio",
            type: "local"
        },

        {
            name: "Zambales",
            type: "local"
        },

        {
            name: "Cebu",
            type: "local"
        },

        {
            name: "Bohol",
            type: "local"
        },

        {
            name: "Boracay",
            type: "local"
        },

        {
            name: "Davao",
            type: "local"
        },

        {
            name: "Siargao",
            type: "local"
        }

    ];


    /* ==========================================
       GET TOUR PACKAGE NAMES
    ========================================== */

    cards.forEach(card => {

        const heading =
            card.querySelector("h3");

        if (heading) {

            searchableDestinations.push({

                name: heading.textContent.trim(),

                type: "package"

            });

        }

    });


    /* ==========================================
       OPEN AND CLOSE HEADER SEARCH
    ========================================== */

    function setSearch(open) {

        if (!searchForm || !searchToggle) return;

        searchForm.hidden = !open;

        searchToggle.setAttribute(

            "aria-expanded",

            String(open)

        );

        searchToggle.setAttribute(

            "aria-label",

            open ? "Close search" : "Search destinations"

        );


        const icon =
            searchToggle.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-search";

        }


        if (open) {

            setMenu(false);

            searchInput?.focus();

            renderSearchResults();

        } else {

            if (searchResults) {

                searchResults.style.display = "none";

            }

        }

    }


    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

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


        const icon =
            mobileMenu.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-list";

        }


        if (open) {

            setSearch(false);

        }

    }


    /* ==========================================
       OPEN SEARCH RESULT
    ========================================== */

    function openSearchResult(result) {

        setSearch(false);


        /* LOCAL DESTINATIONS */

        if (result.type === "local") {

            window.location.href =
                "local-destinations.html";

            return;

        }


        /* INTERNATIONAL DESTINATIONS */

        searchPackages(result.name);

    }


    /* ==========================================
       LIVE HEADER SEARCH
    ========================================== */

    function renderSearchResults() {

        if (!searchInput || !searchResults) return;

        const query =
            normalize(searchInput.value);

        searchResults.replaceChildren();

        searchResults.style.display =

            query ? "flex" : "none";


        if (!query) return;


        const matches =
            searchableDestinations.filter(item =>

                normalize(item.name).includes(query)

            );


        /* NO MATCHING DESTINATIONS */

        if (!matches.length) {

            const message =
                document.createElement("p");

            message.textContent =
                "No matching destinations.";

            message.style.padding = "12px";

            searchResults.append(message);

            return;

        }


        /* CREATE SEARCH RESULT LINKS */

        matches.forEach(item => {

            const link =
                document.createElement("a");

            link.href = item.type === "local"

                ? "local-destinations.html"

                : "#internationalPackages";

            link.textContent = item.name;

            link.addEventListener("click", event => {

                event.preventDefault();

                openSearchResult(item);

            });

            searchResults.append(link);

        });

    }


    /* ==========================================
       HEADER SEARCH BUTTON
    ========================================== */

    searchToggle?.addEventListener("click", () => {

        if (!searchForm) return;

        setSearch(searchForm.hidden);

    });


    /* ==========================================
       LIVE SEARCH INPUT
    ========================================== */

    searchInput?.addEventListener(

        "input",

        renderSearchResults

    );


    /* ==========================================
       SEARCH FORM SUBMISSION
    ========================================== */

    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const query =
            searchInput?.value.trim() || "";

        if (!query) return;


        const localMatch =
            searchableDestinations.find(item =>

                item.type === "local" &&

                normalize(item.name) === normalize(query)

            );


        if (localMatch) {

            openSearchResult(localMatch);

            return;

        }


        searchPackages(query);

        setSearch(false);

    });


    /* ==========================================
       MOBILE MENU BUTTON
    ========================================== */

    mobileMenu?.addEventListener("click", () => {

        if (!navigation) return;

        setMenu(

            !navigation.classList.contains("open")

        );

    });


    /* ==========================================
       CLOSE MENU AFTER CLICKING NAVIGATION
    ========================================== */

    navigation?.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            setMenu(false);

        });

    });


    /* ==========================================
       CLOSE SEARCH WHEN CLICKING OUTSIDE
    ========================================== */

    document.addEventListener("click", event => {

        if (

            !event.target.closest(
                ".header-search-wrapper"
            )

        ) {

            setSearch(false);

        }


        if (header && !header.contains(event.target)) {

            setMenu(false);

        }

    });


    /* ==========================================
       ESCAPE KEY FUNCTION
    ========================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setSearch(false);

            setMenu(false);

        }

    });


    /* ==========================================
       ACTIVE NAVIGATION LINK
    ========================================== */

    function updateActiveNavigation() {

        const currentPage =

            window.location.pathname.split("/").pop()

            || "index.html";


        navigation?.querySelectorAll("a").forEach(link => {

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

                link.removeAttribute("aria-current");

            }

        });

    }


    /* ==========================================
       CUSTOMER ACCOUNT
    ========================================== */

    function updateCustomerAccount() {

        const account =
            $("customerAccountButton");

        if (!account) return;


        try {

            const loggedIn = JSON.parse(

                localStorage.getItem(

                    "ppowCustomerLoggedIn_v1"

                ) || "false"

            );


            const profile = JSON.parse(

                localStorage.getItem(

                    "ppowCustomerProfile_v1"

                ) || "null"

            );


            if (loggedIn === true) {

                account.href =
                    "customer-account.html";

                account.title =

                    profile?.fullName ||

                    profile?.name ||

                    "Customer Account";

            } else {

                account.href = "login.html";

                account.title = "Login or Sign Up";

            }

        } catch (error) {

            console.error(

                "Customer account error:",

                error

            );

            account.href = "login.html";

        }

    }


    /* ==========================================
       SCROLL REVEAL ANIMATION
    ========================================== */

    function initializeScrollReveal() {

        if (

            reducedMotion ||

            !("IntersectionObserver" in window)

        ) {

            return;

        }


        const revealElements =
            document.querySelectorAll(

                "#international .country-banner, " +

                "#international .section-heading, " +

                "#international .package-card, " +

                "#international .package-notice"

            );


        const observer = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(

                            "visible"

                        );

                        observer.unobserve(entry.target);

                    }

                });

            },

            {

                threshold: 0.08

            }

        );


        revealElements.forEach(element => {

            element.classList.add("scroll-reveal");

            observer.observe(element);

        });

    }


    /* ==========================================
       EXPLORE TOUR PACKAGES BUTTON
    ========================================== */

    const exploreButton =
        document.querySelector("#international .hero-button");


    exploreButton?.addEventListener("click", event => {

        const target =
            $("internationalPackages");

        if (!target) return;

        event.preventDefault();

        scrollToElement(target);

    });


    /* ==========================================
       CHECK IMAGE FILES
    ========================================== */

    function initializeImageFallback() {

        const images =
            document.querySelectorAll("#international img");


        images.forEach(img => {

            function handleError() {

                console.warn(

                    "Image not found:",

                    img.getAttribute("src")

                );

                img.classList.add("image-missing");

                img.closest(".package-image")

                    ?.classList.add("missing-picture");

            }


            img.addEventListener(

                "error",

                handleError,

                { once: true }

            );


            if (img.complete && img.naturalWidth === 0) {

                handleError();

            }

        });

    }


    /* ==========================================
       INITIALIZE PAGE
    ========================================== */

    filterCountry("all");

    updateActiveNavigation();

    updateCustomerAccount();

    initializeScrollReveal();

    initializeImageFallback();


    /* ==========================================
       UPDATE CUSTOMER ACCOUNT
    ========================================== */

    window.addEventListener(

        "pageshow",

        updateCustomerAccount

    );


    window.addEventListener(

        "storage",

        updateCustomerAccount

    );

});