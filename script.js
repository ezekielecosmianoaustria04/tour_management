

let selectedDestination = "";
let selectedDestinationType = "local";
let selectedRegion = "";
let selectedPackage = null;
let cart = [];
let bookingDetails = {};
let guestDetails = {};

const today = new Date().toISOString().split("T")[0];

/* ================= DESTINATION DATA ================= */

const localDestinations = {
    Luzon: [
        "Baguio", "Benguet", "Ilocos", "Pangasinan",
        "Pampanga", "Zambales", "Olongapo"
    ],

    Visayas: [
        "Cebu", "Bohol", "Boracay", "Iloilo",
        "Bacolod", "Siquijor", "Dumaguete",
        "Samar", "Leyte", "El Nido",
        "Puerto Princesa", "Coron", "Port Barton"
    ],

    Mindanao: [
        "Davao", "Cagayan de Oro", "Camiguin",
        "Siargao", "Bukidnon", "General Santos"
    ]
};

const internationalDestinations = [
    "Japan", "South Korea", "Singapore",
    "Thailand", "Hong Kong", "Taiwan",
    "Malaysia", "Vietnam"
];

/* ================= TOUR PACKAGE DATA ================= */

const packageData = {
    "Puerto Princesa": [
        {
            name: "Underground River Tour",
            description: "Explore the world-famous Underground River.",
            price: 2500,
            image: "underground-river.jpg"
        },
        {
            name: "Honda Bay Island Hopping",
            description: "Enjoy beautiful islands and beaches.",
            price: 1800,
            image: "honda-bay.jpg"
        },
        {
            name: "Puerto Princesa City Tour",
            description: "Discover the famous attractions of the city.",
            price: 1500,
            image: "city-tour.jpg"
        },
        {
            name: "Nagtabon Beach Tour",
            description: "Relax and enjoy the beautiful beach.",
            price: 1200,
            image: "nagtabon.jpg"
        }
    ],

    "El Nido": [
        {
            name: "El Nido Tour A",
            description: "Explore lagoons, beaches, and islands.",
            price: 1800,
            image: "elnido-tour-a.jpg"
        },
        {
            name: "El Nido Tour B",
            description: "Visit caves and beautiful island destinations.",
            price: 1800,
            image: "elnido-tour-b.jpg"
        },
        {
            name: "El Nido Tour C",
            description: "Discover hidden beaches and snorkeling spots.",
            price: 2000,
            image: "elnido-tour-c.jpg"
        }
    ],

    "Coron": [
        {
            name: "Coron Island Tour",
            description: "Explore the beautiful lakes and lagoons.",
            price: 2200,
            image: "coron-tour.jpg"
        },
        {
            name: "Coron Island Hopping",
            description: "Enjoy island hopping and swimming activities.",
            price: 2000,
            image: "coron-hopping.jpg"
        }
    ],

    "Port Barton": [
        {
            name: "Port Barton Island Hopping",
            description: "Explore the beautiful islands of Port Barton.",
            price: 1800,
            image: "portbarton-tour.jpg"
        },
        {
            name: "Turtle Watching Tour",
            description: "Experience turtle watching and snorkeling.",
            price: 1500,
            image: "turtle-watching.jpg"
        }
    ]
};

/* ================= HELPER FUNCTIONS ================= */

function formatPrice(price) {
    return Number(price).toLocaleString("en-PH");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function getPackages(destination) {
    return packageData[destination] || [
        {
            name: destination + " Travel Experience",
            description: "Contact us for available tour packages.",
            price: 0,
            image: ""
        }
    ];
}

/* ================= PAGE NAVIGATION ================= */

function showPage(pageId, sectionId = null) {
    const pages = document.querySelectorAll(".app-page");

    pages.forEach(page => {
        page.style.display = "none";
        page.classList.remove("active");
    });

    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.error("Page not found:", pageId);
        return;
    }

    targetPage.style.display = "block";
    targetPage.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (sectionId) {
        setTimeout(() => {
            const section = document.getElementById(sectionId);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    }
}

/* ================= LOGIN BUTTON ================= */

function showLoginNotice() {
    alert(
        "Login feature is not yet connected.\n\n" +
        "This feature will be available once the login system is implemented."
    );
}

/* ================= HOME SEARCH ================= */

function searchHomeLocations(openFirst = false) {
    const input = document.getElementById("home-location-search");
    const results = document.getElementById("home-search-results");

    if (!input || !results) return;

    const keyword = input.value.trim().toLowerCase();

    if (!keyword) {
        results.innerHTML = "";
        return;
    }

    const allDestinations = [
        ...Object.values(localDestinations).flat(),
        ...internationalDestinations
    ];

    const matches = [...new Set(allDestinations)].filter(place =>
        place.toLowerCase().includes(keyword)
    );

    if (matches.length === 0) {
        results.innerHTML = "<p>No destinations found.</p>";
        return;
    }

    if (openFirst) {
        chooseDestination(matches[0], internationalDestinations.includes(matches[0]) ? "international" : "local");
        return;
    }

    results.innerHTML = matches.map(place => `
        <button type="button"
            onclick="chooseDestination('${escapeHTML(place)}', '${internationalDestinations.includes(place) ? "international" : "local"}')">
            ${escapeHTML(place)}
        </button>
    `).join("");
}

/* ================= REGION SELECTION ================= */

function selectRegion(region, button) {
    selectedRegion = region;

    document.querySelectorAll(".region-card").forEach(card => {
        card.classList.remove("selected");
    });

    if (button) {
        button.classList.add("selected");
    }

    const title = document.getElementById("region-title");
    const eyebrow = document.getElementById("region-eyebrow");
    const description = document.getElementById("region-description");
    const container = document.getElementById("local-destinations");

    if (!container) return;

    if (title) title.textContent = region + " Destinations";
    if (eyebrow) eyebrow.textContent = "EXPLORE " + region.toUpperCase();
    if (description) description.textContent = "Choose your preferred destination.";

    const places = localDestinations[region] || [];

    container.innerHTML = places.map(place => `
        <article class="destination-card">
            <div class="destination-info">
                <span>${escapeHTML(region.toUpperCase())}</span>
                <h3>${escapeHTML(place)}</h3>
                <p>Discover the attractions and experiences of ${escapeHTML(place)}.</p>
                <button type="button"
                    onclick="chooseDestination('${escapeHTML(place)}','local')">
                    Explore & Book →
                </button>
            </div>
        </article>
    `).join("");
}

/* ================= LOCAL DESTINATION SEARCH ================= */

function filterDestinations() {
    const input = document.getElementById("location-search");
    const container = document.getElementById("local-destinations");

    if (!input || !container) return;

    const keyword = input.value.trim().toLowerCase();

    if (!keyword) {
        if (selectedRegion) {
            selectRegion(selectedRegion);
        } else {
            renderFeaturedDestinations();
        }
        return;
    }

    const allPlaces = [...new Set(Object.values(localDestinations).flat())];

    const matches = allPlaces.filter(place =>
        place.toLowerCase().includes(keyword)
    );

    container.innerHTML = matches.length
        ? matches.map(place => `
            <article class="destination-card">
                <div class="destination-info">
                    <h3>${escapeHTML(place)}</h3>
                    <button type="button"
                        onclick="chooseDestination('${escapeHTML(place)}','local')">
                        Explore & Book →
                    </button>
                </div>
            </article>
        `).join("")
        : "<p>No destinations found. Try another location.</p>";
}

/* ================= FEATURED DESTINATIONS ================= */

function renderFeaturedDestinations() {
    const container = document.getElementById("local-destinations");

    if (!container) return;

    const featured = [
        "Puerto Princesa",
        "El Nido",
        "Coron",
        "Port Barton"
    ];

    container.innerHTML = featured.map(place => `
        <article class="destination-card">
            <div class="destination-info">
                <span>PALAWAN</span>
                <h3>${place}</h3>
                <button type="button"
                    onclick="chooseDestination('${place}','local')">
                    Explore & Book →
                </button>
            </div>
        </article>
    `).join("");
}

/* ================= INTERNATIONAL DESTINATIONS ================= */

function renderInternationalDestinations() {
    const container = document.getElementById("international-destinations");

    if (!container) return;

    container.innerHTML = internationalDestinations.map(place => `
        <article class="destination-card">
            <div class="destination-info">
                <span>INTERNATIONAL</span>
                <h3>${escapeHTML(place)}</h3>
                <p>Explore travel experiences in ${escapeHTML(place)}.</p>
                <button type="button"
                    onclick="chooseDestination('${escapeHTML(place)}','international')">
                    Explore & Book →
                </button>
            </div>
        </article>
    `).join("");
}

/* ================= CHOOSE DESTINATION ================= */

function chooseDestination(destination, type = "local") {
    selectedDestination = destination;
    selectedDestinationType = type;
    selectedPackage = null;

    if (type === "international") {
        showPage("beyond-page");
        return;
    }

    const title = document.getElementById("selected-destination-title");

    if (title) {
        title.textContent = destination + " Packages";
    }

    displayPackages(destination);
    showPage("packages-page");
}

/* ================= DISPLAY PACKAGES ================= */

function displayPackages(destination) {
    const container = document.getElementById("destination-packages");

    if (!container) return;

    const packages = getPackages(destination);

    container.innerHTML = packages.map((item, index) => `
        <article class="package-card">
            ${item.image ? `
                <img src="${escapeHTML(item.image)}"
                     alt="${escapeHTML(item.name)}"
                     onerror="this.style.display='none'">
            ` : ""}

            <div class="package-info">
                <h3>${escapeHTML(item.name)}</h3>
                <p>${escapeHTML(item.description)}</p>

                <h4>${item.price > 0 ? "₱" + formatPrice(item.price) : "Contact for price"}</h4>

                <button type="button"
                    onclick="addToCart('${escapeHTML(destination)}', ${index})">
                    Add to Cart
                </button>

                <button type="button"
                    class="secondary-btn"
                    onclick="startBooking('${escapeHTML(destination)}', ${index})">
                    Book This Package
                </button>
            </div>
        </article>
    `).join("");
}

/* ================= SHOPPING CART ================= */

function addToCart(destination, index) {
    const packages = getPackages(destination);
    const item = packages[index];

    if (!item || item.price <= 0) {
        alert("Please contact the cooperative for the package price.");
        return;
    }

    const existing = cart.find(cartItem =>
        cartItem.name === item.name &&
        cartItem.destination === destination
    );

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: item.name,
            destination: destination,
            price: item.price,
            quantity: 1
        });
    }

    updateCart();

    alert(item.name + " has been added to your cart!");
}

function updateCart() {
    const cartCount = document.getElementById("cart-count");
    const packageCount = document.getElementById("package-cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (cartCount) cartCount.textContent = count;
    if (packageCount) packageCount.textContent = count;
    if (cartTotal) cartTotal.textContent = formatPrice(total);

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Your shopping cart is empty.</p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div>
                <h3>${escapeHTML(item.name)}</h3>
                <p>${escapeHTML(item.destination)}</p>
                <p>Quantity: ${item.quantity}</p>
                <strong>₱${formatPrice(item.price * item.quantity)}</strong>
            </div>

            <div class="cart-item-actions">
                <button type="button" onclick="changeQuantity(${index}, -1)">−</button>
                <button type="button" onclick="changeQuantity(${index}, 1)">+</button>
                <button type="button" onclick="removeFromCart(${index})">Remove</button>
            </div>
        </div>
    `).join("");
}

function changeQuantity(index, amount) {
    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function openCart() {
    const overlay = document.getElementById("cart-overlay");

    if (overlay) {
        overlay.style.display = "flex";
        overlay.classList.add("open");
    }

    updateCart();
}

function closeCart() {
    const overlay = document.getElementById("cart-overlay");

    if (overlay) {
        overlay.style.display = "none";
        overlay.classList.remove("open");
    }
}

/* ================= START BOOKING ================= */

function startBooking(destination, packageIndex) {
    selectedDestination = destination;
    selectedPackage = getPackages(destination)[packageIndex];

    const flightDestination = document.getElementById("flight-destination");

    if (flightDestination) {
        flightDestination.textContent = destination;
    }

    showPage("flight-page");
}

/* ================= FLIGHT CONFIRMATION ================= */

function answerFlight(hasFlight) {
    if (!hasFlight) {
        alert(
            "Please arrange your flight first before continuing with this booking.\n\n" +
            "Once you have your flight details, you can proceed with your tour reservation."
        );
        return;
    }

    prepareBookingForm();
    showPage("booking-page");
}

/* ================= BOOKING FORM ================= */

function prepareBookingForm() {
    const destinationInput = document.getElementById("booking-destination");
    const paxInput = document.getElementById("booking-pax");
    const bookingDate = document.getElementById("booking-date");
    const arrivalDate = document.getElementById("arrival-date");
    const departureDate = document.getElementById("departure-date");

    if (destinationInput) {
        destinationInput.value = selectedDestination;
    }

    if (paxInput) {
        paxInput.value = 2;
    }

    if (bookingDate) bookingDate.min = today;
    if (arrivalDate) arrivalDate.min = today;
    if (departureDate) departureDate.min = today;

    renderBookingPackageOptions();
}

function renderBookingPackageOptions() {
    const container = document.getElementById("booking-package-options");

    if (!container) return;

    const packages = getPackages(selectedDestination);

    container.innerHTML = packages.map((item, index) => `
        <label class="booking-package-option">
            <input type="radio"
                name="selected-package"
                value="${index}"
                ${selectedPackage === item ? "checked" : ""}
                required>

            <div>
                <h3>${escapeHTML(item.name)}</h3>
                <p>${escapeHTML(item.description)}</p>
                <strong>
                    ${item.price > 0 ? "₱" + formatPrice(item.price) : "Contact for price"}
                </strong>
            </div>
        </label>
    `).join("");
}

function submitBookingDetails(event) {
    event.preventDefault();

    const destination = document.getElementById("booking-destination").value;
    const pax = document.getElementById("booking-pax").value;
    const travelDate = document.getElementById("booking-date").value;
    const arrivalDate = document.getElementById("arrival-date").value;
    const departureDate = document.getElementById("departure-date").value;
    const tourType = document.getElementById("booking-tour-type").value;
    const hotel = document.getElementById("booking-hotel").value;
    const message = document.getElementById("booking-message").value;

    const packageChoice = document.querySelector(
        'input[name="selected-package"]:checked'
    );

    if (!packageChoice) {
        alert("Please select a tour package.");
        return;
    }

    if (travelDate < today || arrivalDate < today || departureDate < today) {
        alert("Please select valid future dates.");
        return;
    }

    if (departureDate <= arrivalDate) {
        alert("Departure date must be after arrival date.");
        return;
    }

    const packageIndex = Number(packageChoice.value);

    selectedPackage = getPackages(destination)[packageIndex];

    bookingDetails = {
        destination,
        pax,
        travelDate,
        arrivalDate,
        departureDate,
        tourType,
        hotel,
        message,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price
    };

    const guestPax = document.getElementById("guest-pax");

    if (guestPax) {
        guestPax.value = pax;
    }

    showPage("guest-page");
}

/* ================= GUEST INFORMATION ================= */

function submitGuestInformation(event) {
    event.preventDefault();

    const name = document.getElementById("guest-name").value.trim();
    const contact = document.getElementById("guest-contact").value.trim();
    const email = document.getElementById("guest-email").value.trim();
    const birthdate = document.getElementById("guest-birthdate").value;
    const flightNumber = document.getElementById("guest-flight").value.trim();

    const flightPhoto = document.getElementById("flight-photo").files[0];
    const validID = document.getElementById("valid-id-photo").files[0];

    if (!name || !contact || !email || !birthdate || !flightNumber) {
        alert("Please complete all guest information.");
        return;
    }

    if (!flightPhoto || !validID) {
        alert("Please attach your flight itinerary and valid ID.");
        return;
    }

    if (birthdate >= today) {
        alert("Please enter a valid birthdate.");
        return;
    }

    guestDetails = {
        name,
        contact,
        email,
        birthdate,
        flightNumber,
        flightPhotoName: flightPhoto.name,
        validIDName: validID.name
    };

    displayBookingSummary();
    showPage("review-page");
}

/* ================= BOOKING SUMMARY ================= */

function displayBookingSummary() {
    const summary = document.getElementById("booking-summary");

    if (!summary) return;

    summary.innerHTML = `
        <h2>Travel Details</h2>

        <p><strong>Destination:</strong> ${escapeHTML(bookingDetails.destination)}</p>
        <p><strong>Package:</strong> ${escapeHTML(bookingDetails.packageName)}</p>
        <p><strong>Number of PAX:</strong> ${escapeHTML(bookingDetails.pax)}</p>
        <p><strong>Travel Date:</strong> ${escapeHTML(bookingDetails.travelDate)}</p>
        <p><strong>Arrival:</strong> ${escapeHTML(bookingDetails.arrivalDate)}</p>
        <p><strong>Departure:</strong> ${escapeHTML(bookingDetails.departureDate)}</p>
        <p><strong>Tour Type:</strong> ${escapeHTML(bookingDetails.tourType)}</p>
        <p><strong>Hotel:</strong> ${escapeHTML(bookingDetails.hotel)}</p>
        <p><strong>Package Price:</strong> ${bookingDetails.packagePrice > 0 ? "₱" + formatPrice(bookingDetails.packagePrice) : "Contact for price"}</p>
        <p><strong>Message:</strong> ${escapeHTML(bookingDetails.message || "None")}</p>

        <hr>

        <h2>Guest Information</h2>

        <p><strong>Full Name:</strong> ${escapeHTML(guestDetails.name)}</p>
        <p><strong>Contact:</strong> ${escapeHTML(guestDetails.contact)}</p>
        <p><strong>Email:</strong> ${escapeHTML(guestDetails.email)}</p>
        <p><strong>Birthdate:</strong> ${escapeHTML(guestDetails.birthdate)}</p>
        <p><strong>Flight Number:</strong> ${escapeHTML(guestDetails.flightNumber)}</p>
        <p><strong>Flight Document:</strong> ${escapeHTML(guestDetails.flightPhotoName)}</p>
        <p><strong>Valid ID:</strong> ${escapeHTML(guestDetails.validIDName)}</p>
    `;
}

/* ================= CONFIRM BOOKING ================= */

function confirmBooking() {
    if (!bookingDetails.destination || !guestDetails.name) {
        alert("Please complete the booking information first.");
        return;
    }

    console.log("BOOKING DETAILS:", bookingDetails);
    console.log("GUEST DETAILS:", guestDetails);

    alert(
        "Your booking request has been prepared successfully!\n\n" +
        "Destination: " + bookingDetails.destination + "\n" +
        "Guest: " + guestDetails.name + "\n" +
        "Package: " + bookingDetails.packageName + "\n\n" +
        "This is a front-end demonstration. Your booking has NOT been sent to a server."
    );

    showPage("home-page");
}

/* ================= CART TO BOOKING ================= */

function continueFromCart() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a package first.");
        return;
    }

    const firstItem = cart[0];

    selectedDestination = firstItem.destination;

    selectedPackage = getPackages(firstItem.destination).find(
        item => item.name === firstItem.name
    );

    closeCart();

    const flightDestination = document.getElementById("flight-destination");

    if (flightDestination) {
        flightDestination.textContent = selectedDestination;
    }

    showPage("flight-page");
}

/* ================= PREDICTIVE TRAVEL SUGGESTIONS ================= */

function generatePredictions() {
    const region = document.getElementById("predict-region").value;
    const budget = Number(document.getElementById("predict-budget").value);
    const style = document.getElementById("predict-style").value;
    const days = Number(document.getElementById("predict-days").value);

    const results = document.getElementById("prediction-results");

    if (!results) return;

    if (!budget || budget < 1000 || !days || days < 1 || days > 30) {
        alert("Please enter a valid budget and travel duration.");
        return;
    }

    const suggestions = [
        {
            name: "Puerto Princesa",
            region: "Palawan",
            style: ["nature", "culture", "relax"],
            price: 2500,
            description: "Underground River, city tour, and Honda Bay."
        },
        {
            name: "El Nido",
            region: "Palawan",
            style: ["nature", "beach", "relax"],
            price: 3500,
            description: "Island hopping, lagoons, and beaches."
        },
        {
            name: "Coron",
            region: "Palawan",
            style: ["nature", "beach"],
            price: 3000,
            description: "Beautiful lakes, reefs, and island tours."
        },
        {
            name: "Baguio",
            region: "Luzon",
            style: ["nature", "culture", "relax"],
            price: 2500,
            description: "Mountain views and city attractions."
        },
        {
            name: "Cebu",
            region: "Visayas",
            style: ["nature", "beach", "culture"],
            price: 3000,
            description: "Beaches, waterfalls, and cultural attractions."
        },
        {
            name: "Bohol",
            region: "Visayas",
            style: ["nature", "beach", "relax"],
            price: 2800,
            description: "Chocolate Hills, beaches, and island activities."
        },
        {
            name: "Siargao",
            region: "Mindanao",
            style: ["nature", "beach", "relax"],
            price: 3500,
            description: "Surfing, lagoons, and island adventures."
        },
        {
            name: "Japan",
            region: "International",
            style: ["culture", "nature"],
            price: 15000,
            description: "Discover Japanese culture and attractions."
        }
    ];

    const filtered = suggestions.filter(place => {
        const regionMatch =
            region === "any" ||
            region === place.region ||
            (region === "Palawan" && place.region === "Palawan") ||
            (region === "International" && place.region === "International");

        const styleMatch = place.style.includes(style);
        const budgetMatch = place.price <= budget;

        return regionMatch && styleMatch && budgetMatch;
    });

    if (filtered.length === 0) {
        results.innerHTML = `
            <div class="no-results">
                <h3>No matching suggestions found.</h3>
                <p>Try increasing your budget or choosing another preference.</p>
            </div>
        `;
        return;
    }

    results.innerHTML = `
        <h2>Recommended Destinations</h2>
        <p>Based on your selected preferences:</p>

        <div class="prediction-grid">
            ${filtered.map(place => `
                <div class="prediction-card">
                    <span>${escapeHTML(place.region)}</span>
                    <h3>${escapeHTML(place.name)}</h3>
                    <p>${escapeHTML(place.description)}</p>
                    <p><strong>Estimated starting budget:</strong> ₱${formatPrice(place.price)}</p>
                    <p><strong>Suggested duration:</strong> ${days} days</p>
                    <button type="button"
                        onclick="chooseDestination('${escapeHTML(place.name)}','${place.region === "International" ? "international" : "local"}')">
                        Explore Destination
                    </button>
                </div>
            `).join("")}
        </div>
    `;
}

/* ================= INITIALIZE WEBSITE ================= */

document.addEventListener("DOMContentLoaded", function () {

    // Display the home page first
    showPage("home-page");

    // Display featured local destinations
    renderFeaturedDestinations();

    // Display international destinations
    renderInternationalDestinations();

    // Update shopping cart
    updateCart();

    // Set minimum dates
    [
        "booking-date",
        "arrival-date",
        "departure-date"
    ].forEach(id => {
        const field = document.getElementById(id);

        if (field) {
            field.min = today;
        }
    });

    // Close cart using Escape key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            closeCart();
        }
    });

    console.log("Puerto Princesa of Wonder website initialized successfully.");

});





/* ==========================================
   TOP DESTINATIONS CAROUSEL
========================================== */

let currentTopDestination = 0;

function changeTopDestination(direction) {

    const slides = document.querySelectorAll(
        "#topDestinationsCarousel .top-carousel-slide"
    );

    const counter = document.getElementById(
        "topCarouselCounter"
    );

    if (!slides.length) return;

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    currentTopDestination =
        (currentTopDestination + direction + slides.length)
        % slides.length;

    slides[currentTopDestination].classList.add("active");

    if (counter) {
        counter.textContent =
            `${currentTopDestination + 1} / ${slides.length}`;
    }
}



