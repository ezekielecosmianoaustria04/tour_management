document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ROOM DATA
    ========================================== */

    const rooms = [

        {
            name: "Standard Room",
            desc: "Quiet room with garden view.",
            price: 1800,
            image: "standard-room.jpg"
        },

        {
            name: "Deluxe Room",
            desc: "Bigger space with a work desk.",
            price: 2400,
            image: "deluxe-room.jpg"
        },

        {
            name: "Superior Room",
            desc: "High floor with city view.",
            price: 2700,
            image: "superior-room.jpg"
        },

        {
            name: "Family Room",
            desc: "Fits the whole family comfortably.",
            price: 3600,
            image: "family-room.jpg"
        },

        {
            name: "Junior Suite",
            desc: "Separate sitting area.",
            price: 4200,
            image: "junior-suite.jpg"
        },

        {
            name: "Executive Suite",
            desc: "Lounge access and breakfast.",
            price: 5200,
            image: "executive-suite.jpg"
        },

        {
            name: "Ocean View Room",
            desc: "Balcony facing the sea.",
            price: 4800,
            image: "ocean-view-room.jpg"
        },

        {
            name: "Garden Villa",
            desc: "Private garden and plunge pool.",
            price: 6500,
            image: "garden-villa.jpg"
        },

        {
            name: "Honeymoon Suite",
            desc: "Bathtub, candles, and late checkout.",
            price: 7200,
            image: "honeymoon-suite.jpg"
        },

        {
            name: "Presidential Suite",
            desc: "Two bedrooms, dining area, and butler.",
            price: 9800,
            image: "presidential-suite.jpg"
        },

        {
            name: "Penthouse",
            desc: "Top floor with a rooftop terrace.",
            price: 12000,
            image: "penthouse.jpg"
        }

    ];


    /* ==========================================
       BED DATA
    ========================================== */

    const beds = [

        { id: "single", label: "Single Bed", add: 500, width: 70 },

        { id: "double", label: "Double Size Bed", add: 700, width: 100 },

        { id: "full", label: "Full Size Bed", add: 800, width: 110 },

        { id: "queen", label: "Queen Size Bed", add: 1000, width: 130 },

        { id: "king", label: "King Size Bed", add: 1300, width: 150 },

        { id: "family", label: "Family Size Bed", add: 1600, width: 190 }

    ];


    /* ==========================================
       SETTINGS AND STATE
    ========================================== */

    const MAX_BEDS = 20;

    const MAX_ADDONS = 5;

    const DISCOUNT = 0.15;

    const state = {

        slide: 0,

        bed: "single",

        qty: 1,

        addons: [],

        rooms: 1

    };

    const $ = id => document.getElementById(id);

    const peso = amount => new Intl.NumberFormat("en-PH", {

        style: "currency",

        currency: "PHP",

        minimumFractionDigits: 0,

        maximumFractionDigits: 2

    }).format(amount);

    const getBed = id => beds.find(bed => bed.id === id);


    /* ==========================================
       HEADER - SAME AS HOMEPAGE
    ========================================== */

    const headerSearchToggle = $("headerSearchToggle");

    const headerSearchForm = $("headerSearchForm");

    const headerSearchInput = $("home-location-search");

    const headerSearchResults = $("home-search-results");

    const mobileMenuToggle = $("mobileMenuToggle");

    const mainNavigation = $("mainNavigation");

    const customerAccountButton = $("customerAccountButton");


    /* HEADER SEARCH DESTINATIONS */

    const destinations = [

        "Puerto Princesa",
        "El Nido",
        "Coron",
        "Palawan",
        "Port Barton",
        "Balabac",
        "Baguio",
        "Zambales",
        "Manila",
        "Batangas",
        "Tagaytay",
        "Cebu",
        "Bohol",
        "Boracay",
        "Davao",
        "Siargao",
        "Vietnam",
        "Japan"

    ].map(name => ({

        name,

        page: ["Vietnam", "Japan"].includes(name)

            ? "beyond-philippines.html"

            : "local-destinations.html"

    }));


    /* ==========================================
       TOGGLE SEARCH
    ========================================== */

    function toggleHeaderSearch(open) {

        headerSearchForm.hidden = !open;

        headerSearchToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        headerSearchToggle.querySelector("i").className =

            open ? "bi bi-x-lg" : "bi bi-search";

        if (open) {

            toggleMobileMenu(false);

            headerSearchInput.focus();

            renderHeaderResults();

        } else {

            headerSearchResults.style.display = "none";

        }

    }

    headerSearchToggle.addEventListener("click", () => {

        toggleHeaderSearch(headerSearchForm.hidden);

    });


    /* ==========================================
       MOBILE MENU
    ========================================== */

    function toggleMobileMenu(open) {

        mainNavigation.classList.toggle("open", open);

        mobileMenuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );

        mobileMenuToggle.querySelector("i").className =

            open ? "bi bi-x-lg" : "bi bi-list";

        if (open) {

            toggleHeaderSearch(false);

        }

    }

    mobileMenuToggle.addEventListener("click", () => {

        toggleMobileMenu(

            !mainNavigation.classList.contains("open")

        );

    });


    /* ==========================================
       LIVE HEADER SEARCH
    ========================================== */

    function renderHeaderResults() {

        const query = headerSearchInput.value

            .trim()

            .toLowerCase();

        headerSearchResults.replaceChildren();

        if (!query) {

            headerSearchResults.style.display = "none";

            return;

        }

        const matches = destinations.filter(destination =>

            destination.name.toLowerCase().includes(query)

        );

        headerSearchResults.style.display = "block";

        if (!matches.length) {

            const message = document.createElement("p");

            message.textContent = "No matching destinations.";

            message.style.padding = "12px";

            headerSearchResults.appendChild(message);

            return;

        }

        matches.forEach(destination => {

            const link = document.createElement("a");

            link.href = destination.page;

            link.textContent = destination.name;

            link.style.display = "block";

            link.style.padding = "12px";

            headerSearchResults.appendChild(link);

        });

    }

    headerSearchInput.addEventListener(

        "input",

        renderHeaderResults

    );

    headerSearchForm.addEventListener("submit", event => {

        event.preventDefault();

        const query = headerSearchInput.value

            .trim()

            .toLowerCase();

        if (!query) return;

        const exact = destinations.find(destination =>

            destination.name.toLowerCase() === query

        );

        const matches = destinations.filter(destination =>

            destination.name.toLowerCase().includes(query)

        );

        if (exact) {

            window.location.href = exact.page;

        } else if (matches.length === 1) {

            window.location.href = matches[0].page;

        } else {

            renderHeaderResults();

        }

    });


    /* ==========================================
       CLOSE SEARCH AND MOBILE MENU
    ========================================== */

    document.addEventListener("click", event => {

        if (!event.target.closest(".header-search-wrapper")) {

            toggleHeaderSearch(false);

        }

        if (!event.target.closest(".ppow-header")) {

            toggleMobileMenu(false);

        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            toggleHeaderSearch(false);

            toggleMobileMenu(false);

        }

    });


    /* ==========================================
       CUSTOMER ACCOUNT
    ========================================== */

    function updateCustomerAccount() {

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

                customerAccountButton.href =

                    "customer-account.html";

                customerAccountButton.title =

                    profile?.fullName ||

                    profile?.name ||

                    "Customer Account";

            } else {

                customerAccountButton.href = "login.html";

                customerAccountButton.title = "Login or Sign Up";

            }

        } catch (error) {

            customerAccountButton.href = "login.html";

        }

    }

    window.addEventListener(

        "pageshow",

        updateCustomerAccount

    );

    window.addEventListener(

        "storage",

        updateCustomerAccount

    );


    /* ==========================================
       ROOM SLIDER
    ========================================== */

    function renderSlide() {

        const room = rooms[state.slide];

        const art = $("slideArt");

        art.replaceChildren();

        const image = document.createElement("img");

        image.alt = room.name;

        image.addEventListener("error", () => {

            if (image.parentNode !== art) return;

            art.innerHTML = `

                <i class="bi bi-image"
                    aria-label="Room image unavailable">
                </i>

            `;

        });

        art.appendChild(image);

        image.src = room.image;

        $("roomName").textContent = room.name;

        $("roomDescription").textContent = room.desc;

        [...$("pagination").children].forEach((button, index) => {

            button.setAttribute(

                "aria-selected",

                String(index === state.slide)

            );

        });

        renderPrice();

    }


    /* ==========================================
       CHANGE ROOM
    ========================================== */

    function goTo(index) {

        state.slide =

            (index + rooms.length) % rooms.length;

        renderSlide();

    }

    $("prevBtn").addEventListener("click", () => {

        goTo(state.slide - 1);

    });

    $("nextBtn").addEventListener("click", () => {

        goTo(state.slide + 1);

    });


    /* ==========================================
       PAGINATION
    ========================================== */

    function buildPagination() {

        const pagination = $("pagination");

        pagination.replaceChildren();

        rooms.forEach((room, index) => {

            const button = document.createElement("button");

            button.type = "button";

            button.setAttribute("role", "tab");

            button.setAttribute(

                "aria-label",

                `Room ${index + 1}: ${room.name}`

            );

            button.addEventListener("click", () => {

                goTo(index);

            });

            pagination.appendChild(button);

        });

    }


    /* ==========================================
       KEYBOARD NAVIGATION
    ========================================== */

    document.addEventListener("keydown", event => {

        if (

            event.target.closest(
                "input, select, textarea, button, a"
            )

        ) return;

        if (event.key === "ArrowLeft") {

            goTo(state.slide - 1);

        }

        if (event.key === "ArrowRight") {

            goTo(state.slide + 1);

        }

    });


    /* ==========================================
       ROOM SEARCH
    ========================================== */

    function searchRoom() {

        const query = $("roomSearch").value

            .trim()

            .toLowerCase();

        const status = $("roomSearchStatus");

        if (!query) {

            status.textContent = "Enter a room type.";

            return;

        }

        const index = rooms.findIndex(room =>

            room.name.toLowerCase().includes(query)

        );

        if (index >= 0) {

            goTo(index);

            status.textContent =

                `${rooms[index].name} found.`;

            status.style.color = "#15803d";

        } else {

            status.textContent = "No matching room found.";

            status.style.color = "#dc2626";

        }

    }

    $("searchBtn").addEventListener("click", searchRoom);

    $("roomSearch").addEventListener("keydown", event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchRoom();

        }

    });


    /* ==========================================
       BUILD BED OPTIONS
    ========================================== */

    function buildBeds() {

        const select = $("bedSelect");

        select.replaceChildren();

        beds.forEach(bed => {

            select.add(new Option(bed.label, bed.id));

        });

        select.value = state.bed;

        select.addEventListener("change", () => {

            state.bed = select.value;

            renderBed();

            renderPrice();

        });

    }


    /* ==========================================
       MAIN BED QUANTITY
    ========================================== */

    function setQty(quantity) {

        state.qty = Math.min(

            MAX_BEDS,

            Math.max(1, quantity)

        );

        $("qty").textContent = state.qty;

        $("qtyMinus").disabled = state.qty <= 1;

        $("qtyPlus").disabled = state.qty >= MAX_BEDS;

        $("qtyMsg").textContent =

            state.qty >= MAX_BEDS

                ? `Maximum of ${MAX_BEDS} main beds.`

                : "";

        renderBed();

        renderPrice();

    }

    $("qtyMinus").addEventListener("click", () => {

        setQty(state.qty - 1);

    });

    $("qtyPlus").addEventListener("click", () => {

        setQty(state.qty + 1);

    });


    /* ==========================================
       ADD ANOTHER BED
    ========================================== */

    $("addBedBtn").addEventListener("click", () => {

        if (state.addons.length >= MAX_ADDONS) return;

        state.addons.push({

            bed: "single",

            qty: 1

        });

        renderAddons();

    });


    /* ==========================================
       RENDER ADD-ONS
    ========================================== */

    function renderAddons() {

        const list = $("addonList");

        list.replaceChildren();

        state.addons.forEach((addon, index) => {

            const row = document.createElement("div");

            row.className = "addon-item";

            row.innerHTML = `

                <div class="addon-item-head">

                    <strong>Additional Bed ${index + 1}</strong>

                    <button type="button"
                        class="remove-btn"
                        aria-label="Remove additional bed">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

                <div class="bed-row">

                    <label class="field">

                        <span>Bed Size</span>

                        <select class="addon-select">

                            ${beds.map(bed => `

                                <option value="${bed.id}"

                                    ${bed.id === addon.bed
                                        ? "selected"
                                        : ""}>

                                    ${bed.label} (+${peso(bed.add)})

                                </option>

                            `).join("")}

                        </select>

                    </label>

                    <div class="field">

                        <span>No. of Beds</span>

                        <div class="stepper">

                            <button type="button"
                                class="a-minus"
                                aria-label="Fewer extra beds">−</button>

                            <output>${addon.qty}</output>

                            <button type="button"
                                class="a-plus"
                                aria-label="More extra beds">+</button>

                        </div>

                    </div>

                </div>

                <p class="addon-cost"></p>

            `;

            const select = row.querySelector(".addon-select");

            const minus = row.querySelector(".a-minus");

            const plus = row.querySelector(".a-plus");

            const output = row.querySelector("output");

            const cost = row.querySelector(".addon-cost");

            const remove = row.querySelector(".remove-btn");


            function updateAddon() {

                output.textContent = addon.qty;

                minus.disabled = addon.qty <= 1;

                plus.disabled = addon.qty >= MAX_BEDS;

                cost.textContent =

                    `Additional cost: ${peso(
                        getBed(addon.bed).add * addon.qty
                    )}`;

                renderBed();

                renderPrice();

            }


            /* CHANGE ADDITIONAL BED SIZE */

            select.addEventListener("change", () => {

                addon.bed = select.value;

                updateAddon();

            });


            /* INCREASE ADDITIONAL BEDS */

            plus.addEventListener("click", () => {

                if (addon.qty < MAX_BEDS) {

                    addon.qty++;

                    updateAddon();

                }

            });


            /* DECREASE ADDITIONAL BEDS */

            minus.addEventListener("click", () => {

                if (addon.qty > 1) {

                    addon.qty--;

                    updateAddon();

                }

            });


            /* REMOVE ADDITIONAL BED */

            remove.addEventListener("click", () => {

                state.addons.splice(index, 1);

                renderAddons();

            });

            list.appendChild(row);

            updateAddon();

        });


        const addButton = $("addBedBtn");

        addButton.disabled =

            state.addons.length >= MAX_ADDONS;

        addButton.innerHTML = addButton.disabled

            ? `<i class="bi bi-check-circle"></i>
               Maximum Add-ons Reached`

            : `<i class="bi bi-plus-circle"></i>
               Add Another Bed`;

        renderBed();

        renderPrice();

    }


    /* ==========================================
       BED PREVIEW
    ========================================== */

    function renderBed() {

        const bed = getBed(state.bed);

        const width = bed.width;

        const x = (200 - width) / 2;

        const extraCount = state.addons.reduce(

            (sum, addon) => sum + addon.qty,

            0

        );

        $("bedPicture").innerHTML = `

            <svg viewBox="0 0 200 115"
                role="img"
                aria-label="${bed.label}">

                <rect x="${x}"
                    y="20"
                    width="${width}"
                    height="18"
                    rx="5"
                    fill="#2563eb"/>

                <rect x="${x + 4}"
                    y="38"
                    width="${width - 8}"
                    height="38"
                    rx="5"
                    fill="#ffffff"
                    stroke="#2563eb"
                    stroke-width="2"/>

                <rect x="${x + 10}"
                    y="42"
                    width="${Math.min(30, width / 3)}"
                    height="15"
                    rx="4"
                    fill="#facc15"/>

                <rect x="${x}"
                    y="76"
                    width="6"
                    height="16"
                    fill="#16365c"/>

                <rect x="${x + width - 6}"
                    y="76"
                    width="6"
                    height="16"
                    fill="#16365c"/>

                <text x="190"
                    y="15"
                    text-anchor="end"
                    font-size="15"
                    font-weight="bold"
                    fill="#2563eb">

                    × ${state.qty}

                </text>

            </svg>

            <div class="bed-preview-label">

                ${bed.label} × ${state.qty}

            </div>

            <div class="bed-preview-extra">

                ${extraCount > 0

                    ? `${extraCount} additional bed(s) selected`

                    : "No additional beds selected"

                }

            </div>

        `;

    }


    /* ==========================================
       PRICE COMPUTATION
    ========================================== */

    function addonCost() {

        return state.addons.reduce((sum, addon) => {

            return sum +

                getBed(addon.bed).add * addon.qty;

        }, 0);

    }

    function calculatePrice() {

        const base = rooms[state.slide].price;

        const mainExtra =

            Math.max(0, state.qty - 1) *

            getBed(state.bed).add;

        const extras = mainExtra + addonCost();

        const subtotal = base + extras;

        const discount = subtotal * DISCOUNT;

        const unit = subtotal - discount;

        const total = unit * state.rooms;

        return {

            base,

            extras,

            discount,

            unit,

            total

        };

    }


    /* ==========================================
       DISPLAY PRICE
    ========================================== */

    function renderPrice() {

        const amounts = calculatePrice();

        $("basePrice").textContent = peso(amounts.base);

        $("extraPrice").textContent = peso(amounts.extras);

        $("discountPrice").textContent =

            "−" + peso(amounts.discount);

        $("price").textContent = peso(amounts.unit);

        $("total").textContent = peso(amounts.total);

        const count = state.addons.reduce(

            (sum, addon) => sum + addon.qty,

            0

        );

        $("bedNote").textContent = count > 0

            ? `${count} additional bed(s): +${peso(
                addonCost()
            )} before discount.`

            : "Click Add Another Bed to customize your room.";

        $("roomsMsg").textContent = "";

    }


    /* ==========================================
       BOOKING INFORMATION
    ========================================== */

    $("bookBtn").addEventListener("click", () => {

        const room = rooms[state.slide];

        const amounts = calculatePrice();

        const bookingData = {

            roomName: room.name,

            roomImage: room.image,

            roomPrice: room.price,

            bedSize: getBed(state.bed).label,

            bedQuantity: state.qty,

            additionalBeds: state.addons.map(addon => ({

                bedSize: getBed(addon.bed).label,

                quantity: addon.qty,

                price: getBed(addon.bed).add

            })),

            numberOfRooms: state.rooms,

            extraPrice: amounts.extras,

            discount: amounts.discount,

            total: amounts.total,

            createdAt: new Date().toISOString()

        };

        try {

            localStorage.setItem(

                "ppowHotelBooking_v1",

                JSON.stringify(bookingData)

            );

            $("roomsMsg").style.color = "#15803d";

            $("roomsMsg").textContent =

                "Room selection saved successfully.";

            /*
            Uncomment when your booking page is ready:

            window.location.href = "booking-information.html";
            */

        } catch (error) {

            $("roomsMsg").style.color = "#dc2626";

            $("roomsMsg").textContent =

                "Unable to save your room selection.";

        }

    });


    /* ==========================================
       INITIALIZE
    ========================================== */

    $("roomTotal").textContent = rooms.length;

    buildPagination();

    buildBeds();

    renderSlide();

    setQty(1);

    renderAddons();

    updateCustomerAccount();

});