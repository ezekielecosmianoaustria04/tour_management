(() => {
    "use strict";

    const $ = id => document.getElementById(id);

    const peso = value =>
        "₱" + Number(value).toLocaleString("en-PH");

    const escapeHTML = value =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

    /* ==========================================
       TOUR PACKAGE DATA
    ========================================== */

    const tours = [
        {
            destination: "Puerto Princesa",
            region: "Palawan",
            name: "Underground River Tour",
            price: 2500,
            days: 1,
            preferences: ["nature", "culture"],
            image: "underground-river.jpg",
            discount: 20
        },
        {
            destination: "Puerto Princesa",
            region: "Palawan",
            name: "Honda Bay Island Hopping",
            price: 1800,
            days: 1,
            preferences: ["beach", "relax"],
            image: "honda-bay.jpg",
            discount: 0
        },
        {
            destination: "El Nido",
            region: "Palawan",
            name: "El Nido Island Hopping Tour A",
            price: 1800,
            days: 1,
            preferences: ["nature", "beach", "relax"],
            image: "elnido-tour-a.jpg",
            discount: 30
        },
        {
            destination: "El Nido",
            region: "Palawan",
            name: "El Nido Island Hopping Tour B",
            price: 1800,
            days: 1,
            preferences: ["nature", "beach"],
            image: "elnido-tour-b.jpg",
            discount: 0
        },
        {
            destination: "Coron",
            region: "Palawan",
            name: "Coron Island Tour",
            price: 2200,
            days: 1,
            preferences: ["nature", "beach", "relax"],
            image: "coron-tour.jpg",
            discount: 15
        },
        {
            destination: "Port Barton",
            region: "Palawan",
            name: "Port Barton Island Hopping",
            price: 1800,
            days: 1,
            preferences: ["beach", "relax"],
            image: "portbarton-tour.jpg",
            discount: 0
        },
        {
            destination: "Japan",
            region: "International",
            name: "Tokyo & Mount Fuji Tour",
            price: 39999,
            days: 5,
            preferences: ["nature", "culture"],
            image: "japan.jpg",
            discount: 0
        },
        {
            destination: "Vietnam",
            region: "International",
            name: "Hanoi & Ha Long Bay Tour",
            price: 18999,
            days: 4,
            preferences: ["nature", "culture", "beach"],
            image: "vietnam.jpg",
            discount: 0
        }
    ];

    /* ==========================================
       CREATE TOUR CARDS
    ========================================== */

    function createTourCard(tour, pax = 1, promo = false) {

        const price = promo
            ? Math.round(
                tour.price * (1 - tour.discount / 100)
            )
            : tour.price;

        return `
            <article class="landing-glass destination-card">

                <div class="destination-photo">

                    <img
                        src="${escapeHTML(tour.image)}"
                        alt="${escapeHTML(tour.destination)}"
                        loading="lazy"
                        onerror="this.hidden=true"
                    >

                    ${promo ? `
                        <span class="discount-label">
                            ${tour.discount}% OFF · SAMPLE
                        </span>
                    ` : ""}

                </div>

                <div class="destination-copy">

                    <small>
                        ${escapeHTML(tour.destination)}
                        · ${tour.days} day(s)
                    </small>

                    <h3>
                        ${escapeHTML(tour.name)}
                    </h3>

                    <p>

                        ${promo ? `
                            <del>${peso(tour.price)}</del>
                        ` : ""}

                        <strong>${peso(price)}</strong>

                        / person

                    </p>

                    <p>
                        Estimated subtotal:
                        ${peso(price * pax)}
                        for ${pax} traveler(s)
                    </p>

                    <button
                        type="button"
                        class="home-btn"
                        data-tour="${escapeHTML(tour.name)}"
                        data-destination="${escapeHTML(tour.destination)}"
                        data-pax="${pax}"
                    >
                        Inquire Now
                    </button>

                </div>

            </article>
        `;
    }

    /* ==========================================
       RECOMMENDED POPULAR DESTINATIONS
    ========================================== */

    function renderPopularDestinations() {

        const container = $("popular-grid");

        if (!container) return;

        container.innerHTML = tours

            .filter(tour => tour.discount > 0)

            .sort((a, b) => b.discount - a.discount)

            .map(tour => createTourCard(tour, 1, true))

            .join("");
    }

    /* ==========================================
       TOUR PACKAGE GENERATOR
    ========================================== */

    function generatePackages(event) {

        event.preventDefault();

        const region = $("predict-region").value;

        const preference = $("predict-style").value;

        const days = Number($("predict-days").value);

        const pax = Number($("predict-pax").value);

        const results = $("prediction-results");

        if (
            !Number.isInteger(days) ||
            days < 1 ||
            days > 30 ||
            !Number.isInteger(pax) ||
            pax < 1 ||
            pax > 100
        ) {

            results.textContent =
                "Please enter valid travel details.";

            return;
        }

        const matches = tours.filter(tour => {

            const regionMatch =

                region === "any" ||

                tour.region === region ||

                (
                    region === "Luzon" &&
                    tour.region === "Palawan"
                );

            const preferenceMatch =
                tour.preferences.includes(preference);

            const durationMatch =
                tour.days <= days;

            return regionMatch &&
                   preferenceMatch &&
                   durationMatch;
        });

        if (!matches.length) {

            results.innerHTML = `

                <div class="review-empty">

                    <h3>No Matching Tour Packages</h3>

                    <p>
                        Try another region, travel preference,
                        or longer travel duration.

                        You may also inquire about
                        a customized trip.
                    </p>

                </div>
            `;

            return;
        }

        results.innerHTML = `

            <h2>Recommended Tour Packages</h2>

            <p>
                Suggested packages for ${days} travel day(s)
                and ${pax} traveler(s).
            </p>

            <div class="landing-grid">

                ${matches.map(
                    tour => createTourCard(tour, pax)
                ).join("")}

            </div>

            <p class="landing-note">

                Sample estimates cover the listed tour only.

                Flights, extra travel days, accommodation,
                and other expenses are not included
                unless confirmed.

            </p>
        `;
    }

    /* ==========================================
       DESTINATION SEARCH DATA
    ========================================== */

    const destinations = [

        "Puerto Princesa",
        "El Nido",
        "Coron",
        "Port Barton",

        "Baguio",
        "Benguet",
        "Ilocos",
        "Pangasinan",
        "Pampanga",
        "Zambales",
        "Olongapo",

        "Cebu",
        "Bohol",
        "Boracay",
        "Iloilo",
        "Bacolod",
        "Siquijor",
        "Dumaguete",
        "Samar",
        "Leyte",

        "Davao",
        "Cagayan de Oro",
        "Camiguin",
        "Siargao",
        "Bukidnon",
        "General Santos",

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

        const query = normalizeSearch(input.value);

        results.replaceChildren();

        results.style.display = query ? "flex" : "none";

        if (!query) return;

        const matches = destinations.filter(destination =>

            normalizeSearch(destination).includes(query)

        );

        if (openFirst && matches.length) {

            window.location.href =
                destinationURL(matches[0]);

            return;
        }

        if (!matches.length) {

            const message = document.createElement("p");

            message.textContent =
                "No matching destinations.";

            message.style.padding = "14px";

            results.append(message);

            return;
        }

        matches.forEach(destination => {

            const link = document.createElement("a");

            link.href = destinationURL(destination);

            link.textContent = destination;

            results.append(link);

        });
    }

    /* ==========================================
       EXPANDABLE HEADER SEARCH
    ========================================== */

    function initializeHeader() {

        const header = document.querySelector(".ppow-header");

        const searchForm = $("headerSearchForm");

        const searchToggle = $("headerSearchToggle");

        const searchInput = $("home-location-search");

        const searchResults = $("home-search-results");

        const mobileMenu = $("mobileMenuToggle");

        const navigation = $("mainNavigation");

        if (!header) return;

        /* OPEN OR CLOSE SEARCH */

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

                setMenu(false);

                if (searchInput) {

                    searchInput.focus();

                    searchDestinations();
                }

            } else {

                if (searchResults) {

                    searchResults.style.display = "none";
                }
            }
        }

        /* MOBILE NAVIGATION */

        function setMenu(open) {

            if (!navigation || !mobileMenu) return;

            navigation.classList.toggle("open", open);

            mobileMenu.setAttribute(
                "aria-expanded",
                String(open)
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

        /* SEARCH BUTTON CLICK */

        if (searchToggle && searchForm) {

            searchToggle.addEventListener("click", () => {

                setSearch(searchForm.hidden);

            });
        }

        /* SEARCH INPUT */

        if (searchInput) {

            searchInput.addEventListener("input", () => {

                searchDestinations();

            });
        }

        /* SEARCH SUBMISSION */

        if (searchForm) {

            searchForm.addEventListener("submit", event => {

                event.preventDefault();

                searchDestinations(true);

            });
        }

        /* MOBILE MENU BUTTON */

        if (mobileMenu && navigation) {

            mobileMenu.addEventListener("click", () => {

                setMenu(
                    !navigation.classList.contains("open")
                );

            });

            navigation.querySelectorAll("a")

                .forEach(link => {

                    link.addEventListener("click", () => {

                        setMenu(false);

                    });

                });
        }

        /* CLICK OUTSIDE */

        document.addEventListener("click", event => {

            if (
                !event.target.closest(".header-search-wrapper")
            ) {

                setSearch(false);
            }

            if (!header.contains(event.target)) {

                setMenu(false);
            }
        });

        /* ESCAPE KEY */

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {

                setSearch(false);

                setMenu(false);
            }
        });

        /* ACTIVE NAVIGATION */

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

                    const active = linkPage === currentPage;

                    link.classList.toggle("active", active);

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
    }

    /* ==========================================
       CUSTOMER ACCOUNT
    ========================================== */

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

            console.error("Account error:", error);

            account.href = "login.html";
        }
    }

    /* ==========================================
       FLOATING INQUIRY AND CHATBOT
    ========================================== */

    function toggleSupport(type, open) {

        const selected = type === "inquiry"

            ? "inquiry"

            : "chatbot";

        const other = selected === "inquiry"

            ? "chatbot"

            : "inquiry";

        const selectedWindow = $(selected + "Window");

        const selectedToggle = $(selected + "Toggle");

        if (!selectedWindow || !selectedToggle) return;

        selectedWindow.hidden = !open;

        selectedToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        if (open) {

            const otherWindow = $(other + "Window");

            const otherToggle = $(other + "Toggle");

            if (otherWindow) {

                otherWindow.hidden = true;
            }

            if (otherToggle) {

                otherToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    }

    /* ==========================================
       INQUIRY FORM
    ========================================== */

    function submitInquiry(event) {

        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const body = [

            "Full Name: " + data.get("name"),

            "Email: " + data.get("email"),

            "Contact Number: " + data.get("contact"),

            "Destination: " + data.get("destination"),

            "Travel Date: " + data.get("date"),

            "Travelers: " + data.get("pax"),

            "",

            "Message:",

            data.get("message")

        ].join("\n");

        window.location.href =

            "mailto:jeannyveve.cusi@gmail.com" +

            "?subject=" +

            encodeURIComponent("Website Travel Inquiry") +

            "&body=" +

            encodeURIComponent(body);
    }

    /* ==========================================
       TOUR INQUIRY BUTTONS
    ========================================== */

    function initializeTourInquiry() {

        document.addEventListener("click", event => {

            const button = event.target.closest("[data-tour]");

            if (!button) return;

            const form = $("quickInquiry");

            if (!form) return;

            form.elements.destination.value =
                button.dataset.destination;

            form.elements.pax.value =
                button.dataset.pax || 1;

            form.elements.message.value =

                "I would like to inquire about " +

                button.dataset.tour +

                ". Please confirm rates and availability.";

            toggleSupport("inquiry", true);

        });
    }

    /* ==========================================
       CHATBOT MESSAGE DISPLAY
    ========================================== */

    function addChatMessage(text, type) {

        const container = $("chatbotMessages");

        if (!container) return;

        const message = document.createElement("div");

        message.className = "landing-message " + type;

        message.textContent = text;

        container.append(message);

        container.scrollTop = container.scrollHeight;
    }

    /* ==========================================
       AUTOMATED CHATBOT RESPONSES
    ========================================== */

    function chatbotReply(text) {

        const query = text.toLowerCase();

        if (/contact|phone|email|gmail|number/.test(query)) {

            return "Contact us through Globe: 0906-456-0426, " +

                "Smart: 0919-272-6174, or email " +

                "jeannyveve.cusi@gmail.com.";
        }

        if (/address|office|location/.test(query)) {

            return "Our office is located at 41-A Pineda, " +

                "San Pedro, Puerto Princesa City, Palawan.";
        }

        if (/book|reserve|reservation/.test(query)) {

            return "Choose a tour package or customize your trip " +

                "using our Trip Planner. Send an inquiry to " +

                "confirm your booking and availability.";
        }

        if (/review|feedback|rating/.test(query)) {

            return "After completing your booked tour, you may " +

                "submit a review and upload travel photos or " +

                "videos through your customer account.";
        }

        if (/payment|gcash|maya/.test(query)) {

            return "Please contact our travel team for confirmed " +

                "payment options and instructions.";
        }

        if (/japan|vietnam|international/.test(query)) {

            return "Visit our Beyond Philippines page to explore " +

                "Vietnam and Japan travel packages.";
        }

        if (/custom|itinerary|planner/.test(query)) {

            return "Our Trip Planner offers Tour Only and " +

                "Customized Trip options.";
        }

        if (/price|package|tour|discount|cost/.test(query)) {

            return "Use Generate Tour Packages on our homepage " +

                "to discover suggested tours and estimated prices. " +

                "Contact us to confirm rates and availability.";
        }

        if (/hello|hi\b|hey/.test(query)) {

            return "Hello! How can I help you plan your next adventure?";
        }

        if (/thank/.test(query)) {

            return "You're welcome! We look forward to traveling with you.";
        }

        return "I can help with tour packages, destinations, " +

            "booking inquiries, and contact details. " +

            "For other questions, please use Inquire Now.";
    }

    /* ==========================================
       SEND CHAT MESSAGE
    ========================================== */

    function sendChatMessage(text) {

        const message = String(text || "").trim();

        if (!message) return;

        addChatMessage(message, "user");

        addChatMessage(chatbotReply(message), "bot");
    }

    /* ==========================================
       CUSTOMER REVIEWS
    ========================================== */

    let showAllReviews = false;

    function getApprovedReviews() {

        try {

            const reviews = JSON.parse(

                localStorage.getItem("customerReviews") || "[]"

            );

            if (!Array.isArray(reviews)) return [];

            return reviews.filter(review =>

                review &&

                review.status === "approved" &&

                Number.isInteger(Number(review.rating)) &&

                Number(review.rating) >= 1 &&

                Number(review.rating) <= 5

            ).sort((a, b) =>

                new Date(b.created_at) -

                new Date(a.created_at)

            );

        } catch (error) {

            console.error("Review loading error:", error);

            return [];
        }
    }

    /* ==========================================
       CUSTOMER PHOTO PREVIEW
    ========================================== */

    function previewPhoto(url) {

        const dialog = document.createElement("dialog");

        dialog.className = "review-preview";

        const image = document.createElement("img");

        image.src = url;

        image.alt = "Customer travel photo";

        const close = document.createElement("button");

        close.type = "button";

        close.className = "home-btn";

        close.textContent = "Close";

        close.onclick = () => dialog.close();

        dialog.append(image, close);

        document.body.append(dialog);

        dialog.addEventListener("close", () => {

            dialog.remove();

        });

        dialog.showModal();
    }

    /* ==========================================
       RENDER CUSTOMER REVIEWS
    ========================================== */

    function renderCustomerReviews() {

        const reviews = getApprovedReviews();

        const container = $("customer-review-grid");

        if (!container) return;

        const average = reviews.length

            ? reviews.reduce(

                (sum, review) => sum + Number(review.rating),

                0

            ) / reviews.length

            : 0;

        if ($("average-rating")) {

            $("average-rating").textContent =
                average.toFixed(1);
        }

        if ($("total-reviews")) {

            $("total-reviews").textContent =

                reviews.length +

                (reviews.length === 1

                    ? " Customer Review"

                    : " Customer Reviews");
        }

        const rounded = Math.round(average);

        if ($("average-stars")) {

            $("average-stars").textContent =

                "★".repeat(rounded) +

                "☆".repeat(5 - rounded);
        }

        const viewAll = $("view-all-reviews");

        if (viewAll) {

            viewAll.hidden = reviews.length <= 3;

            viewAll.textContent =

                showAllReviews ? "Show Less" : "View All Reviews";
        }

        container.replaceChildren();

        /* NO CUSTOMER REVIEWS */

        if (!reviews.length) {

            container.innerHTML = `

                <div class="review-empty">

                    <h3>Share Your Travel Experience</h3>

                    <p>
                        No customer reviews yet.
                        Be the first to share your adventure!
                    </p>

                </div>
            `;

            return;
        }

        /* DISPLAY FIRST THREE REVIEWS */

        const visibleReviews = showAllReviews

            ? reviews

            : reviews.slice(0, 3);

        visibleReviews.forEach(review => {

            const card = document.createElement("article");

            card.className =
                "landing-glass customer-review-card";

            const name = String(

                review.customer_name || "Customer"

            );

            const rating = Number(review.rating);

            card.innerHTML = `

                <div class="review-profile">

                    <div class="review-avatar">

                        ${escapeHTML(name.charAt(0).toUpperCase())}

                    </div>

                    <div>

                        <h3>${escapeHTML(name)}</h3>

                        <small>Customer Review</small>

                    </div>

                </div>

                <div
                    class="review-stars"
                    aria-label="${rating} out of 5 stars"
                >

                    ${"★".repeat(rating)}

                    ${"☆".repeat(5 - rating)}

                </div>

                <h4 class="review-tour">

                    ${escapeHTML(
                        review.tour_package || "Travel Experience"
                    )}

                </h4>

                <p class="review-message">

                    ${escapeHTML(review.review_message)}

                </p>
            `;

            /* CUSTOMER PHOTOS AND VIDEOS */

            if (Array.isArray(review.media)) {

                const mediaContainer =
                    document.createElement("div");

                mediaContainer.className = "review-media";

                review.media.forEach(file => {

                    if (
                        !file ||
                        typeof file.url !== "string"
                    ) return;

                    const url = file.url;

                    const imageAllowed =

                        /^data:image\/(jpeg|png|webp);base64,/i.test(url) ||

                        /^https?:\/\//i.test(url);

                    const videoAllowed =

                        /^data:video\/mp4;base64,/i.test(url) ||

                        /^https?:\/\//i.test(url);

                    /* REVIEW IMAGE */

                    if (
                        file.type === "image" &&
                        imageAllowed
                    ) {

                        const button =
                            document.createElement("button");

                        button.type = "button";

                        button.setAttribute(
                            "aria-label",
                            "View customer travel photo"
                        );

                        const image =
                            document.createElement("img");

                        image.src = url;

                        image.alt = "Customer travel photo";

                        image.loading = "lazy";

                        button.append(image);

                        button.onclick = () => previewPhoto(url);

                        mediaContainer.append(button);
                    }

                    /* REVIEW VIDEO */

                    if (
                        file.type === "video" &&
                        videoAllowed
                    ) {

                        const video =
                            document.createElement("video");

                        video.src = url;

                        video.controls = true;

                        video.preload = "metadata";

                        video.playsInline = true;

                        mediaContainer.append(video);
                    }

                });

                if (mediaContainer.children.length) {

                    card.append(mediaContainer);
                }
            }

            /* REVIEW DATE */

            const date = document.createElement("span");

            date.className = "review-date";

            const created = new Date(review.created_at);

            date.textContent =

                Number.isNaN(created.getTime())

                    ? ""

                    : created.toLocaleDateString("en-PH", {

                        year: "numeric",

                        month: "long",

                        day: "numeric"

                    });

            card.append(date);

            container.append(card);

        });
    }

    /* ==========================================
       FACEBOOK VIDEO DATA
    ========================================== */

    const facebookVideos = [

        // Paste actual public Facebook video URLs here.

    ];

    /* ==========================================
       RENDER FACEBOOK VIDEOS
    ========================================== */

    function renderFacebookVideos() {

        const container = $("facebook-video-grid");

        if (!container) return;

        container.replaceChildren();

        facebookVideos.forEach(link => {

            let url;

            try {

                url = new URL(link);

            } catch {

                return;
            }

            if (

                url.protocol !== "https:" ||

                !(
                    url.hostname === "facebook.com" ||

                    url.hostname.endsWith(".facebook.com")
                )

            ) return;

            const iframe = document.createElement("iframe");

            iframe.src =

                "https://www.facebook.com/plugins/video.php?href=" +

                encodeURIComponent(url.href) +

                "&show_text=false";

            iframe.title = "Facebook travel video";

            iframe.loading = "lazy";

            iframe.allowFullscreen = true;

            iframe.allow =

                "encrypted-media; picture-in-picture; fullscreen";

            container.append(iframe);

        });
    }

    /* ==========================================
       INITIALIZE HOMEPAGE
    ========================================== */

    document.addEventListener("DOMContentLoaded", () => {

        /* INITIALIZE HEADER */

        initializeHeader();

        updateCustomerAccount();

        if (!$("home-page")) return;

        /* RENDER HOMEPAGE CONTENT */

        renderPopularDestinations();

        renderCustomerReviews();

        renderFacebookVideos();

        initializeTourInquiry();

        /* TOUR PACKAGE GENERATOR */

        $("generatorForm")?.addEventListener(

            "submit",

            generatePackages

        );

        /* OPEN INQUIRY WINDOW */

        $("inquiryToggle")?.addEventListener("click", () => {

            toggleSupport(

                "inquiry",

                $("inquiryWindow").hidden

            );

        });

        /* CLOSE INQUIRY WINDOW */

        $("inquiryClose")?.addEventListener("click", () => {

            toggleSupport("inquiry", false);

        });

        /* OPEN CHATBOT WINDOW */

        $("chatbotToggle")?.addEventListener("click", () => {

            toggleSupport(

                "chatbot",

                $("chatbotWindow").hidden

            );

        });

        /* CLOSE CHATBOT WINDOW */

        $("chatbotClose")?.addEventListener("click", () => {

            toggleSupport("chatbot", false);

        });

        /* INQUIRY FORM */

        const inquiryForm = $("quickInquiry");

        if (inquiryForm) {

            const today = new Date(

                Date.now() -

                new Date().getTimezoneOffset() * 60000

            ).toISOString().slice(0, 10);

            if (inquiryForm.elements.date) {

                inquiryForm.elements.date.min = today;
            }

            inquiryForm.addEventListener(

                "submit",

                submitInquiry

            );
        }

        /* CHATBOT FORM */

        $("chatbotForm")?.addEventListener(

            "submit",

            event => {

                event.preventDefault();

                const input = $("chatbotInput");

                if (!input) return;

                sendChatMessage(input.value);

                input.value = "";

                input.focus();

            }

        );

        /* CHATBOT QUICK OPTIONS */

        document.querySelectorAll("[data-chat]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    sendChatMessage(button.dataset.chat);

                });

            });

        /* VIEW ALL CUSTOMER REVIEWS */

        $("view-all-reviews")?.addEventListener("click", () => {

            showAllReviews = !showAllReviews;

            renderCustomerReviews();

        });

        /* CLOSE SUPPORT USING ESCAPE */

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {

                toggleSupport("inquiry", false);

                toggleSupport("chatbot", false);
            }

        });

        console.log(
            "Homepage initialized successfully."
        );

    });

    /* ==========================================
       AUTOMATIC REVIEW AND ACCOUNT REFRESH
    ========================================== */

    window.addEventListener("storage", event => {

        if (event.key === "customerReviews") {

            renderCustomerReviews();
        }

        if (

            event.key === "ppowCustomerLoggedIn_v1" ||

            event.key === "ppowCustomerProfile_v1" ||

            event.key === null

        ) {

            updateCustomerAccount();
        }

    });

    window.addEventListener("pageshow", () => {

        renderCustomerReviews();

        updateCustomerAccount();

    });

})();