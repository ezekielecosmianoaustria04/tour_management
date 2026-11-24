
(() => {

    "use strict";

    /* ==========================================
       HELPER FUNCTIONS
    ========================================== */

    const $ = id => document.getElementById(id);

    const CUSTOMER_ID = "demo-customer-1";

    const MAX_FILES = 3;

    const MAX_FILE_SIZE = 500 * 1024;

    let selectedRating = 0;

    let selectedMedia = [];

    let profilePhoto = "";

    let bookingFilter = "all";


    function readStorage(key, fallback) {

        try {

            return JSON.parse(
                localStorage.getItem(key)
            ) ?? fallback;

        } catch {

            return fallback;

        }

    }


    function saveStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error("Storage error:", error);

            return false;

        }

    }


    function escapeHTML(value) {

        return String(value ?? "").replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[char]
        );

    }


    function formatDate(value) {

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-PH", {

            year: "numeric",
            month: "long",
            day: "numeric"

        });

    }


    function setStatus(id, message, error = false) {

        const element = $(id);

        element.textContent = message;

        element.classList.toggle("error", error);

    }


    function getArray(key) {

        const data = readStorage(key, []);

        return Array.isArray(data) ? data : [];

    }


    /* ==========================================
       CUSTOMER PROFILE DATA
    ========================================== */

    let profile = {

        customer_id: CUSTOMER_ID,

        full_name: "",

        email: "",

        contact_no: "",

        birth_date: "",

        address: "",

        profile_photo: "",

        ...readStorage("customerProfile", {})

    };


    /* ==========================================
       DASHBOARD NAVIGATION
    ========================================== */

    function showPanel(panelId) {

        const panel = $(panelId);

        if (!panel ||
            !panel.classList.contains("account-panel")) {

            panelId = "dashboard";

        }

        document.querySelectorAll(".account-panel")

            .forEach(section => {

                section.hidden = section.id !== panelId;

            });

        document.querySelectorAll(".account-menu-btn")

            .forEach(button => {

                button.classList.toggle(

                    "active",

                    button.dataset.panel === panelId

                );

            });

        history.replaceState(null, "", "#" + panelId);

        if (panelId === "my-bookings") {

            renderBookings();

        }

        if (panelId === "my-reviews") {

            renderReviewBookings();

            renderMyReviews();

        }

    }


    /* ==========================================
       LOAD CUSTOMER PROFILE
    ========================================== */

    function renderProfile() {

        const name = profile.full_name || "Customer";

        $("sidebarName").textContent = name;

        $("welcomeName").textContent = name.split(" ")[0];

        $("sidebarEmail").textContent =

            profile.email || "My Travel Account";

        $("fullName").value = profile.full_name || "";

        $("email").value = profile.email || "";

        $("contactNumber").value = profile.contact_no || "";

        $("birthDate").value = profile.birth_date || "";

        $("address").value = profile.address || "";

        profilePhoto = profile.profile_photo || "";

        renderProfilePhoto();

    }


    function renderProfilePhoto() {

        const validPhoto =

            /^data:image\/(jpeg|png|webp);base64,/i

                .test(profilePhoto);

        $("profileImage").hidden = !validPhoto;

        $("profilePlaceholder").hidden = validPhoto;

        if (validPhoto) {

            $("profileImage").src = profilePhoto;

        } else {

            $("profileImage").removeAttribute("src");

        }

    }


    /* ==========================================
       READ UPLOADED FILE
    ========================================== */

    function readFile(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;

            reader.readAsDataURL(file);

        });

    }


    /* ==========================================
       PROFILE PICTURE UPLOAD
    ========================================== */

    async function uploadProfilePhoto(event) {

        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];

        if (!allowedTypes.includes(file.type)) {

            setStatus(
                "profileStatus",
                "Please select a valid image.",
                true
            );

            return;

        }

        if (file.size > 1024 * 1024) {

            setStatus(
                "profileStatus",
                "Profile photo must not exceed 1 MB.",
                true
            );

            return;

        }

        try {

            profilePhoto = await readFile(file);

            renderProfilePhoto();

            setStatus(
                "profileStatus",
                "Photo selected. Click Save Changes to save."
            );

        } catch {

            setStatus(
                "profileStatus",
                "Unable to read the selected photo.",
                true
            );

        }

    }


    /* ==========================================
       SAVE PROFILE
    ========================================== */

    function saveProfile(event) {

        event.preventDefault();

        const updatedProfile = {

            customer_id: CUSTOMER_ID,

            full_name: $("fullName").value.trim(),

            email: $("email").value.trim(),

            contact_no: $("contactNumber").value.trim(),

            birth_date: $("birthDate").value,

            address: $("address").value.trim(),

            profile_photo: profilePhoto

        };

        if (!updatedProfile.full_name) {

            setStatus(
                "profileStatus",
                "Please enter your full name.",
                true
            );

            return;

        }

        if (!saveStorage(
            "customerProfile",
            updatedProfile
        )) {

            setStatus(
                "profileStatus",
                "Unable to save. Browser storage may be full.",
                true
            );

            return;

        }

        profile = updatedProfile;

        renderProfile();

        setStatus(
            "profileStatus",
            "Profile successfully updated."
        );

    }


    /* ==========================================
       CUSTOMER BOOKINGS
    ========================================== */

    function getMyBookings() {

        return getArray("customerBookings")

            .filter(booking =>

                booking.customer_id === CUSTOMER_ID

            );

    }


    function getMyReviews() {

        return getArray("customerReviews")

            .filter(review =>

                review.customer_id === CUSTOMER_ID

            );

    }


    /* ==========================================
       DASHBOARD STATISTICS
    ========================================== */

    function renderStatistics() {

        const bookings = getMyBookings();

        const reviews = getMyReviews();

        $("bookingCount").textContent = bookings.length;

        $("pendingCount").textContent =

            bookings.filter(booking =>

                booking.status === "pending"

            ).length;

        $("completedCount").textContent =

            bookings.filter(booking =>

                booking.status === "completed"

            ).length;

        $("reviewCount").textContent = reviews.length;

    }


    /* ==========================================
       DISPLAY BOOKINGS
    ========================================== */

    function renderBookings() {

        const container = $("bookingList");

        const bookings = getMyBookings().filter(booking =>

            bookingFilter === "all" ||

            booking.status === bookingFilter

        );

        if (!bookings.length) {

            container.innerHTML = `

                <div class="account-empty">

                    <i class="bi bi-calendar-x"></i>

                    <h3>No Bookings Found</h3>

                    <p>
                        Your travel reservations will appear here.
                    </p>

                </div>

            `;

            return;

        }

        container.innerHTML = bookings.map(booking => {

            const alreadyReviewed = getMyReviews().some(

                review =>

                    String(review.booking_id) ===

                    String(booking.booking_id)

            );

            const canReview =

                booking.status === "completed" &&

                !alreadyReviewed;

            return `

                <article class="booking-card">

                    <img src="palawan.jpg"
                         alt="Travel destination"
                         onerror="this.hidden=true">

                    <div class="booking-details">

                        <span class="account-status
                            ${escapeHTML(booking.status)}">

                            ${escapeHTML(booking.status)}

                        </span>

                        <h3>
                            ${escapeHTML(booking.tour_package)}
                        </h3>

                        <p>
                            Booking ID:
                            ${escapeHTML(booking.booking_id)}
                        </p>

                        <p>
                            Travel Date:
                            ${escapeHTML(formatDate(booking.travel_date))}
                        </p>

                        <p>
                            Travelers:
                            ${escapeHTML(booking.no_of_pax)}
                        </p>

                        ${booking.demo ? `
                            <p>Sample booking for frontend testing</p>
                        ` : ""}

                        ${canReview ? `

                            <button type="button"
                                    class="account-btn"
                                    data-review-booking="${escapeHTML(
                                        booking.booking_id
                                    )}">

                                <i class="bi bi-star"></i>

                                Write a Review

                            </button>

                        ` : ""}

                        ${alreadyReviewed ? `

                            <p>Review already submitted.</p>

                        ` : ""}

                    </div>

                </article>

            `;

        }).join("");

    }


    /* ==========================================
       COMPLETED BOOKINGS FOR REVIEWS
    ========================================== */

    function renderReviewBookings() {

        const select = $("reviewBooking");

        const previousValue = select.value;

        const reviews = getMyReviews();

        const bookings = getMyBookings().filter(booking =>

            booking.status === "completed" &&

            !reviews.some(review =>

                String(review.booking_id) ===

                String(booking.booking_id)

            )

        );

        select.replaceChildren();

        const placeholder = document.createElement("option");

        placeholder.value = "";

        placeholder.textContent = bookings.length

            ? "Select your completed tour"

            : "No completed tours available for review";

        select.append(placeholder);

        bookings.forEach(booking => {

            const option = document.createElement("option");

            option.value = String(booking.booking_id);

            option.textContent = booking.tour_package;

            select.append(option);

        });

        if (bookings.some(booking =>

            String(booking.booking_id) === previousValue

        )) {

            select.value = previousValue;

        }

        $("submitReview").disabled = !bookings.length;

    }


    /* ==========================================
       STAR RATING
    ========================================== */

    function renderStars(rating = selectedRating) {

        document.querySelectorAll("[data-rating]")

            .forEach(button => {

                const value = Number(button.dataset.rating);

                button.classList.toggle(

                    "selected",

                    value <= rating

                );

                button.setAttribute(

                    "aria-pressed",

                    String(value === selectedRating)

                );

            });

    }


    function selectRating(rating) {

        selectedRating = rating;

        const labels = {

            1: "Poor",

            2: "Fair",

            3: "Good",

            4: "Very Good",

            5: "Excellent"

        };

        $("ratingText").textContent =

            rating + " / 5 — " + labels[rating];

        renderStars();

    }


    /* ==========================================
       PHOTO AND VIDEO UPLOAD
    ========================================== */

    async function uploadReviewMedia(event) {

        const files = Array.from(event.target.files);

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp",

            "video/mp4"

        ];

        if (selectedMedia.length + files.length > MAX_FILES) {

            setStatus(
                "reviewStatus",
                "You may upload a maximum of 3 files.",
                true
            );

            event.target.value = "";

            return;

        }

        $("submitReview").disabled = true;

        try {

            for (const file of files) {

                if (!allowedTypes.includes(file.type)) {

                    setStatus(
                        "reviewStatus",
                        "Unsupported file type: " + file.name,
                        true
                    );

                    continue;

                }

                if (file.size > MAX_FILE_SIZE) {

                    setStatus(
                        "reviewStatus",
                        file.name + " exceeds the 500 KB demo limit.",
                        true
                    );

                    continue;

                }

                const url = await readFile(file);

                selectedMedia.push({

                    type: file.type.startsWith("image/")

                        ? "image"

                        : "video",

                    name: file.name,

                    url: url

                });

            }

        } catch {

            setStatus(
                "reviewStatus",
                "Unable to read an uploaded file.",
                true
            );

        } finally {

            event.target.value = "";

            renderMediaPreview();

            renderReviewBookings();

        }

    }


    /* ==========================================
       CREATE MEDIA ELEMENT
    ========================================== */

    function createMediaElement(file) {

        if (!file || typeof file.url !== "string") {

            return null;

        }

        if (

            file.type === "image" &&

            /^data:image\/(jpeg|png|webp);base64,/i

                .test(file.url)

        ) {

            const image = document.createElement("img");

            image.src = file.url;

            image.alt = "Uploaded travel photo";

            return image;

        }

        if (

            file.type === "video" &&

            /^data:video\/mp4;base64,/i.test(file.url)

        ) {

            const video = document.createElement("video");

            video.src = file.url;

            video.controls = true;

            video.preload = "metadata";

            video.playsInline = true;

            return video;

        }

        return null;

    }


    /* ==========================================
       DISPLAY UPLOAD PREVIEW
    ========================================== */

    function renderMediaPreview() {

        const container = $("mediaPreview");

        container.replaceChildren();

        selectedMedia.forEach((file, index) => {

            const element = createMediaElement(file);

            if (!element) return;

            const item = document.createElement("div");

            item.className = "media-preview-item";

            const remove = document.createElement("button");

            remove.type = "button";

            remove.className = "remove-media";

            remove.textContent = "×";

            remove.setAttribute("aria-label", "Remove file");

            remove.onclick = () => {

                selectedMedia.splice(index, 1);

                renderMediaPreview();

            };

            item.append(element, remove);

            container.append(item);

        });

    }


    /* ==========================================
       SUBMIT CUSTOMER REVIEW
    ========================================== */

    function submitReview(event) {

        event.preventDefault();

        const bookingId = $("reviewBooking").value;

        const message = $("reviewMessage").value.trim();

        const booking = getMyBookings().find(item =>

            String(item.booking_id) === bookingId &&

            item.status === "completed"

        );

        if (!profile.full_name) {

            setStatus(
                "reviewStatus",
                "Please complete your profile before writing a review.",
                true
            );

            return;

        }

        if (!booking) {

            setStatus(
                "reviewStatus",
                "Please select a completed booking.",
                true
            );

            return;

        }

        if (selectedRating < 1 || selectedRating > 5) {

            setStatus(
                "reviewStatus",
                "Please select a star rating.",
                true
            );

            return;

        }

        if (!message || message.length > 1000) {

            setStatus(
                "reviewStatus",
                "Please enter a valid review.",
                true
            );

            return;

        }

        if (!$("reviewConsent").checked) {

            setStatus(
                "reviewStatus",
                "Please confirm your consent.",
                true
            );

            return;

        }

        const reviews = getArray("customerReviews");

        const alreadyReviewed = reviews.some(review =>

            review.customer_id === CUSTOMER_ID &&

            String(review.booking_id) === bookingId

        );

        if (alreadyReviewed) {

            setStatus(
                "reviewStatus",
                "You have already reviewed this booking.",
                true
            );

            return;

        }


        /* REVIEW DATA - COMPATIBLE WITH HOME.JS */

        const newReview = {

            review_id: crypto.randomUUID(),

            customer_id: CUSTOMER_ID,

            booking_id: booking.booking_id,

            customer_name: profile.full_name,

            tour_package: booking.tour_package,

            rating: selectedRating,

            review_message: message,

            media: selectedMedia.map(file => ({

                type: file.type,

                url: file.url

            })),

            status: "pending",

            demo: Boolean(booking.demo),

            created_at: new Date().toISOString(),

            updated_at: new Date().toISOString()

        };

        reviews.push(newReview);

        if (!saveStorage("customerReviews", reviews)) {

            setStatus(
                "reviewStatus",
                "Browser storage is full. Remove some media and try again.",
                true
            );

            return;

        }

        $("reviewForm").reset();

        selectedRating = 0;

        selectedMedia = [];

        $("ratingText").textContent = "Select your rating";

        $("characterCount").textContent = "0 / 1000 characters";

        renderStars();

        renderMediaPreview();

        renderReviewBookings();

        renderMyReviews();

        renderStatistics();

        setStatus(
            "reviewStatus",
            "Review submitted successfully! Status: Pending approval."
        );

    }


    /* ==========================================
       DISPLAY SUBMITTED REVIEWS
    ========================================== */

    function renderMyReviews() {

        const container = $("myReviewList");

        const reviews = getMyReviews().sort((a, b) =>

            new Date(b.created_at) -

            new Date(a.created_at)

        );

        container.replaceChildren();

        if (!reviews.length) {

            container.innerHTML = `

                <div class="account-empty">

                    <i class="bi bi-chat-square-text"></i>

                    <h3>No Reviews Yet</h3>

                    <p>
                        Your submitted travel reviews
                        will appear here.
                    </p>

                </div>

            `;

            return;

        }

        reviews.forEach(review => {

            const card = document.createElement("article");

            card.className = "submitted-review";

            const rating = Math.max(

                0,

                Math.min(5, Math.floor(Number(review.rating) || 0))

            );

            card.innerHTML = `

                <span class="account-status
                    ${escapeHTML(review.status)}">

                    ${escapeHTML(review.status)}

                </span>

                <h3>
                    ${escapeHTML(review.tour_package)}
                </h3>

                <div class="submitted-stars">

                    ${"★".repeat(rating)}

                    ${"☆".repeat(5 - rating)}

                </div>

                <p>
                    ${escapeHTML(review.review_message)}
                </p>

                ${review.demo ? `

                    <small>Frontend test review</small>

                ` : ""}

            `;

            if (Array.isArray(review.media)) {

                const media = document.createElement("div");

                media.className = "media-preview-grid";

                review.media.forEach(file => {

                    const element = createMediaElement(file);

                    if (!element) return;

                    const item = document.createElement("div");

                    item.className = "media-preview-item";

                    item.append(element);

                    media.append(item);

                });

                card.append(media);

            }

            const date = document.createElement("small");

            date.textContent =

                "Submitted: " + formatDate(review.created_at);

            card.append(date);


            /* REVIEW STATUS MESSAGE */

            const status = document.createElement("small");

            if (review.status === "pending") {

                status.textContent =

                    "Waiting for administrator approval.";

            } else if (review.status === "approved") {

                status.textContent =

                    "Your review is available on the homepage.";

            } else if (review.status === "rejected") {

                status.textContent =

                    "Your review was not approved.";

            }

            card.append(status);


            /* DELETE REVIEW */

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className = "delete-review-btn";

            deleteButton.textContent = "Delete Review";

            deleteButton.onclick = () => {

                deleteReview(review.review_id);

            };

            card.append(deleteButton);

            container.append(card);

        });

    }


    /* ==========================================
       DELETE CUSTOMER REVIEW
    ========================================== */

    function deleteReview(reviewId) {

        if (!confirm("Delete this review?")) return;

        const reviews = getArray("customerReviews")

            .filter(review =>

                !(

                    review.review_id === reviewId &&

                    review.customer_id === CUSTOMER_ID

                )

            );

        if (!saveStorage("customerReviews", reviews)) {

            setStatus(
                "reviewStatus",
                "Unable to delete the review.",
                true
            );

            return;

        }

        renderMyReviews();

        renderReviewBookings();

        renderStatistics();

        setStatus(
            "reviewStatus",
            "Review deleted successfully."
        );

    }


    /* ==========================================
       DEMO COMPLETED BOOKING
       FOR FRONTEND TESTING ONLY
    ========================================== */

    function createDemoBooking() {

        const bookings = getArray("customerBookings");

        const existing = bookings.some(booking =>

            booking.customer_id === CUSTOMER_ID &&

            booking.demo === true

        );

        if (existing) {

            alert("A sample booking already exists.");

            showPanel("my-bookings");

            return;

        }

        bookings.push({

            booking_id: "DEMO-" + Date.now(),

            customer_id: CUSTOMER_ID,

            tour_package: "El Nido Island Hopping Tour A",

            travel_date: new Date().toISOString(),

            no_of_pax: 2,

            status: "completed",

            demo: true

        });

        if (!saveStorage("customerBookings", bookings)) {

            alert("Unable to save the sample booking.");

            return;

        }

        renderStatistics();

        showPanel("my-bookings");

    }


    /* ==========================================
       INITIALIZE CUSTOMER ACCOUNT
    ========================================== */

    document.addEventListener("DOMContentLoaded", () => {

        renderProfile();

        renderStatistics();

        renderBookings();

        renderReviewBookings();

        renderMyReviews();


        /* SIDEBAR NAVIGATION */

        document.querySelectorAll("[data-panel]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    showPanel(button.dataset.panel);

                });

            });


        /* PROFILE FORM */

        $("profileForm").addEventListener(

            "submit",

            saveProfile

        );

        $("profileUpload").addEventListener(

            "change",

            uploadProfilePhoto

        );

        $("birthDate").max = new Date()

            .toISOString().slice(0, 10);


        /* BOOKING FILTERS */

        document.querySelectorAll("[data-filter]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    bookingFilter = button.dataset.filter;

                    document.querySelectorAll("[data-filter]")

                        .forEach(item => {

                            item.classList.toggle(

                                "active",

                                item === button

                            );

                        });

                    renderBookings();

                });

            });


        /* WRITE REVIEW FROM BOOKING */

        $("bookingList").addEventListener("click", event => {

            const button = event.target.closest(

                "[data-review-booking]"

            );

            if (!button) return;

            showPanel("my-reviews");

            $("reviewBooking").value =

                button.dataset.reviewBooking;

        });


        /* STAR RATING */

        document.querySelectorAll("[data-rating]")

            .forEach(button => {

                button.addEventListener("click", () => {

                    selectRating(Number(button.dataset.rating));

                });

                button.addEventListener("mouseenter", () => {

                    renderStars(Number(button.dataset.rating));

                });

                button.addEventListener("mouseleave", () => {

                    renderStars();

                });

            });


        /* CHARACTER COUNTER */

        $("reviewMessage").addEventListener("input", event => {

            $("characterCount").textContent =

                event.target.value.length +

                " / 1000 characters";

        });


        /* REVIEW MEDIA UPLOAD */

        $("reviewMedia").addEventListener(

            "change",

            uploadReviewMedia

        );


        /* SUBMIT REVIEW */

        $("reviewForm").addEventListener(

            "submit",

            submitReview

        );


        /* CREATE SAMPLE BOOKING */

        $("demoBookingBtn").addEventListener(

            "click",

            createDemoBooking

        );


        /* DEMO LOGOUT */

        $("logoutBtn").addEventListener("click", () => {

            if (confirm("Exit the demo customer account?")) {

                sessionStorage.removeItem("currentCustomer");

                location.href = "login.html";

            }

        });


        /* HEADER SEARCH */

        document.getElementById("headerSearchForm")

            ?.addEventListener("submit", event => {

                event.preventDefault();

                const query = $("home-location-search")

                    .value.trim().toLowerCase();

                location.href =

                    /japan|vietnam/.test(query)

                        ? "beyond-philippines.html"

                        : "local-destinations.html";

            });

        // Supports the shared header form without an ID.

        document.querySelector("header .home-search")

            ?.addEventListener("submit", event => {

                event.preventDefault();

                const query = $("home-location-search")

                    .value.trim().toLowerCase();

                location.href =

                    /japan|vietnam/.test(query)

                        ? "beyond-philippines.html"

                        : "local-destinations.html";

            });


        /* OPEN REQUESTED ACCOUNT SECTION */

        showPanel(

            location.hash.slice(1) || "dashboard"

        );

    });


    /* ==========================================
       UPDATE REVIEW APPROVAL STATUS
    ========================================== */

    window.addEventListener("storage", event => {

        if (event.key === "customerReviews") {

            renderMyReviews();

            renderReviewBookings();

            renderStatistics();

        }

        if (event.key === "customerBookings") {

            renderBookings();

            renderReviewBookings();

            renderStatistics();

        }

    });

})();
