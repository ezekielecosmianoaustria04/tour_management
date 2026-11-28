"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       HELPER FUNCTIONS
    ====================================== */

    const $ = id => document.getElementById(id);

    const normalize = value =>

        String(value || "")

            .toLowerCase()

            .trim()

            .replace(/[\s-]+/g, "");


    /* ======================================
       HEADER ELEMENTS
    ====================================== */

    const searchToggle = $("headerSearchToggle");

    const searchForm = $("headerSearchForm");

    const searchInput = $("home-location-search");

    const searchResults = $("home-search-results");

    const noSearchResults = $("noSearchResults");

    const mobileMenu = $("mobileMenuToggle");

    const navigation = $("mainNavigation");


    /* ======================================
       SEARCH DESTINATIONS

       DESTINATION DATA IS NOW IN HTML
    ====================================== */

    function filterDestinations() {

        if (!searchInput || !searchResults) return [];

        const query = normalize(searchInput.value);

        const links = [

            ...searchResults.querySelectorAll("a")

        ];

        const matches = [];

        links.forEach(link => {

            const name = normalize(link.textContent);

            const matched =

                query.length > 0 &&

                name.includes(query);

            link.hidden = !matched;

            if (matched) {

                matches.push(link);

            }

        });

        searchResults.style.display =

            query ? "flex" : "none";

        if (noSearchResults) {

            noSearchResults.hidden =

                !query || matches.length > 0;

        }

        return matches;

    }


    /* ======================================
       EXPANDABLE SEARCH BUTTON
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

        const icon = searchToggle.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-search";

        }

        if (open) {

            setMobileMenu(false);

            searchInput?.focus();

            filterDestinations();

        } else {

            if (searchResults) {

                searchResults.style.display = "none";

            }

        }

    }


    /* ======================================
       MOBILE NAVIGATION
    ====================================== */

    function setMobileMenu(open) {

        if (!navigation || !mobileMenu) return;

        navigation.classList.toggle("open", open);

        mobileMenu.setAttribute(

            "aria-expanded",

            String(open)

        );

        mobileMenu.setAttribute(

            "aria-label",

            open ? "Close navigation" : "Open navigation"

        );

        const icon = mobileMenu.querySelector("i");

        if (icon) {

            icon.className = open

                ? "bi bi-x-lg"

                : "bi bi-list";

        }

        if (open) {

            setSearch(false);

        }

    }


    /* ======================================
       OPEN SEARCH
    ====================================== */

    searchToggle?.addEventListener("click", () => {

        if (searchForm) {

            setSearch(searchForm.hidden);

        }

    });


    /* ======================================
       LIVE SEARCH
    ====================================== */

    searchInput?.addEventListener(

        "input",

        filterDestinations

    );


    /* ======================================
       SUBMIT SEARCH
    ====================================== */

    searchForm?.addEventListener("submit", event => {

        event.preventDefault();

        const matches = filterDestinations();

        if (matches.length > 0) {

            window.location.href = matches[0].href;

        }

    });


    /* ======================================
       OPEN MOBILE MENU
    ====================================== */

    mobileMenu?.addEventListener("click", () => {

        if (!navigation) return;

        setMobileMenu(

            !navigation.classList.contains("open")

        );

    });


    /* ======================================
       CLOSE MENU AFTER SELECTING A LINK
    ====================================== */

    navigation?.querySelectorAll("a")

        .forEach(link => {

            link.addEventListener("click", () => {

                setMobileMenu(false);

            });

        });


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

        if (

            !event.target.closest(".ppow-header")

        ) {

            setMobileMenu(false);

        }

    });


    /* ======================================
       ESCAPE KEY
    ====================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            setSearch(false);

            setMobileMenu(false);

        }

    });


    /* ======================================
       CUSTOMER ACCOUNT
    ====================================== */

    function updateCustomerAccount() {

        const account = $("customerAccountButton");

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

                account.href = "customer-account.html";

                account.title =

                    profile?.fullName ||

                    profile?.name ||

                    "Customer Account";

            } else {

                account.href = "login.html";

                account.title = "Login or Sign Up";

            }

        } catch (error) {

            account.href = "login.html";

            console.error("Account error:", error);

        }

    }

    updateCustomerAccount();

    window.addEventListener(

        "pageshow",

        updateCustomerAccount

    );

    window.addEventListener("storage", event => {

        if (

            event.key === "ppowCustomerLoggedIn_v1" ||

            event.key === "ppowCustomerProfile_v1" ||

            event.key === null

        ) {

            updateCustomerAccount();

        }

    });


    /* ======================================
       PALAWAN DESTINATION SLIDER

       ALL CARDS ARE NOW IN HTML
    ====================================== */

    const travelCards = $("travelCards");

    const travelCounter = $("travelCounter");

    const travelPrev = $("travelPrev");

    const travelNext = $("travelNext");

    const destinationCards = travelCards

        ? [...travelCards.querySelectorAll(".travel-card")]

        : [];

    let travelStart = 0;


    /* ======================================
       RESPONSIVE VISIBLE CARD COUNT
    ====================================== */

    function getVisibleCount() {

        return window.innerWidth <= 768 ? 2 : 3;

    }


    /* ======================================
       DISPLAY DESTINATION CARDS
    ====================================== */

    function renderTravelCards(animate = true) {

        if (!travelCards || !destinationCards.length) {

            return;

        }

        const visibleCount = Math.min(

            getVisibleCount(),

            destinationCards.length

        );

        destinationCards.forEach(card => {

            card.hidden = true;

            card.classList.remove("slide-enter");

        });

        for (let i = 0; i < visibleCount; i++) {

            const index =

                (travelStart + i) %

                destinationCards.length;

            const card = destinationCards[index];

            card.hidden = false;

            card.style.order = i;

            if (animate) {

                card.style.animationDelay = `${i * 65}ms`;

                card.classList.add("slide-enter");

            }

        }

        if (travelCounter) {

            travelCounter.textContent =

                String(travelStart + 1).padStart(2, "0") +

                " / " +

                String(destinationCards.length).padStart(2, "0");

        }

        const disableControls =

            destinationCards.length <= visibleCount;

        if (travelPrev) {

            travelPrev.disabled = disableControls;

        }

        if (travelNext) {

            travelNext.disabled = disableControls;

        }

    }


    /* ======================================
       PREVIOUS DESTINATION
    ====================================== */

    travelPrev?.addEventListener("click", () => {

        if (!destinationCards.length) return;

        travelStart =

            (

                travelStart - 1 +

                destinationCards.length

            ) % destinationCards.length;

        renderTravelCards();

    });


    /* ======================================
       NEXT DESTINATION
    ====================================== */

    travelNext?.addEventListener("click", () => {

        if (!destinationCards.length) return;

        travelStart =

            (travelStart + 1) %

            destinationCards.length;

        renderTravelCards();

    });


    /* ======================================
       RESPONSIVE SLIDER
    ====================================== */

    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            renderTravelCards(false);

            if (window.innerWidth > 1150) {

                setMobileMenu(false);

            }

        }, 150);

    });


    /* ======================================
       TOUCH SWIPE FOR MOBILE
    ====================================== */

    let touchStartX = 0;

    let touchStartY = 0;

    travelCards?.addEventListener(

        "touchstart",

        event => {

            touchStartX = event.changedTouches[0].screenX;

            touchStartY = event.changedTouches[0].screenY;

        },

        { passive: true }

    );

    travelCards?.addEventListener(

        "touchend",

        event => {

            const touchEndX =

                event.changedTouches[0].screenX;

            const touchEndY =

                event.changedTouches[0].screenY;

            const distanceX = touchStartX - touchEndX;

            const distanceY = touchStartY - touchEndY;

            if (

                Math.abs(distanceX) < 50 ||

                Math.abs(distanceX) <= Math.abs(distanceY)

            ) return;

            if (distanceX > 0) {

                travelNext?.click();

            } else {

                travelPrev?.click();

            }

        },

        { passive: true }

    );


    /* ======================================
       SCROLL REVEAL ANIMATION
    ====================================== */

    const revealElements =

        document.querySelectorAll(".reveal");

    const reducedMotion = window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;

    if (

        "IntersectionObserver" in window &&

        !reducedMotion

    ) {

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

            element.classList.add("reveal-ready");

            observer.observe(element);

        });

    }


    /* ======================================
       INITIALIZE DESTINATION SLIDER
    ====================================== */

    renderTravelCards(false);

    console.log(

        "Customized Trip Planner initialized successfully."

    );

});







/* ==========================================
   SCROLL REVEAL ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const revealObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.1
        }

    );

    revealElements.forEach((element) => {

        element.classList.add("reveal-ready");

        revealObserver.observe(element);

    });

});