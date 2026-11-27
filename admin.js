"use strict";

const STORAGE_KEYS = {
  session: "ppowAdminLoggedIn_v3",
  tours: "ppowAdminPackages_v3",
  guests: "ppowGuestInformation_v3",
  inquiries: "ppowInquiries_v3",
};

const DEFAULT_TOURS = [
  {
    id: "t-1",
    category: "Tour Only",
    name: "Underground River Tour",
    destination: "Puerto Princesa",
    price: 2800,
    enabled: true,
    description:
      "Subterranean River National Park with licensed guide, boat transfer, and buffet lunch.",
  },
  {
    id: "t-2",
    category: "Tour Only",
    name: "Honda Bay Island Hopping",
    destination: "Puerto Princesa",
    price: 2300,
    enabled: true,
    description: "Cowrie Island, Luli Island, and Starfish Island boat tour.",
  },
  {
    id: "t-3",
    category: "Customized Trip",
    name: "Custom Palawan 4D3N Package",
    destination: "Palawan",
    price: 6500,
    enabled: true,
    description:
      "Flexible itinerary with private van transfers and hotel accommodation options.",
  },
  {
    id: "t-4",
    category: "Local Destination",
    name: "El Nido Island Hopping Tour A",
    destination: "El Nido",
    price: 1600,
    enabled: true,
    description:
      "Big Lagoon, Secret Lagoon, and Shimizu Island full-day boat tour.",
  },
  {
    id: "t-5",
    category: "Beyond the Philippines",
    name: "Seoul & Nami Island Getaway",
    destination: "South Korea",
    price: 24500,
    enabled: true,
    description:
      "4D3N international group tour with airport transfers and city guide.",
  },
];

const DEFAULT_GUESTS = [
  {
    Id: 1,
    Fullname: "Maria Santos",
    Birthdate: "1996-04-14",
    Email: "maria.santos@email.com",
    Contact_no: "0917-410-2219",
    Passport_no: "P8912345B",
    Flight_no: "5J-637",
    Flight_photo: "maria_flight_5j637.jpg",
    Valid_id: "Philippine Passport",
    Status: "Confirmed",
    Bookinginformation_id: 101,
    category: "Tour Only",
    tourPackage: "Underground River Tour",
    destination: "Puerto Princesa",
    hotelName: "Puerto Princesa Bayfront Hotel",
    hotelRoom: "Deluxe Twin Room (3D2N)",
    guests: 3,
    bookingDate: "Nov 25, 2026",
    amount: 8400,
    paymentMethod: "GCash",
  },
  {
    Id: 2,
    Fullname: "Juan Dela Cruz",
    Birthdate: "1992-09-21",
    Email: "juan.dc@email.com",
    Contact_no: "0918-882-1044",
    Passport_no: "P5521098A",
    Flight_no: "PR-2785",
    Flight_photo: "juan_flight_pr2785.jpg",
    Valid_id: "UMID / Driver License",
    Status: "Pending",
    Bookinginformation_id: 102,
    category: "Customized Trip",
    tourPackage: "Custom Palawan 4D3N Package",
    destination: "Palawan",
    hotelName: "El Nido Lagoon Cove Resort",
    hotelRoom: "Superior Lagoon View (4D3N)",
    guests: 2,
    bookingDate: "Nov 22, 2026",
    amount: 13000,
    paymentMethod: "Bank Transfer",
  },
  {
    Id: 3,
    Fullname: "Ana Reyes",
    Birthdate: "1998-11-05",
    Email: "ana.reyes@email.com",
    Contact_no: "0920-334-9901",
    Passport_no: "P3412987C",
    Flight_no: "Z2-422",
    Flight_photo: "ana_flight_z2422.jpg",
    Valid_id: "National ID (PhilSys)",
    Status: "Processing",
    Bookinginformation_id: 103,
    category: "Local Destination",
    tourPackage: "El Nido Island Hopping Tour A",
    destination: "El Nido",
    hotelName: "Port Barton Coastal Cottages",
    hotelRoom: "Garden Bungalow (3D2N)",
    guests: 4,
    bookingDate: "Nov 18, 2026",
    amount: 35600,
    paymentMethod: "GCash",
  },
  {
    Id: 4,
    Fullname: "Carlos Mendoza",
    Birthdate: "1989-02-19",
    Email: "carlos.m@email.com",
    Contact_no: "0915-770-4820",
    Passport_no: "P9011223D",
    Flight_no: "KE-624",
    Flight_photo: "carlos_flight_ke624.jpg",
    Valid_id: "Philippine Passport",
    Status: "Confirmed",
    Bookinginformation_id: 104,
    category: "Beyond the Philippines",
    tourPackage: "Seoul & Nami Island Getaway",
    destination: "South Korea",
    hotelName: "Myeongdong Central Stay Hotel",
    hotelRoom: "Standard Double Room (4D3N)",
    guests: 2,
    bookingDate: "Nov 12, 2026",
    amount: 49000,
    paymentMethod: "Credit Card",
  },
];

const DEFAULT_INQUIRIES = [
  {
    id: "inq-1",
    name: "Juan Dela Cruz",
    contact: "juan.dc@email.com",
    message:
      "Can you recommend a 3-day Palawan family tour with private airport pick-up, child-friendly boat transfers in Honda Bay, and flexible meal options for senior citizens?",
    date: "Nov 25, 2026",
  },
  {
    id: "inq-2",
    name: "Maria Santos",
    contact: "maria.santos@email.com",
    message:
      "Is the Underground River booking rebookable if weather changes or coast guard suspends sea travel on our scheduled morning slot?",
    date: "Nov 22, 2026",
  },
  {
    id: "inq-3",
    name: "Carlos Mendoza",
    contact: "carlos.m@email.com",
    message:
      "Do you offer cooperative group discounts for 10 guests traveling together next month including hotel accommodation and van transfers?",
    date: "Nov 19, 2026",
  },
];

const DESTINATIONS_DATA = [
  {
    name: "Palawan",
    bookingsCount: 523,
    share: 88,
    color: "#2563eb",
    type: "Local Destination",
    image: "puerto-princesa-underground-river.jpg",
    note: "Underground River, Honda Bay, El Nido & Port Barton",
  },
  {
    name: "Puerto Princesa",
    bookingsCount: 412,
    share: 72,
    color: "#059669",
    type: "Local Destination",
    image: "puerto-princesa-honda-bay.jpg",
    note: "City tours, firefly watching & island hopping",
  },
  {
    name: "Port Barton",
    bookingsCount: 364,
    share: 62,
    color: "#0f766e",
    type: "Local Destination",
    image: "portbarton.jpg",
    note: "White sand beaches, turtle sanctuary & private island stops",
  },
  {
    name: "South Korea & Japan",
    bookingsCount: 198,
    share: 45,
    color: "#d97706",
    type: "Beyond the Philippines",
    image: "discover.jpg",
    note: "Seasonal international tour packages",
  },
];

const ACCOMMODATIONS_DATA = [
  {
    hotel: "Puerto Princesa Bayfront Hotel",
    location: "Puerto Princesa",
    room: "Deluxe Twin / Family Room",
    rate: 3200,
    status: "Confirmed",
  },
  {
    hotel: "El Nido Lagoon Cove Resort",
    location: "El Nido",
    room: "Superior Lagoon View",
    rate: 4500,
    status: "Confirmed",
  },
  {
    hotel: "Port Barton Coastal Cottages",
    location: "Port Barton",
    room: "Garden Bungalow",
    rate: 2600,
    status: "Pending",
  },
];

let currentTourCategoryFilter = "All";
let currentBookingSubTab = "guests";
let currentDestFilter = "All";
const expandedInquiryIds = new Set();
const expandedGuestDetailsIds = new Set();

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

function getTours() {
  const data = readLS(STORAGE_KEYS.tours, null);
  if (!Array.isArray(data) || data.length === 0) {
    writeLS(STORAGE_KEYS.tours, DEFAULT_TOURS);
    return [...DEFAULT_TOURS];
  }
  return data.map((item) => ({
    ...item,
    enabled: item.enabled !== false,
  }));
}

function getGuests() {
  const data = readLS(STORAGE_KEYS.guests, null);
  if (!Array.isArray(data) || data.length === 0) {
    writeLS(STORAGE_KEYS.guests, DEFAULT_GUESTS);
    return [...DEFAULT_GUESTS];
  }
  return data;
}

function getInquiries() {
  const data = readLS(STORAGE_KEYS.inquiries, null);
  if (!Array.isArray(data) || data.length === 0) {
    writeLS(STORAGE_KEYS.inquiries, DEFAULT_INQUIRIES);
    return [...DEFAULT_INQUIRIES];
  }
  return data;
}

function formatPeso(n) {
  return "\u20B1" + Number(n || 0).toLocaleString("en-PH");
}

function statusBadgeClass(status) {
  const s = String(status || "Pending").toLowerCase();
  if (s === "confirmed" || s === "approved") return "badge-confirmed";
  if (s === "processing") return "badge-processing";
  return "badge-pending";
}

function syncTourCategorySelection(category) {
  currentTourCategoryFilter = category || "All";

  document.querySelectorAll("#tourCategoryTabs .pill-tab").forEach((tab) => {
    tab.classList.toggle(
      "active",
      tab.dataset.tourCat === currentTourCategoryFilter,
    );
  });

  document
    .querySelectorAll('.nav-subitem[data-view="tours"]')
    .forEach((sub) => {
      sub.classList.toggle(
        "active",
        sub.dataset.category === currentTourCategoryFilter,
      );
    });

  const labelEl = document.getElementById("activeTourCategoryLabel");
  if (labelEl) {
    labelEl.textContent =
      currentTourCategoryFilter === "All"
        ? "Tour Only"
        : currentTourCategoryFilter;
  }
}

function switchView(viewName) {
  document
    .querySelectorAll(".dashboard-main, .sub-module-view")
    .forEach((sec) => {
      sec.hidden = sec.id !== `view-${viewName}`;
    });

  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  document.getElementById("adminSidebar")?.classList.remove("mobile-open");
  renderAllSubViews();
}

function setAuthUnlocked(unlocked) {
  const gate = document.getElementById("adminAuthGate");
  const shell = document.getElementById("adminShell");
  writeLS(STORAGE_KEYS.session, Boolean(unlocked));

  if (gate) gate.hidden = Boolean(unlocked);
  if (shell) shell.hidden = !unlocked;

  if (unlocked) {
    renderDashboard();
    renderAllSubViews();
  }
}

/* =========================================================
   CHARTS
========================================================= */
function renderBookingLineChart(rangeMode = "6m") {
  const wrap = document.getElementById("bookingLineChartWrap");
  if (!wrap) return;

  const datasets = {
    "6m": {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      bookings: [180, 330, 290, 395, 480, 580],
      earnings: [270, 440, 395, 515, 610, 710],
    },
    "3m": {
      labels: ["Sep", "Oct", "Nov"],
      bookings: [395, 480, 580],
      earnings: [515, 610, 710],
    },
    ytd: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      bookings: [210, 355, 320, 430, 510, 625],
      earnings: [300, 465, 420, 540, 645, 750],
    },
  };

  const d = datasets[rangeMode] || datasets["6m"];
  const width = 560;
  const height = 220;
  const padL = 44;
  const padR = 20;
  const padT = 16;
  const padB = 30;
  const maxVal = 800;

  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const stepX = d.labels.length > 1 ? plotW / (d.labels.length - 1) : plotW;

  const toX = (idx) => padL + idx * stepX;
  const toY = (val) => padT + plotH - (Math.min(val, maxVal) / maxVal) * plotH;

  let gridSvg = "";
  [0, 200, 400, 600, 800].forEach((tick) => {
    const y = toY(tick);
    gridSvg += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e5e7eb" stroke-dasharray="4 4"/>`;
    gridSvg += `<text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7280">${tick}</text>`;
  });

  const xLabelsSvg = d.labels
    .map(
      (lbl, i) =>
        `<text x="${toX(i)}" y="${height - 8}" text-anchor="middle" font-size="11.5" fill="#4b5563">${lbl}</text>`,
    )
    .join("");

  const earnPts = d.earnings.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const bookPts = d.bookings.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  const earnDots = d.earnings
    .map(
      (v, i) => `<circle cx="${toX(i)}" cy="${toY(v)}" r="4" fill="#059669"/>`,
    )
    .join("");
  const bookDots = d.bookings
    .map(
      (v, i) => `<circle cx="${toX(i)}" cy="${toY(v)}" r="4" fill="#2563eb"/>`,
    )
    .join("");

  wrap.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Booking and earnings overview">
      ${gridSvg}
      ${xLabelsSvg}
      <polyline fill="none" stroke="#059669" stroke-width="2.5" points="${earnPts}"/>
      <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="${bookPts}"/>
      ${earnDots}
      ${bookDots}
    </svg>
  `;
}

function renderPaymentDonut(period = "month") {
  const wrap = document.getElementById("paymentDonutWrap");
  const listEl = document.getElementById("paymentBreakdownList");
  if (!wrap || !listEl) return;

  const slices =
    period === "quarter"
      ? [
          { label: "GCash", pct: 48, color: "#2563eb" },
          { label: "Bank Transfer", pct: 28, color: "#059669" },
          { label: "Credit Card", pct: 15, color: "#d97706" },
          { label: "Others", pct: 9, color: "#4f46e5" },
        ]
      : [
          { label: "GCash", pct: 45, color: "#2563eb" },
          { label: "Bank Transfer", pct: 30, color: "#059669" },
          { label: "Credit Card", pct: 15, color: "#d97706" },
          { label: "Others", pct: 10, color: "#4f46e5" },
        ];

  const totalPeso = getGuests().reduce(
    (sum, g) => sum + Number(g.amount || 0),
    0,
  );

  const cx = 75;
  const cy = 75;
  const r = 52;
  const circumference = 2 * Math.PI * r;
  let offsetAcc = 0;

  const circlesSvg = slices
    .map((s) => {
      const dash = (s.pct / 100) * circumference;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="16" stroke-dasharray="${dash} ${circumference}" stroke-dashoffset="${-offsetAcc}" transform="rotate(-90 ${cx} ${cy})"/>`;
      offsetAcc += dash;
      return seg;
    })
    .join("");

  wrap.innerHTML = `
    <svg viewBox="0 0 150 150" role="img" aria-label="Payment overview">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f3f4f6" stroke-width="16"/>
      ${circlesSvg}
      <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-size="13" font-weight="800" fill="#111827">${formatPeso(totalPeso)}</text>
      <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="9.5" fill="#6b7280">Total Earnings</text>
    </svg>
  `;

  listEl.innerHTML = slices
    .map(
      (s) => `
      <li class="payment-legend-item">
        <span class="payment-legend-left">
          <i class="payment-legend-dot" style="background:${s.color}"></i>
          <span>${s.label}</span>
        </span>
        <strong>${s.pct}%</strong>
      </li>
    `,
    )
    .join("");
}

/* =========================================================
   DASHBOARD OVERVIEW RENDER
========================================================= */
function renderDashboard() {
  const tours = getTours();
  const guests = getGuests();
  const inquiries = getInquiries();

  const activeTours = tours.filter((t) => t.enabled);
  const totalEarnings = guests.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0,
  );
  const pendingItems = guests.filter((g) => g.Status === "Pending");

  const currentMonthShort = new Date().toLocaleDateString("en-US", {
    month: "short",
  });
  const thisMonthBookings = guests.filter((g) =>
    String(g.bookingDate || "")
      .toLowerCase()
      .includes(currentMonthShort.toLowerCase()),
  ).length;

  const beyondCount =
    tours.filter((t) => t.category === "Beyond the Philippines" && t.enabled)
      .length +
    guests.filter((g) => g.category === "Beyond the Philippines").length;

  const localCount =
    tours.filter((t) => t.category === "Local Destination" && t.enabled)
      .length + guests.filter((g) => g.category === "Local Destination").length;

  const customizedCount =
    tours.filter((t) => t.category === "Customized Trip" && t.enabled).length +
    guests.filter((g) => g.category === "Customized Trip").length;

  const tourOnlyCount =
    tours.filter((t) => t.category === "Tour Only" && t.enabled).length +
    guests.filter((g) => g.category === "Tour Only").length;

  document.getElementById("kpiTotalCustomers").textContent = (
    1241 + guests.length
  ).toLocaleString("en-PH");
  document.getElementById("kpiTotalBookings").textContent = (
    374 + guests.length
  ).toLocaleString("en-PH");
  document.getElementById("kpiTotalEarnings").textContent = formatPeso(
    679950 + totalEarnings,
  );
  document.getElementById("kpiTotalTours").textContent = String(
    37 + activeTours.length,
  );

  document.getElementById("kpiCountBeyond").textContent = String(beyondCount);
  document.getElementById("kpiCountLocal").textContent = String(localCount);
  document.getElementById("kpiCountCustomized").textContent =
    String(customizedCount);
  document.getElementById("kpiCountTourOnly").textContent =
    String(tourOnlyCount);

  const monthEl = document.getElementById("bookingsThisMonthValue");
  if (monthEl) monthEl.textContent = String(thisMonthBookings || guests.length);

  // Notifications
  const badgeEl = document.getElementById("notifBadgeCount");
  const notifList = document.getElementById("notifList");
  if (badgeEl) badgeEl.textContent = String(pendingItems.length);
  if (notifList) {
    notifList.innerHTML =
      pendingItems.length > 0
        ? pendingItems
            .map(
              (p) =>
                `<li><strong>${p.Fullname}</strong> &mdash; ${p.tourPackage || p.category} (${p.destination})</li>`,
            )
            .join("")
        : "<li>No pending guest records right now.</li>";
  }

  // Top Destinations
  const topDestEl = document.getElementById("topDestinationsList");
  if (topDestEl) {
    topDestEl.innerHTML = DESTINATIONS_DATA.slice(0, 3)
      .map(
        (d) => `
        <div class="top-dest-item">
          <img src="${d.image}" alt="${d.name}" onerror="this.src='discover.jpg'">
          <div class="top-dest-meta">
            <strong>${d.name}</strong>
            <span>${d.bookingsCount} Bookings</span>
            <div class="dest-progress-track">
              <div class="dest-progress-fill" style="width:${d.share}%; background:${d.color};"></div>
            </div>
          </div>
        </div>
      `,
      )
      .join("");
  }

  // Recent Guest Bookings
  const recentBookTbody = document.getElementById("recentBookingsTbody");
  if (recentBookTbody) {
    recentBookTbody.innerHTML = guests
      .slice(0, 5)
      .map(
        (g) => `
        <tr>
          <td>#${g.Id}</td>
          <td><strong>${g.Fullname}</strong></td>
          <td>${g.tourPackage || g.category || "Tour Only"}</td>
          <td>${g.destination || "Puerto Princesa"}</td>
          <td>${g.Bookinginformation_id}</td>
          <td><span class="badge-pill ${statusBadgeClass(g.Status)}">${g.Status}</span></td>
        </tr>
      `,
      )
      .join("");
  }

  // Recent Inquiries with Arrow Down expand button
  const recentInqTbody = document.getElementById("recentInquiriesTbody");
  if (recentInqTbody) {
    recentInqTbody.innerHTML = inquiries
      .slice(0, 4)
      .map((q, idx) => {
        const isOpen = expandedInquiryIds.has(`dash-${q.id}`);
        return `
          <tr>
            <td>${idx + 1}.</td>
            <td><strong>${q.name}</strong></td>
            <td class="${isOpen ? "msg-cell-expanded" : "msg-cell-clamped"}">${q.message}</td>
            <td>
              <button
                type="button"
                class="arrow-expand-btn ${isOpen ? "is-open" : ""}"
                data-toggle-inq="dash-${q.id}"
                title="Expand or collapse message"
                aria-label="Toggle message"
              >&#9662;</button>
            </td>
            <td>${q.date}</td>
          </tr>
        `;
      })
      .join("");
  }

  renderBookingLineChart(
    document.getElementById("overviewRangeSelect")?.value || "6m",
  );
  renderPaymentDonut(
    document.getElementById("paymentPeriodSelect")?.value || "month",
  );
}

/* =========================================================
   TOURS CRUD (AUTO-FILTER & AUTO-CATEGORY, ONLY 4 FORM INPUTS)
========================================================= */
function renderToursCrud() {
  const tbody = document.getElementById("toursCrudTbody");
  if (!tbody) return;

  const q = (document.getElementById("tourSearchInput")?.value || "")
    .trim()
    .toLowerCase();
  const list = getTours().filter((t) => {
    const catOk =
      currentTourCategoryFilter === "All" ||
      t.category === currentTourCategoryFilter;
    const qOk =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  tbody.innerHTML =
    list.length > 0
      ? list
          .map(
            (t) => `
          <tr class="${t.enabled ? "" : "row-disabled"}">
            <td>
              <strong>${t.name}</strong>
              <br><small style="color:#6b7280">${t.description}</small>
            </td>
            <td><strong>${t.category}</strong></td>
            <td>${t.destination}</td>
            <td><strong>${formatPeso(t.price)}</strong></td>
            <td>
              <span class="badge-pill ${t.enabled ? "badge-confirmed" : "badge-disabled"}">
                ${t.enabled ? "Enabled" : "Disabled"}
              </span>
            </td>
            <td>
              <div class="action-mini-group">
                <button type="button" class="mini-btn-edit" data-edit-tour="${t.id}">Edit</button>
                <button
                  type="button"
                  class="${t.enabled ? "mini-btn-toggle-disable" : "mini-btn-toggle-enable"}"
                  data-toggle-tour="${t.id}"
                >
                  ${t.enabled ? "Disable" : "Enable"}
                </button>
              </div>
            </td>
          </tr>
        `,
          )
          .join("")
      : `<tr><td colspan="6" style="color:#6b7280">No tour packages found under <strong>${currentTourCategoryFilter}</strong>.</td></tr>`;
}

/* =========================================================
   GUEST INFORMATION MODULE (WITH EXPANDABLE CUSTOMER DETAILS)
========================================================= */
function renderBookingsModule() {
  const thead = document.getElementById("bookingsDynamicThead");
  const tbody = document.getElementById("bookingsDynamicTbody");
  const heading = document.getElementById("bookingSubHeading");
  if (!thead || !tbody) return;

  const statusFilter =
    document.getElementById("bookingStatusFilterSelect")?.value || "All";
  const q = (document.getElementById("bookingTableSearch")?.value || "")
    .trim()
    .toLowerCase();

  const list = getGuests().filter((g) => {
    const stOk = statusFilter === "All" || g.Status === statusFilter;
    const qOk =
      !q ||
      String(g.Fullname || "")
        .toLowerCase()
        .includes(q) ||
      String(g.Email || "")
        .toLowerCase()
        .includes(q) ||
      String(g.Contact_no || "")
        .toLowerCase()
        .includes(q) ||
      String(g.Passport_no || "")
        .toLowerCase()
        .includes(q) ||
      String(g.Flight_no || "")
        .toLowerCase()
        .includes(q) ||
      String(g.tourPackage || "")
        .toLowerCase()
        .includes(q) ||
      String(g.hotelName || "")
        .toLowerCase()
        .includes(q);
    return stOk && qOk;
  });

  if (currentBookingSubTab === "payments") {
    if (heading) heading.textContent = "Guest Payment Collections & Status";
    thead.innerHTML = `
      <tr>
        <th>Id</th>
        <th>Fullname</th>
        <th>Tour Package</th>
        <th>Payment Method</th>
        <th>Earnings</th>
        <th>Status</th>
      </tr>
    `;
    tbody.innerHTML = list
      .map(
        (g) => `
        <tr>
          <td><strong>${g.Id}</strong></td>
          <td>${g.Fullname}</td>
          <td>${g.tourPackage || g.category || "Tour Package"}</td>
          <td>${g.paymentMethod || "GCash"}</td>
          <td><strong>${formatPeso(g.amount)}</strong></td>
          <td><span class="badge-pill ${statusBadgeClass(g.Status)}">${g.Status}</span></td>
        </tr>
      `,
      )
      .join("");
    return;
  }

  if (heading) heading.textContent = "Guest Information Management";
  thead.innerHTML = `
    <tr>
      <th>Id</th>
      <th>Fullname</th>
      <th>Birthdate</th>
      <th>Email &amp; Contact_no</th>
      <th>Passport_no</th>
      <th>Flight_no &amp; Flight_photo</th>
      <th>Valid_id</th>
      <th>Customer Details</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  `;

  tbody.innerHTML =
    list.length > 0
      ? list
          .map((g) => {
            const isOpen = expandedGuestDetailsIds.has(Number(g.Id));
            return `
            <tr>
              <td><strong>${g.Id}</strong></td>
              <td><strong>${g.Fullname}</strong></td>
              <td>${g.Birthdate || "N/A"}</td>
              <td>${g.Email}<br><small style="color:#6b7280">${g.Contact_no}</small></td>
              <td>${g.Passport_no || "N/A"}</td>
              <td>${g.Flight_no || "N/A"}<br><small style="color:#6b7280">${g.Flight_photo || "No file"}</small></td>
              <td>${g.Valid_id || "N/A"}</td>
              <td class="cust-details-cell">
                <div class="cust-details-summary">
                  <strong>${g.tourPackage || g.category || "Tour Package"}</strong>
                  <button
                    type="button"
                    class="arrow-expand-btn ${isOpen ? "is-open" : ""}"
                    data-toggle-guest-details="${g.Id}"
                    title="View Tour, Hotel Accommodation, and Booking Info"
                    aria-label="Expand customer details"
                  >&#9662;</button>
                </div>
                ${
                  isOpen
                    ? `
                  <div class="cust-details-drawer">
                    <div class="detail-block-item">
                      <span class="detail-block-title">1. Tour</span>
                      <span class="detail-block-text">${g.tourPackage || "Standard Tour"} (${g.category || "Tour Only"} &mdash; ${g.destination || "Puerto Princesa"})</span>
                    </div>
                    <div class="detail-block-item">
                      <span class="detail-block-title">2. Hotel Accommodation</span>
                      <span class="detail-block-text">${g.hotelName || "Partner Hotel"} &bull; ${g.hotelRoom || "Standard Room"}</span>
                    </div>
                    <div class="detail-block-item">
                      <span class="detail-block-title">3. Booking Info</span>
                      <span class="detail-block-text">Date: ${g.bookingDate || "Nov 2026"} &bull; ${g.guests || 1} pax &bull; ${formatPeso(g.amount)} (${g.paymentMethod || "GCash"})</span>
                    </div>
                  </div>
                `
                    : ""
                }
              </td>
              <td><span class="badge-pill ${statusBadgeClass(g.Status)}">${g.Status}</span></td>
              <td>
                <div class="action-mini-group">
                  ${g.Status !== "Confirmed" ? `<button type="button" class="mini-btn-ok" data-approve-guest="${g.Id}">Confirm</button>` : ""}
                  <button type="button" class="mini-btn-del" data-del-guest="${g.Id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
          })
          .join("")
      : `<tr><td colspan="10" style="color:#6b7280">No guest information records found.</td></tr>`;
}

/* =========================================================
   REPORTS MODULE
========================================================= */
function renderReportsModule() {
  const guests = getGuests();
  const totalEarnings = guests.reduce((s, g) => s + Number(g.amount || 0), 0);
  const confirmedEarnings = guests
    .filter((g) => g.Status === "Confirmed")
    .reduce((s, g) => s + Number(g.amount || 0), 0);
  const pendingEarnings = guests
    .filter((g) => g.Status !== "Confirmed")
    .reduce((s, g) => s + Number(g.amount || 0), 0);
  const avgVal = guests.length ? Math.round(totalEarnings / guests.length) : 0;

  document.getElementById("repConfirmedEarnings").textContent =
    formatPeso(confirmedEarnings);
  document.getElementById("repPendingEarnings").textContent =
    formatPeso(pendingEarnings);
  document.getElementById("repAvgBooking").textContent = formatPeso(avgVal);
  document.getElementById("repTotalPax").textContent = String(guests.length);

  const categories = [
    "Tour Only",
    "Customized Trip",
    "Local Destination",
    "Beyond the Philippines",
  ];
  const catTbody = document.getElementById("reportCategoryTbody");
  if (catTbody) {
    catTbody.innerHTML = categories
      .map((cat) => {
        const rows = guests.filter((g) => g.category === cat);
        const amt = rows.reduce((s, g) => s + Number(g.amount || 0), 0);
        const pct =
          totalEarnings > 0 ? Math.round((amt / totalEarnings) * 100) : 0;
        return `
          <tr>
            <td><strong>${cat}</strong></td>
            <td>${rows.length}</td>
            <td><strong>${formatPeso(amt)}</strong></td>
            <td>${pct}%</td>
          </tr>
        `;
      })
      .join("");
  }

  const methods = ["GCash", "Bank Transfer", "Credit Card", "Others"];
  const payTbody = document.getElementById("reportPaymentTbody");
  if (payTbody) {
    payTbody.innerHTML = methods
      .map((m) => {
        const rows = guests.filter((g) => (g.paymentMethod || "GCash") === m);
        const amt = rows.reduce((s, g) => s + Number(g.amount || 0), 0);
        return `
          <tr>
            <td><strong>${m}</strong></td>
            <td>${rows.length}</td>
            <td><strong>${formatPeso(amt)}</strong></td>
          </tr>
        `;
      })
      .join("");
  }

  const ledgerTbody = document.getElementById("reportLedgerTbody");
  if (ledgerTbody) {
    ledgerTbody.innerHTML = guests
      .map(
        (g) => `
        <tr>
          <td><strong>${g.Id}</strong></td>
          <td>${g.Bookinginformation_id}</td>
          <td>${g.Fullname}</td>
          <td>${g.category || "Tour Only"}</td>
          <td>${g.destination || "Puerto Princesa"}</td>
          <td>${g.paymentMethod || "GCash"}</td>
          <td><span class="badge-pill ${statusBadgeClass(g.Status)}">${g.Status}</span></td>
          <td><strong>${formatPeso(g.amount)}</strong></td>
        </tr>
      `,
      )
      .join("");
  }
}

function exportReportToCsv() {
  const guests = getGuests();
  const headers = [
    "Id",
    "Fullname",
    "Birthdate",
    "Email",
    "Contact_no",
    "Passport_no",
    "Flight_no",
    "Flight_photo",
    "Valid_id",
    "Tour_Package",
    "Category",
    "Destination",
    "Hotel_Accommodation",
    "Room_Option",
    "Guests_Pax",
    "Payment_Method",
    "Status",
    "Earnings",
  ];
  const lines = [headers.join(",")];

  guests.forEach((g) => {
    const row = [
      g.Id,
      `"${g.Fullname}"`,
      `"${g.Birthdate || ""}"`,
      `"${g.Email || ""}"`,
      `"${g.Contact_no || ""}"`,
      `"${g.Passport_no || ""}"`,
      `"${g.Flight_no || ""}"`,
      `"${g.Flight_photo || ""}"`,
      `"${g.Valid_id || ""}"`,
      `"${g.tourPackage || ""}"`,
      `"${g.category || ""}"`,
      `"${g.destination || ""}"`,
      `"${g.hotelName || ""}"`,
      `"${g.hotelRoom || ""}"`,
      g.guests || 1,
      `"${g.paymentMethod || "GCash"}"`,
      g.Status,
      Number(g.amount || 0),
    ];
    lines.push(row.join(","));
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PPW-GuestInformation-Report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================
   OTHER SUB-VIEWS (INCLUDING INQUIRIES WITH ARROW DOWN)
========================================================= */
function renderDestinationsGrid() {
  const grid = document.getElementById("destinationsCardsGrid");
  if (!grid) return;
  const items = DESTINATIONS_DATA.filter(
    (d) => currentDestFilter === "All" || d.type === currentDestFilter,
  );
  grid.innerHTML = items
    .map(
      (d) => `
      <article class="dest-card">
        <img src="${d.image}" alt="${d.name}" onerror="this.src='discover.jpg'">
        <div class="dest-card-body">
          <span class="module-eyebrow">${d.type}</span>
          <h3>${d.name}</h3>
          <p>${d.note}</p>
          <strong>${d.bookingsCount} Bookings</strong>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderAccommodations() {
  const tbody = document.getElementById("accommodationsTbody");
  if (!tbody) return;
  tbody.innerHTML = ACCOMMODATIONS_DATA.map(
    (a) => `
      <tr>
        <td><strong>${a.hotel}</strong></td>
        <td>${a.location}</td>
        <td>${a.room}</td>
        <td><strong>${formatPeso(a.rate)}</strong></td>
        <td><span class="badge-pill ${statusBadgeClass(a.status)}">${a.status}</span></td>
      </tr>
    `,
  ).join("");
}

function renderAllInquiries() {
  const tbody = document.getElementById("allInquiriesTbody");
  if (!tbody) return;
  tbody.innerHTML = getInquiries()
    .map((q, i) => {
      const isOpen = expandedInquiryIds.has(`full-${q.id}`);
      return `
        <tr>
          <td>${i + 1}.</td>
          <td><strong>${q.name}</strong></td>
          <td>${q.contact || "Customer"}</td>
          <td class="${isOpen ? "msg-cell-expanded" : "msg-cell-clamped"}">${q.message}</td>
          <td>
            <button
              type="button"
              class="arrow-expand-btn ${isOpen ? "is-open" : ""}"
              data-toggle-inq="full-${q.id}"
              title="Expand or collapse message"
              aria-label="Toggle message"
            >&#9662;</button>
          </td>
          <td>${q.date}</td>
          <td><button type="button" class="mini-btn-del" data-del-inq="${q.id}">Remove</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderAllSubViews() {
  renderToursCrud();
  renderBookingsModule();
  renderReportsModule();
  renderDestinationsGrid();
  renderAccommodations();
  renderAllInquiries();
}

/* =========================================================
   EVENT LISTENERS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  // Sidebar accordion toggles
  document.querySelectorAll(".nav-group-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest(".nav-group")?.classList.toggle("open");
    });
  });

  // Main nav items
  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  // Sub-nav items
  document.querySelectorAll(".nav-subitem").forEach((sub) => {
    sub.addEventListener("click", () => {
      const targetView = sub.dataset.view;
      if (sub.dataset.category) {
        syncTourCategorySelection(sub.dataset.category);
      }
      if (sub.dataset.bookingTab) {
        currentBookingSubTab = sub.dataset.bookingTab;
        document.querySelectorAll("#bookingSubTabs .pill-tab").forEach((p) => {
          p.classList.toggle("active", p.dataset.bsub === currentBookingSubTab);
        });
      }
      if (sub.dataset.destTab) {
        currentDestFilter = sub.dataset.destTab;
        document.querySelectorAll("#destFilterTabs .pill-tab").forEach((p) => {
          p.classList.toggle(
            "active",
            p.dataset.destFilter === currentDestFilter,
          );
        });
      }
      switchView(targetView);
    });
  });

  // Card jump shortcuts
  document.querySelectorAll("[data-jump-view]").forEach((el) => {
    el.addEventListener("click", () => switchView(el.dataset.jumpView));
  });
  document.querySelectorAll("[data-jump-tourcat]").forEach((el) => {
    el.addEventListener("click", () => {
      syncTourCategorySelection(el.dataset.jumpTourcat);
      switchView("tours");
    });
  });

  // Mobile sidebar
  document
    .getElementById("mobileSidebarOpen")
    ?.addEventListener("click", () => {
      document.getElementById("adminSidebar")?.classList.add("mobile-open");
    });
  document
    .getElementById("mobileSidebarClose")
    ?.addEventListener("click", () => {
      document.getElementById("adminSidebar")?.classList.remove("mobile-open");
    });

  // Notifications
  document.getElementById("notifToggleBtn")?.addEventListener("click", () => {
    const pop = document.getElementById("notifPopover");
    if (pop) pop.hidden = !pop.hidden;
  });
  document
    .getElementById("clearNotifViewBtn")
    ?.addEventListener("click", () => {
      const pop = document.getElementById("notifPopover");
      if (pop) pop.hidden = true;
      document.getElementById("bookingStatusFilterSelect").value = "Pending";
      switchView("bookings");
    });

  // Chart selects
  document
    .getElementById("overviewRangeSelect")
    ?.addEventListener("change", (e) => {
      renderBookingLineChart(e.target.value);
    });
  document
    .getElementById("paymentPeriodSelect")
    ?.addEventListener("change", (e) => {
      renderPaymentDonut(e.target.value);
    });

  // Quick actions
  const dlg = document.getElementById("quickActionDialog");
  document
    .getElementById("qaCreateBookingBtn")
    ?.addEventListener("click", () => dlg?.showModal());
  document
    .getElementById("openNewBookingModalBtn")
    ?.addEventListener("click", () => dlg?.showModal());
  document
    .getElementById("closeDialogBtn")
    ?.addEventListener("click", () => dlg?.close());
  document
    .getElementById("cancelDialogBtn")
    ?.addEventListener("click", () => dlg?.close());

  document.getElementById("qaAddTourBtn")?.addEventListener("click", () => {
    switchView("tours");
    document.getElementById("tourDestInput")?.focus();
  });
  document
    .getElementById("qaOpenReportsBtn")
    ?.addEventListener("click", () => switchView("reports"));

  // Save Guest Information Modal
  document
    .getElementById("quickActionForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const Fullname = document.getElementById("gFullname")?.value.trim();
      const Birthdate = document.getElementById("gBirthdate")?.value || "";
      const Email = document.getElementById("gEmail")?.value.trim();
      const Contact_no = document.getElementById("gContactNo")?.value.trim();
      const Passport_no =
        document.getElementById("gPassportNo")?.value.trim() || null;
      const Flight_no =
        document.getElementById("gFlightNo")?.value.trim() || null;
      const Flight_photo =
        document.getElementById("gFlightPhoto")?.value.trim() || null;
      const Valid_id = document.getElementById("gValidId")?.value.trim() || "";

      const tourPackage =
        document.getElementById("gTourPackage")?.value.trim() ||
        "Underground River Tour";
      const category =
        document.getElementById("gTourCategory")?.value || "Tour Only";
      const destination =
        document.getElementById("gDestLabel")?.value.trim() ||
        "Puerto Princesa";

      const hotelName =
        document.getElementById("gHotelName")?.value.trim() ||
        "Puerto Princesa Bayfront Hotel";
      const hotelRoom =
        document.getElementById("gHotelRoom")?.value.trim() ||
        "Deluxe Twin Room";

      const guests = Number(document.getElementById("gPax")?.value || 2);
      const amount = Number(document.getElementById("gAmount")?.value || 2800);
      const paymentMethod =
        document.getElementById("gPaymentMethod")?.value || "GCash";
      const Status = document.getElementById("gStatus")?.value || "Pending";

      if (Fullname) {
        const list = getGuests();
        const nextId =
          list.reduce((max, item) => Math.max(max, Number(item.Id || 0)), 0) +
          1;
        const today = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        list.unshift({
          Id: nextId,
          Fullname,
          Birthdate,
          Email,
          Contact_no,
          Passport_no,
          Flight_no,
          Flight_photo,
          Valid_id,
          Status,
          Bookinginformation_id: 100 + nextId,
          category,
          tourPackage,
          destination,
          hotelName,
          hotelRoom,
          guests,
          bookingDate: today,
          amount,
          paymentMethod,
        });
        writeLS(STORAGE_KEYS.guests, list);
      }

      e.target.reset();
      dlg?.close();
      renderDashboard();
      renderAllSubViews();
    });

  // Tours Category Tabs & CRUD
  document.querySelectorAll("#tourCategoryTabs .pill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      syncTourCategorySelection(tab.dataset.tourCat);
      renderToursCrud();
    });
  });

  document
    .getElementById("tourSearchInput")
    ?.addEventListener("input", renderToursCrud);

  document.getElementById("tourCrudForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editingTourId").value;
    const destination = document.getElementById("tourDestInput").value.trim();
    const name = document.getElementById("tourNameInput").value.trim();
    const price = Number(document.getElementById("tourPriceInput").value);
    const description = document.getElementById("tourDescInput").value.trim();
    if (!name || !destination || !description) return;

    const assignedCategory =
      currentTourCategoryFilter === "All"
        ? "Tour Only"
        : currentTourCategoryFilter;
    const list = getTours();

    if (editId) {
      const idx = list.findIndex((x) => x.id === editId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], name, destination, price, description };
      }
    } else {
      list.unshift({
        id: "t-" + Date.now(),
        category: assignedCategory,
        name,
        destination,
        price,
        enabled: true,
        description,
      });
    }

    writeLS(STORAGE_KEYS.tours, list);
    document.getElementById("editingTourId").value = "";
    document.getElementById("tourFormHeading").textContent =
      "Add New Tour Package";
    document.getElementById("cancelTourEditBtn").hidden = true;
    e.target.reset();
    renderDashboard();
    renderToursCrud();
  });

  document
    .getElementById("cancelTourEditBtn")
    ?.addEventListener("click", () => {
      document.getElementById("editingTourId").value = "";
      document.getElementById("tourFormHeading").textContent =
        "Add New Tour Package";
      document.getElementById("cancelTourEditBtn").hidden = true;
      document.getElementById("tourCrudForm")?.reset();
    });

  document.getElementById("toursCrudTbody")?.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit-tour]");
    const toggleBtn = e.target.closest("[data-toggle-tour]");

    if (editBtn) {
      const pkg = getTours().find((x) => x.id === editBtn.dataset.editTour);
      if (!pkg) return;
      document.getElementById("editingTourId").value = pkg.id;
      document.getElementById("tourDestInput").value = pkg.destination;
      document.getElementById("tourNameInput").value = pkg.name;
      document.getElementById("tourPriceInput").value = pkg.price;
      document.getElementById("tourDescInput").value = pkg.description;
      document.getElementById("tourFormHeading").textContent =
        "Edit Tour Package";
      document.getElementById("cancelTourEditBtn").hidden = false;
    } else if (toggleBtn) {
      const updated = getTours().map((pkg) =>
        pkg.id === toggleBtn.dataset.toggleTour
          ? { ...pkg, enabled: !pkg.enabled }
          : pkg,
      );
      writeLS(STORAGE_KEYS.tours, updated);
      renderDashboard();
      renderToursCrud();
    }
  });

  // Guest Information sub-tabs, Customer Details drawer toggle, & status actions
  document.querySelectorAll("#bookingSubTabs .pill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentBookingSubTab = tab.dataset.bsub;
      document
        .querySelectorAll("#bookingSubTabs .pill-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderBookingsModule();
    });
  });

  document
    .getElementById("bookingStatusFilterSelect")
    ?.addEventListener("change", renderBookingsModule);
  document
    .getElementById("bookingTableSearch")
    ?.addEventListener("input", renderBookingsModule);

  document
    .getElementById("bookingsDynamicTbody")
    ?.addEventListener("click", (e) => {
      const expandBtn = e.target.closest("[data-toggle-guest-details]");
      const appBtn = e.target.closest("[data-approve-guest]");
      const delBtn = e.target.closest("[data-del-guest]");

      if (expandBtn) {
        const targetId = Number(expandBtn.dataset.toggleGuestDetails);
        if (expandedGuestDetailsIds.has(targetId)) {
          expandedGuestDetailsIds.delete(targetId);
        } else {
          expandedGuestDetailsIds.add(targetId);
        }
        renderBookingsModule();
      } else if (appBtn) {
        const targetId = Number(appBtn.dataset.approveGuest);
        const updated = getGuests().map((g) =>
          Number(g.Id) === targetId ? { ...g, Status: "Confirmed" } : g,
        );
        writeLS(STORAGE_KEYS.guests, updated);
        renderDashboard();
        renderAllSubViews();
      } else if (delBtn) {
        const targetId = Number(delBtn.dataset.delGuest);
        const updated = getGuests().filter((g) => Number(g.Id) !== targetId);
        writeLS(STORAGE_KEYS.guests, updated);
        renderDashboard();
        renderAllSubViews();
      }
    });

  // Arrow Down Expand/Collapse for Inquiries
  document.body.addEventListener("click", (e) => {
    const arrowBtn = e.target.closest("[data-toggle-inq]");
    if (!arrowBtn) return;
    const key = arrowBtn.dataset.toggleInq;
    if (expandedInquiryIds.has(key)) {
      expandedInquiryIds.delete(key);
    } else {
      expandedInquiryIds.add(key);
    }
    renderDashboard();
    renderAllInquiries();
  });

  // Reports export & print
  document
    .getElementById("exportReportCsvBtn")
    ?.addEventListener("click", exportReportToCsv);
  document
    .getElementById("printReportBtn")
    ?.addEventListener("click", () => window.print());

  // Destinations filter
  document.querySelectorAll("#destFilterTabs .pill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentDestFilter = tab.dataset.destFilter;
      document
        .querySelectorAll("#destFilterTabs .pill-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderDestinationsGrid();
    });
  });

  // Inquiries delete
  document
    .getElementById("allInquiriesTbody")
    ?.addEventListener("click", (e) => {
      const delBtn = e.target.closest("[data-del-inq]");
      if (!delBtn) return;
      const updated = getInquiries().filter(
        (q) => q.id !== delBtn.dataset.delInq,
      );
      writeLS(STORAGE_KEYS.inquiries, updated);
      renderDashboard();
      renderAllInquiries();
    });

  // Auth gate & Logout / Reset
  document.getElementById("adminGateForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = document.getElementById("gateEmail")?.value.trim().toLowerCase();
    const pw = document.getElementById("gatePassword")?.value.trim();
    const err = document.getElementById("gateError");
    if (em === "jeannyveve.cusi@yahoo.com" && pw === "admin123") {
      if (err) err.hidden = true;
      setAuthUnlocked(true);
    } else if (err) {
      err.textContent = "Invalid email or password.";
      err.hidden = false;
    }
  });

  document
    .getElementById("gateQuickBtn")
    ?.addEventListener("click", () => setAuthUnlocked(true));
  document
    .getElementById("sidebarLogoutBtn")
    ?.addEventListener("click", () => setAuthUnlocked(false));
  document
    .getElementById("settingsSignOutBtn")
    ?.addEventListener("click", () => setAuthUnlocked(false));

  document
    .getElementById("restoreAllDemoDataBtn")
    ?.addEventListener("click", () => {
      writeLS(STORAGE_KEYS.tours, DEFAULT_TOURS);
      writeLS(STORAGE_KEYS.guests, DEFAULT_GUESTS);
      writeLS(STORAGE_KEYS.inquiries, DEFAULT_INQUIRIES);
      renderDashboard();
      renderAllSubViews();
    });

  syncTourCategorySelection("All");
  const isLoggedIn = Boolean(readLS(STORAGE_KEYS.session, true));
  setAuthUnlocked(isLoggedIn);
});
