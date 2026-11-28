document.addEventListener("DOMContentLoaded", () => {

    const $ = id => document.getElementById(id);


    /* ==========================================
       HEADER ELEMENTS
    ========================================== */

    const header =
        document.querySelector(".ppow-header");

    const searchToggle =
        $("headerSearchToggle");

    const searchForm =
        $("headerSearchForm");

    const searchInput =
        $("home-location-search");

    const searchResults =
        $("home-search-results");

    const navigation =
        $("mainNavigation");

    const mobileMenu =
        $("mobileMenuToggle");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* ==========================================
       SEARCHABLE DESTINATIONS
    ========================================== */

    const destinations = [

        {
            name: "Puerto Princesa",
            page: "local-destinations.html"
        },

        {
            name: "El Nido",
            page: "local-destinations.html"
        },

        {
            name: "Coron",
            page: "local-destinations.html"
        },

        {
            name: "Palawan",
            page: "local-destinations.html"
        },

        {
            name: "Port Barton",
            page: "local-destinations.html"
        },

        {
            name: "Balabac",
            page: "local-destinations.html"
        },

        {
            name: "Baguio",
            page: "local-destinations.html"
        },

        {
            name: "Zambales",
            page: "local-destinations.html"
        },

        {
            name: "Ilocos",
            page: "local-destinations.html"
        },

        {
            name: "Cebu",
            page: "local-destinations.html"
        },

        {
            name: "Bohol",
            page: "local-destinations.html"
        },

        {
            name: "Boracay",
            page: "local-destinations.html"
        },

        {
            name: "Davao",
            page: "local-destinations.html"
        },

        {
            name: "Siargao",
            page: "local-destinations.html"
        },

        {
            name: "Vietnam",
            page: "beyond-philippines.html"
        },

        {
            name: "Japan",
            page: "beyond-philippines.html"
        }

    ];


    /* ==========================================
       NORMALIZE SEARCH TEXT
    ========================================== */

    function normalize(value) {

        return String(value || "")

            .trim()

            .toLowerCase()

            .replace(/[\s-]+/g, "");

    }


    /* ==========================================
       OPEN AND CLOSE SEARCH BAR
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

        } else if (searchResults) {

            searchResults.style.display = "none";

        }

    }


    /* ==========================================
       MOBILE MENU
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
       LIVE SEARCH RESULTS
    ========================================== */

    function renderSearchResults() {

        if (!searchInput || !searchResults) return;

        const query =
            normalize(searchInput.value);

        searchResults.replaceChildren();

        searchResults.style.display =

            query ? "flex" : "none";

        if (!query) return;

        const matches = destinations.filter(destination =>

            normalize(destination.name).includes(query)

        );

        if (!matches.length) {

            const message =
                document.createElement("p");

            message.textContent =
                "No matching destinations.";

            message.style.padding = "12px";

            searchResults.append(message);

            return;

        }

        matches.forEach(destination => {

            const link =
                document.createElement("a");

            link.href = destination.page;

            link.textContent = destination.name;

            searchResults.append(link);

        });

    }


    /* ==========================================
       SEARCH BUTTON
    ========================================== */

    searchToggle?.addEventListener("click", () => {

        if (!searchForm) return;

        setSearch(searchForm.hidden);

    });


    /* ==========================================
       SEARCH INPUT
    ========================================== */

    searchInput?.addEventListener(
        "input",
        renderSearchResults
    );


    /* ==========================================
       SEARCH SUBMISSION
    ========================================== */

    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const query =
            normalize(searchInput?.value);

        if (!query) return;

        const exact = destinations.find(destination =>

            normalize(destination.name) === query

        );

        const matches = destinations.filter(destination =>

            normalize(destination.name).includes(query)

        );

        if (exact) {

            window.location.href = exact.page;

        } else if (matches.length === 1) {

            window.location.href = matches[0].page;

        } else {

            renderSearchResults();

        }

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
       CLOSE MENU AFTER NAVIGATION
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

        if (!event.target.closest(".header-search-wrapper")) {

            setSearch(false);

        }

        if (header && !header.contains(event.target)) {

            setMenu(false);

        }

    });


    /* ==========================================
       ESCAPE KEY
    ========================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setSearch(false);

            setMenu(false);

        }

    });


    /* ==========================================
       ACTIVE NAVIGATION
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
       SMOOTH SCROLL TO INQUIRY FORM
    ========================================== */

    const inquiryButton =
        document.querySelector("#contact-page .hero-btn");

    inquiryButton?.addEventListener("click", event => {

        const inquirySection =
            $("inquiry");

        if (!inquirySection) return;

        event.preventDefault();

        inquirySection.scrollIntoView({

            behavior: reducedMotion ? "auto" : "smooth",

            block: "start"

        });

    });


    /* ==========================================
       PREVENT PAST TRAVEL DATES
    ========================================== */

    function initializeTravelDate() {

        const travelDate =
            $("travelDate");

        if (!travelDate) return;

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1).padStart(2, "0");

        const day =
            String(today.getDate()).padStart(2, "0");

        travelDate.min = `${year}-${month}-${day}`;

    }


    /* ==========================================
       INQUIRY FORM
    ========================================== */

    const inquiryForm =
        $("inquiryForm");

    const inquiryStatus =
        $("inquiryStatus");

    inquiryForm?.addEventListener("submit", event => {

        event.preventDefault();

        if (!inquiryForm.checkValidity()) {

            inquiryForm.reportValidity();

            return;

        }

        if (inquiryStatus) {

            inquiryStatus.hidden = false;

            inquiryStatus.textContent =

                "Your inquiry form is valid. " +

                "Online submission is not connected yet.";

        }

    });


    /* ==========================================
       CLEAR STATUS WHEN FORM IS EDITED
    ========================================== */

    inquiryForm?.addEventListener("input", () => {

        if (inquiryStatus) {

            inquiryStatus.hidden = true;

            inquiryStatus.textContent = "";

        }

    });


    /* ==========================================
       BACKGROUND IMAGE FALLBACK
    ========================================== */

    const heroImage = document.querySelector(

        ".contact-hero-background"

    );

    function handleImageError() {

        if (!heroImage) return;

        heroImage.style.display = "none";

        console.warn(

            "Contact background image not found:",

            heroImage.getAttribute("src")

        );

    }

    if (heroImage) {

        heroImage.addEventListener(

            "error",

            handleImageError,

            { once: true }

        );

        if (heroImage.complete && heroImage.naturalWidth === 0) {

            handleImageError();

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

        const elements = document.querySelectorAll(

            "#contact-page .section-heading, " +

            "#contact-page .contact-card, " +

            "#contact-page .inquiry-panel"

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

        elements.forEach(element => {

            element.classList.add("scroll-reveal");

            observer.observe(element);

        });

    }


    /* ==========================================
       INITIALIZE CONTACT PAGE
    ========================================== */

    updateActiveNavigation();

    updateCustomerAccount();

    initializeTravelDate();

    initializeScrollReveal();


    /* ==========================================
       UPDATE CUSTOMER ACCOUNT STATUS
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