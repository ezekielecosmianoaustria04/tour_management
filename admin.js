"use strict";

const STORAGE_KEYS = {
  session: "ppowAdminLoggedIn_v1",
  tours: "ppowAdminPackages_v1",
  bookings: "ppowBookings_v1",
  inquiries: "ppowInquiries_v1",
};

const DEFAULT_TOURS = [
  {
    id: "t-1",
    category: "Tour Only",
    scope: "Local Destination",
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
    scope: "Local Destination",
    name: "Honda Bay Island Hopping",
    destination: "Puerto Princesa",
    price: 2300,
    enabled: true,
    description: "Cowrie Island, Luli Island, and Starfish Island boat tour.",
  },
  {
    id: "t-3",
    category: "Tour Only",
    scope: "Local Destination",
    name: "El Nido Island Hopping Tour A",
    destination: "El Nido",
    price: 1600,
    enabled: true,
    description: "Big Lagoon, Secret Lagoon, and Shimizu Island.",
  },
  {
    id: "t-4",
    category: "Customize",
    scope: "Local Destination",
    name: "Custom Palawan 4D3N Package",
    destination: "Palawan",
    price: 6500,
    enabled: true,
    description:
      "Flexible itinerary with private van transfers and hotel options.",
  },
  {
    id: "t-5",
    category: "Trip Planner",
    scope: "Local Destination",
    name: "Drag-and-Drop Barkada Itinerary",
    destination: "Puerto Princesa & El Nido",
    price: 8900,
    enabled: true,
    description: "Multi-day customized trip planner package.",
  },
  {
    id: "t-6",
    category: "Tour Only",
    scope: "Beyond the Philippines",
    name: "Seoul & Nami Island Getaway",
    destination: "South Korea",
    price: 24500,
    enabled: true,
    description:
      "4D3N international group tour with airport transfers and city guide.",
  },
];

const DEFAULT_BOOKINGS = [
  {
    id: "BK-1001",
    customerName: "Maria Santos",
    customerEmail: "maria.santos@email.com",
    customerPhone: "0917-410-2219",
    address: "Mandaragat, Puerto Princesa",
    tourType: "Tour Only",
    scope: "Local Destination",
    destination: "Puerto Princesa",
    bookingDate: "Nov 25, 2026",
    guests: 3,
    amount: 8400,
    paymentMethod: "GCash",
    status: "Confirmed",
  },
  {
    id: "BK-1002",
    customerName: "Juan Dela Cruz",
    customerEmail: "juan.dc@email.com",
    customerPhone: "0918-882-1044",
    address: "San Pedro, Puerto Princesa",
    tourType: "Customize",
    scope: "Local Destination",
    destination: "Palawan",
    bookingDate: "Nov 22, 2026",
    guests: 2,
    amount: 13000,
    paymentMethod: "Bank Transfer",
    status: "Pending",
  },
  {
    id: "BK-1003",
    customerName: "Ana Reyes",
    customerEmail: "ana.reyes@email.com",
    customerPhone: "0920-334-9901",
    address: "Taguig City, Metro Manila",
    tourType: "Trip Planner",
    scope: "Local Destination",
    destination: "El Nido",
    bookingDate: "Nov 18, 2026",
    guests: 4,
    amount: 35600,
    paymentMethod: "GCash",
    status: "Processing",
  },
  {
    id: "BK-1004",
    customerName: "Carlos Mendoza",
    customerEmail: "carlos.m@email.com",
    customerPhone: "0915-770-4820",
    address: "Sta. Lourdes, Puerto Princesa",
    tourType: "Tour Only",
    scope: "Beyond the Philippines",
    destination: "South Korea",
    bookingDate: "Nov 12, 2026",
    guests: 2,
    amount: 49000,
    paymentMethod: "Credit Card",
    status: "Confirmed",
  },
  {
    id: "BK-1005",
    customerName: "Isabel Garcia",
    customerEmail: "isabel.garcia@email.com",
    customerPhone: "0927-619-3012",
    address: "Quezon City, Metro Manila",
    tourType: "Customize",
    scope: "Local Destination",
    destination: "Port Barton",
    bookingDate: "Oct 28, 2026",
    guests: 2,
    amount: 13000,
    paymentMethod: "Others",
    status: "Confirmed",
  },
];

const DEFAULT_INQUIRIES = [
  {
    id: "inq-1",
    name: "Juan Dela Cruz",
    contact: "juan.dc@email.com",
    message: "Can you recommend a 3-day Palawan family tour?",
    date: "Nov 25, 2026",
  },
  {
    id: "inq-2",
    name: "Maria Santos",
    contact: "maria.santos@email.com",
    message: "Is the Underground River booking rebookable if weather changes?",
    date: "Nov 22, 2026",
  },
  {
    id: "inq-3",
    name: "Carlos Mendoza",
    contact: "carlos.m@email.com",
    message: "Do you offer cooperative group discounts for 10 guests?",
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
let currentBookingSubTab = "info";
let currentDestFilter = "All";

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
    scope: item.scope || "Local Destination",
    enabled: item.enabled !== false,
  }));
}

function getBookings() {
  const data = readLS(STORAGE_KEYS.bookings, null);
  if (!Array.isArray(data) || data.length === 0) {
    writeLS(STORAGE_KEYS.bookings, DEFAULT_BOOKINGS);
    return [...DEFAULT_BOOKINGS];
  }
  return data.map((item, idx) => ({
    ...item,
    id: item.id || `BK-${1001 + idx}`,
    scope:
      item.scope ||
      (String(item.destination || "")
        .toLowerCase()
        .includes("korea") ||
      String(item.destination || "")
        .toLowerCase()
        .includes("japan")
        ? "Beyond the Philippines"
        : "Local Destination"),
  }));
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

  const bookings = getBookings();
  const totalPeso = bookings.reduce((sum, b) => sum + Number(b.amount || 0), 0);

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
  const bookings = getBookings();
  const inquiries = getInquiries();

  const activeTours = tours.filter((t) => t.enabled);
  const totalEarnings = bookings.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0,
  );
  const uniqueCustomers = new Set(
    bookings.map((b) => (b.customerEmail || b.customerName).toLowerCase()),
  ).size;
  const pendingItems = bookings.filter((b) => b.status === "Pending");

  // Bookings for this month (Nov 2026 or current month string)
  const currentMonthShort = new Date().toLocaleDateString("en-US", {
    month: "short",
  });
  const thisMonthBookings = bookings.filter((b) =>
    String(b.bookingDate || "")
      .toLowerCase()
      .includes(currentMonthShort.toLowerCase()),
  ).length;

  // Category counts (Beyond, Local, Customized, Tour Only)
  const beyondCount =
    tours.filter((t) => t.scope === "Beyond the Philippines" && t.enabled)
      .length +
    bookings.filter((b) => b.scope === "Beyond the Philippines").length;

  const localCount =
    tours.filter((t) => t.scope === "Local Destination" && t.enabled).length +
    bookings.filter((b) => b.scope === "Local Destination").length;

  const customizedCount =
    tours.filter(
      (t) =>
        (t.category === "Customize" || t.category === "Trip Planner") &&
        t.enabled,
    ).length +
    bookings.filter(
      (b) => b.tourType === "Customize" || b.tourType === "Trip Planner",
    ).length;

  const tourOnlyCount =
    tours.filter((t) => t.category === "Tour Only" && t.enabled).length +
    bookings.filter((b) => b.tourType === "Tour Only").length;

  document.getElementById("kpiTotalCustomers").textContent = (
    1240 + uniqueCustomers
  ).toLocaleString("en-PH");
  document.getElementById("kpiTotalBookings").textContent = (
    373 + bookings.length
  ).toLocaleString("en-PH");
  document.getElementById("kpiTotalEarnings").textContent = formatPeso(
    666950 + totalEarnings,
  );
  document.getElementById("kpiTotalTours").textContent = String(
    36 + activeTours.length,
  );

  document.getElementById("kpiCountBeyond").textContent = String(beyondCount);
  document.getElementById("kpiCountLocal").textContent = String(localCount);
  document.getElementById("kpiCountCustomized").textContent =
    String(customizedCount);
  document.getElementById("kpiCountTourOnly").textContent =
    String(tourOnlyCount);

  const monthEl = document.getElementById("bookingsThisMonthValue");
  if (monthEl)
    monthEl.textContent = String(thisMonthBookings || bookings.length);

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
                `<li><strong>${p.customerName}</strong> &mdash; Pending ${p.tourType} (${p.destination})</li>`,
            )
            .join("")
        : "<li>No pending reservations right now.</li>";
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

  // Recent Bookings
  const recentBookTbody = document.getElementById("recentBookingsTbody");
  if (recentBookTbody) {
    recentBookTbody.innerHTML = bookings
      .slice(0, 5)
      .map(
        (b, idx) => `
        <tr>
          <td>${idx + 1}.</td>
          <td><strong>${b.customerName}</strong></td>
          <td>${b.tourType}</td>
          <td>${b.destination}</td>
          <td>${b.bookingDate}</td>
          <td><span class="badge-pill ${statusBadgeClass(b.status)}">${b.status}</span></td>
        </tr>
      `,
      )
      .join("");
  }

  // Recent Inquiries
  const recentInqTbody = document.getElementById("recentInquiriesTbody");
  if (recentInqTbody) {
    recentInqTbody.innerHTML = inquiries
      .slice(0, 4)
      .map(
        (q, idx) => `
        <tr>
          <td>${idx + 1}.</td>
          <td>${q.name}</td>
          <td>${q.message}</td>
          <td>${q.date}</td>
        </tr>
      `,
      )
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
   TOURS CRUD WITH SINGLE ENABLE/DISABLE TOGGLE BUTTON
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
            <td>${t.category}<br><small style="color:#6b7280">${t.scope}</small></td>
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
      : `<tr><td colspan="6" style="color:#6b7280">No tour packages matched your filter.</td></tr>`;
}

/* =========================================================
   MERGED CUSTOMER & BOOKINGS MODULE
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

  const list = getBookings().filter((b) => {
    const stOk = statusFilter === "All" || b.status === statusFilter;
    const qOk =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      (b.customerEmail || "").toLowerCase().includes(q) ||
      b.tourType.toLowerCase().includes(q) ||
      b.destination.toLowerCase().includes(q);
    return stOk && qOk;
  });

  if (currentBookingSubTab === "guests") {
    if (heading) heading.textContent = "Customer & Guest Contact Directory";
    thead.innerHTML = `
      <tr>
        <th>Customer Name</th>
        <th>Email &amp; Phone</th>
        <th>Address</th>
        <th>Guests</th>
        <th>Booked Package</th>
      </tr>
    `;
    tbody.innerHTML = list
      .map(
        (b) => `
        <tr>
          <td><strong>${b.customerName}</strong></td>
          <td>${b.customerEmail || "N/A"}<br><small style="color:#6b7280">${b.customerPhone || "N/A"}</small></td>
          <td>${b.address || "Puerto Princesa"}</td>
          <td>${b.guests || 1} pax</td>
          <td>${b.tourType} (${b.destination})</td>
        </tr>
      `,
      )
      .join("");
    return;
  }

  if (currentBookingSubTab === "payments") {
    if (heading) heading.textContent = "Payment Collections & Status";
    thead.innerHTML = `
      <tr>
        <th>Ref #</th>
        <th>Customer</th>
        <th>Tour Type</th>
        <th>Payment Method</th>
        <th>Earnings</th>
        <th>Status</th>
      </tr>
    `;
    tbody.innerHTML = list
      .map(
        (b) => `
        <tr>
          <td><strong>${b.id}</strong></td>
          <td>${b.customerName}</td>
          <td>${b.tourType} &mdash; ${b.destination}</td>
          <td>${b.paymentMethod || "GCash"}</td>
          <td><strong>${formatPeso(b.amount)}</strong></td>
          <td><span class="badge-pill ${statusBadgeClass(b.status)}">${b.status}</span></td>
        </tr>
      `,
      )
      .join("");
    return;
  }

  if (heading) heading.textContent = "Customer Reservations & Status";
  thead.innerHTML = `
    <tr>
      <th>Customer Details</th>
      <th>Tour &amp; Destination</th>
      <th>Date &amp; Guests</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  `;
  tbody.innerHTML =
    list.length > 0
      ? list
          .map(
            (b) => `
          <tr>
            <td>
              <strong>${b.customerName}</strong><br>
              <small style="color:#6b7280">${b.customerEmail || ""} &middot; ${b.customerPhone || ""}</small>
            </td>
            <td>${b.tourType} &mdash; ${b.destination} (${formatPeso(b.amount)})</td>
            <td>${b.bookingDate} &middot; ${b.guests || 1} pax</td>
            <td><span class="badge-pill ${statusBadgeClass(b.status)}">${b.status}</span></td>
            <td>
              <div class="action-mini-group">
                ${b.status !== "Confirmed" ? `<button type="button" class="mini-btn-ok" data-approve-booking="${b.id}">Confirm</button>` : ""}
                <button type="button" class="mini-btn-del" data-del-booking="${b.id}">Delete</button>
              </div>
            </td>
          </tr>
        `,
          )
          .join("")
      : `<tr><td colspan="5" style="color:#6b7280">No customer bookings found.</td></tr>`;
}

/* =========================================================
   REPORTS MODULE RENDERER
========================================================= */
function renderReportsModule() {
  const bookings = getBookings();
  const totalEarnings = bookings.reduce((s, b) => s + Number(b.amount || 0), 0);
  const confirmedEarnings = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((s, b) => s + Number(b.amount || 0), 0);
  const pendingEarnings = bookings
    .filter((b) => b.status !== "Confirmed")
    .reduce((s, b) => s + Number(b.amount || 0), 0);
  const totalPax = bookings.reduce((s, b) => s + Number(b.guests || 1), 0);
  const avgVal = bookings.length
    ? Math.round(totalEarnings / bookings.length)
    : 0;

  document.getElementById("repConfirmedEarnings").textContent =
    formatPeso(confirmedEarnings);
  document.getElementById("repPendingEarnings").textContent =
    formatPeso(pendingEarnings);
  document.getElementById("repAvgBooking").textContent = formatPeso(avgVal);
  document.getElementById("repTotalPax").textContent = `${totalPax} pax`;

  // Category Breakdown
  const catGroups = [
    {
      label: "Local Destination",
      filter: (b) => b.scope === "Local Destination",
    },
    {
      label: "Beyond the Philippines",
      filter: (b) => b.scope === "Beyond the Philippines",
    },
    {
      label: "Customized / Trip Planner",
      filter: (b) =>
        b.tourType === "Customize" || b.tourType === "Trip Planner",
    },
    { label: "Tour Only", filter: (b) => b.tourType === "Tour Only" },
  ];

  const catTbody = document.getElementById("reportCategoryTbody");
  if (catTbody) {
    catTbody.innerHTML = catGroups
      .map((g) => {
        const rows = bookings.filter(g.filter);
        const amt = rows.reduce((s, b) => s + Number(b.amount || 0), 0);
        const pax = rows.reduce((s, b) => s + Number(b.guests || 1), 0);
        const pct =
          totalEarnings > 0 ? Math.round((amt / totalEarnings) * 100) : 0;
        return `
          <tr>
            <td><strong>${g.label}</strong></td>
            <td>${rows.length}</td>
            <td>${pax} pax</td>
            <td><strong>${formatPeso(amt)}</strong></td>
            <td>${pct}%</td>
          </tr>
        `;
      })
      .join("");
  }

  // Payment Method Breakdown
  const methods = ["GCash", "Bank Transfer", "Credit Card", "Others"];
  const payTbody = document.getElementById("reportPaymentTbody");
  if (payTbody) {
    payTbody.innerHTML = methods
      .map((m) => {
        const rows = bookings.filter((b) => (b.paymentMethod || "GCash") === m);
        const amt = rows.reduce((s, b) => s + Number(b.amount || 0), 0);
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

  // Itemized Ledger
  const ledgerTbody = document.getElementById("reportLedgerTbody");
  if (ledgerTbody) {
    ledgerTbody.innerHTML = bookings
      .map(
        (b) => `
        <tr>
          <td><strong>${b.id}</strong></td>
          <td>${b.bookingDate}</td>
          <td>${b.customerName}</td>
          <td>${b.tourType}</td>
          <td>${b.destination}</td>
          <td>${b.guests || 1}</td>
          <td>${b.paymentMethod || "GCash"}</td>
          <td><span class="badge-pill ${statusBadgeClass(b.status)}">${b.status}</span></td>
          <td><strong>${formatPeso(b.amount)}</strong></td>
        </tr>
      `,
      )
      .join("");
  }
}

function exportReportToCsv() {
  const bookings = getBookings();
  const headers = [
    "Ref ID",
    "Booking Date",
    "Customer Name",
    "Email",
    "Tour Type",
    "Scope",
    "Destination",
    "Guests",
    "Payment Method",
    "Status",
    "Earnings (PHP)",
  ];
  const lines = [headers.join(",")];

  bookings.forEach((b) => {
    const row = [
      b.id,
      `"${b.bookingDate}"`,
      `"${b.customerName}"`,
      `"${b.customerEmail || ""}"`,
      `"${b.tourType}"`,
      `"${b.scope}"`,
      `"${b.destination}"`,
      b.guests || 1,
      `"${b.paymentMethod || "GCash"}"`,
      b.status,
      Number(b.amount || 0),
    ];
    lines.push(row.join(","));
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PPW-Cooperative-Earnings-Report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================
   OTHER SUB-VIEWS
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
    .map(
      (q, i) => `
      <tr>
        <td>${i + 1}.</td>
        <td><strong>${q.name}</strong></td>
        <td>${q.contact || "Customer"}</td>
        <td>${q.message}</td>
        <td>${q.date}</td>
        <td><button type="button" class="mini-btn-del" data-del-inq="${q.id}">Remove</button></td>
      </tr>
    `,
    )
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
        currentTourCategoryFilter = sub.dataset.category;
        document
          .querySelectorAll("#tourCategoryTabs .pill-tab")
          .forEach((p) => {
            p.classList.toggle(
              "active",
              p.dataset.tourCat === currentTourCategoryFilter,
            );
          });
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
  document.querySelectorAll("[data-jump-dest]").forEach((el) => {
    el.addEventListener("click", () => {
      currentDestFilter = el.dataset.jumpDest;
      document.querySelectorAll("#destFilterTabs .pill-tab").forEach((p) => {
        p.classList.toggle(
          "active",
          p.dataset.destFilter === currentDestFilter,
        );
      });
      switchView("destinations");
    });
  });
  document.querySelectorAll("[data-jump-tourcat]").forEach((el) => {
    el.addEventListener("click", () => {
      currentTourCategoryFilter = el.dataset.jumpTourcat;
      document.querySelectorAll("#tourCategoryTabs .pill-tab").forEach((p) => {
        p.classList.toggle(
          "active",
          p.dataset.tourCat === currentTourCategoryFilter,
        );
      });
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

  // Quick actions (Create Booking, Add Tour Package, Generate Report)
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
    document.getElementById("tourNameInput")?.focus();
  });
  document
    .getElementById("qaOpenReportsBtn")
    ?.addEventListener("click", () => switchView("reports"));

  // Save Booking Modal
  document
    .getElementById("quickActionForm")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const customerName = document.getElementById("qaBookName")?.value.trim();
      const customerEmail = document
        .getElementById("qaBookEmail")
        ?.value.trim();
      const customerPhone = document
        .getElementById("qaBookPhone")
        ?.value.trim();
      const tourType =
        document.getElementById("qaBookType")?.value || "Tour Only";
      const scope =
        document.getElementById("qaBookScope")?.value || "Local Destination";
      const destination =
        document.getElementById("qaBookDest")?.value.trim() ||
        "Puerto Princesa";
      const guests = Number(
        document.getElementById("qaBookGuests")?.value || 2,
      );
      const amount = Number(
        document.getElementById("qaBookAmt")?.value || 2800,
      );
      const paymentMethod =
        document.getElementById("qaBookPay")?.value || "GCash";
      const status =
        document.getElementById("qaBookStatus")?.value || "Pending";

      if (customerName) {
        const list = getBookings();
        const today = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        list.unshift({
          id: "BK-" + String(1001 + list.length),
          customerName,
          customerEmail,
          customerPhone,
          address: "Puerto Princesa",
          tourType,
          scope,
          destination,
          bookingDate: today,
          guests,
          amount,
          paymentMethod,
          status,
        });
        writeLS(STORAGE_KEYS.bookings, list);
      }

      e.target.reset();
      dlg?.close();
      renderDashboard();
      renderAllSubViews();
    });

  // Tours CRUD & Single Enable/Disable Toggle Button
  document.querySelectorAll("#tourCategoryTabs .pill-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentTourCategoryFilter = tab.dataset.tourCat;
      document
        .querySelectorAll("#tourCategoryTabs .pill-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderToursCrud();
    });
  });

  document
    .getElementById("tourSearchInput")
    ?.addEventListener("input", renderToursCrud);

  document.getElementById("tourCrudForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = document.getElementById("editingTourId").value;
    const category = document.getElementById("tourCategoryInput").value;
    const scope = document.getElementById("tourScopeInput").value;
    const name = document.getElementById("tourNameInput").value.trim();
    const destination = document.getElementById("tourDestInput").value.trim();
    const price = Number(document.getElementById("tourPriceInput").value);
    const description = document.getElementById("tourDescInput").value.trim();
    if (!name || !destination || !description) return;

    const list = getTours();
    if (editId) {
      const idx = list.findIndex((x) => x.id === editId);
      if (idx !== -1)
        list[idx] = {
          ...list[idx],
          category,
          scope,
          name,
          destination,
          price,
          description,
        };
    } else {
      list.unshift({
        id: "t-" + Date.now(),
        category,
        scope,
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
      document.getElementById("tourCategoryInput").value = pkg.category;
      document.getElementById("tourScopeInput").value =
        pkg.scope || "Local Destination";
      document.getElementById("tourNameInput").value = pkg.name;
      document.getElementById("tourDestInput").value = pkg.destination;
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

  // Bookings sub-tabs & status actions
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
      const appBtn = e.target.closest("[data-approve-booking]");
      const delBtn = e.target.closest("[data-del-booking]");
      if (appBtn) {
        const updated = getBookings().map((b) =>
          b.id === appBtn.dataset.approveBooking
            ? { ...b, status: "Confirmed" }
            : b,
        );
        writeLS(STORAGE_KEYS.bookings, updated);
        renderDashboard();
        renderAllSubViews();
      } else if (delBtn) {
        const updated = getBookings().filter(
          (b) => b.id !== delBtn.dataset.delBooking,
        );
        writeLS(STORAGE_KEYS.bookings, updated);
        renderDashboard();
        renderAllSubViews();
      }
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
      writeLS(STORAGE_KEYS.bookings, DEFAULT_BOOKINGS);
      writeLS(STORAGE_KEYS.inquiries, DEFAULT_INQUIRIES);
      renderDashboard();
      renderAllSubViews();
    });

  const isLoggedIn = Boolean(readLS(STORAGE_KEYS.session, true));
  setAuthUnlocked(isLoggedIn);
});
