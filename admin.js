"use strict";

const ADMIN_PACKAGES_KEY = "ppowAdminPackages_v1";
const ADMIN_SESSION_KEY = "ppowAdminLoggedIn_v1";
const ADMIN_ACCOUNT_KEY = "ppowAdminAccount_v1";

const DEFAULT_ADMIN_ACCOUNT = {
  name: "Cooperative Admin",
  email: "admin@puertoprincesawonder.ph",
  role: "Tour Operations Admin",
};

const DEFAULT_PACKAGES = [
  // Tour Only (mula sa tripplanner.js)
  {
    id: "to-1",
    category: "Tour Only",
    name: "Underground River Tour",
    destination: "Puerto Princesa",
    price: 2800,
    image: "puerto-princesa-underground-river.jpg",
    description:
      "Explore the famous Puerto Princesa Underground River and its limestone cave formations.",
  },
  {
    id: "to-2",
    category: "Tour Only",
    name: "Honda Bay Island Hopping",
    destination: "Puerto Princesa",
    price: 2300,
    image: "puerto-princesa-honda-bay.jpg",
    description: "Discover the beaches and island scenery of Honda Bay.",
  },
  {
    id: "to-3",
    category: "Tour Only",
    name: "El Nido Island Hopping Tour A Package",
    destination: "El Nido",
    price: 1600,
    image: "elnido.jpg",
    description:
      "Experience El Nido's limestone cliffs, clear lagoons, and island scenery.",
  },
  {
    id: "to-4",
    category: "Tour Only",
    name: "Coron: Island Hopping Tour A",
    destination: "Coron",
    price: 1300,
    image: "coron.jpg",
    description:
      "Discover Coron's island landscapes, clear waters, and limestone formations.",
  },

  // Customized (mula sa tripplanner-customized.js)
  {
    id: "cu-1",
    category: "Customized",
    name: "Custom Palawan Multi-Stop Itinerary",
    destination: "Puerto Princesa & El Nido",
    price: 6500,
    image: "palawan-customized.PNG",
    description:
      "Customizable multi-day Palawan route with flexible tour stops and schedule.",
  },
  {
    id: "cu-2",
    category: "Customized",
    name: "Custom Port Barton & San Vicente Getaway",
    destination: "Port Barton",
    price: 5200,
    image: "portbarton.jpg",
    description: "Tailor-made beach and island itinerary with custom pacing.",
  },

  // Local Destination (mula sa script.js)
  {
    id: "ld-1",
    category: "Local Destination",
    name: "Baguio Highland Escape",
    destination: "Baguio",
    price: 2500,
    image: "luzon.jpg",
    description:
      "Mountain views, cool climate, and local attractions in Luzon.",
  },
  {
    id: "ld-2",
    category: "Local Destination",
    name: "Cebu & Bohol Island Experience",
    destination: "Cebu / Bohol",
    price: 3000,
    image: "visayas.jpg",
    description: "Coastal and countryside highlights across Visayas.",
  },
  {
    id: "ld-3",
    category: "Local Destination",
    name: "Siargao Surf & Lagoon Tour",
    destination: "Siargao",
    price: 3500,
    image: "mindanao.jpg",
    description: "Island adventures, lagoons, and coastal spots in Mindanao.",
  },

  // Beyond the Philippines (mula sa script.js)
  {
    id: "bp-1",
    category: "Beyond the Philippines",
    name: "Japan Cultural & Scenic Package",
    destination: "Japan",
    price: 15000,
    image: "",
    description:
      "Explore Japanese culture, landmarks, and seasonal destinations.",
  },
  {
    id: "bp-2",
    category: "Beyond the Philippines",
    name: "South Korea City & Heritage Tour",
    destination: "South Korea",
    price: 14500,
    image: "",
    description: "Discover South Korean city attractions and cultural sites.",
  },
];

let activeCategory = "Tour Only";
let searchQuery = "";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error("Storage read error:", err);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error:", err);
  }
}

function getPackages() {
  const saved = readStorage(ADMIN_PACKAGES_KEY, null);
  if (!Array.isArray(saved) || saved.length === 0) {
    writeStorage(ADMIN_PACKAGES_KEY, DEFAULT_PACKAGES);
    return [...DEFAULT_PACKAGES];
  }
  return saved;
}

function savePackages(list) {
  writeStorage(ADMIN_PACKAGES_KEY, list);
}

function getAdminAccount() {
  return { ...DEFAULT_ADMIN_ACCOUNT, ...readStorage(ADMIN_ACCOUNT_KEY, {}) };
}

function formatPeso(amount) {
  return "₱" + Number(amount || 0).toLocaleString("en-PH");
}

function setAuthState(isLoggedIn) {
  const authSection = document.getElementById("adminAuthSection");
  const dashboard = document.getElementById("adminDashboard");
  writeStorage(ADMIN_SESSION_KEY, Boolean(isLoggedIn));

  if (authSection) authSection.hidden = Boolean(isLoggedIn);
  if (dashboard) dashboard.hidden = !isLoggedIn;

  if (isLoggedIn) {
    renderAccountInfo();
    renderAll();
  }
}

function renderAccountInfo() {
  const acc = getAdminAccount();
  const nameEl = document.getElementById("activeAdminName");
  const roleEl = document.getElementById("activeAdminRole");
  const nameInput = document.getElementById("accountDisplayName");
  const emailInput = document.getElementById("accountEmail");
  const roleInput = document.getElementById("accountRole");

  if (nameEl) nameEl.textContent = acc.name;
  if (roleEl) roleEl.textContent = `${acc.role} · Active`;
  if (nameInput) nameInput.value = acc.name;
  if (emailInput) emailInput.value = acc.email;
  if (roleInput) roleInput.value = acc.role;
}

function renderStats(packages) {
  const counts = {
    "Tour Only": 0,
    Customized: 0,
    "Local Destination": 0,
    "Beyond the Philippines": 0,
  };
  packages.forEach((pkg) => {
    if (Object.prototype.hasOwnProperty.call(counts, pkg.category)) {
      counts[pkg.category] += 1;
    }
  });

  const map = {
    countTourOnly: counts["Tour Only"],
    countCustomized: counts["Customized"],
    countLocal: counts["Local Destination"],
    countBeyond: counts["Beyond the Philippines"],
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  });
}

function renderPackagesTable(packages) {
  const tbody = document.getElementById("adminPackagesTbody");
  const heading = document.getElementById("currentCategoryHeading");
  const countLabel = document.getElementById("currentCategoryCount");
  if (!tbody) return;

  const q = searchQuery.trim().toLowerCase();
  const filtered = packages.filter((pkg) => {
    const sameCat = pkg.category === activeCategory;
    const matchesSearch =
      !q ||
      pkg.name.toLowerCase().includes(q) ||
      pkg.destination.toLowerCase().includes(q) ||
      pkg.description.toLowerCase().includes(q);
    return sameCat && matchesSearch;
  });

  if (heading) heading.textContent = `${activeCategory} Packages`;
  if (countLabel)
    countLabel.textContent = `${filtered.length} package(s) shown`;

  tbody.replaceChildren();

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "No packages found in this category.";
    td.style.color = "#aebfca";
    td.style.padding = "20px 10px";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  filtered.forEach((pkg) => {
    const tr = document.createElement("tr");

    const tdPkg = document.createElement("td");
    const titleSpan = document.createElement("span");
    titleSpan.className = "admin-pkg-title";
    titleSpan.textContent = pkg.name;
    const descSpan = document.createElement("span");
    descSpan.className = "admin-pkg-desc";
    descSpan.textContent = pkg.description;
    tdPkg.append(titleSpan, descSpan);

    const tdDest = document.createElement("td");
    tdDest.textContent = pkg.destination;

    const tdPrice = document.createElement("td");
    tdPrice.textContent = formatPeso(pkg.price);

    const tdActions = document.createElement("td");
    const actionDiv = document.createElement("div");
    actionDiv.className = "admin-row-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "admin-edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEditPackage(pkg.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "admin-delete-btn";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deletePackage(pkg.id));

    actionDiv.append(editBtn, delBtn);
    tdActions.appendChild(actionDiv);

    tr.append(tdPkg, tdDest, tdPrice, tdActions);
    tbody.appendChild(tr);
  });
}

function renderAll() {
  const packages = getPackages();
  renderStats(packages);
  renderPackagesTable(packages);
}

function resetPackageForm() {
  const editingId = document.getElementById("editingPackageId");
  const modeTitle = document.getElementById("formModeTitle");
  const saveBtn = document.getElementById("savePackageBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const catSelect = document.getElementById("pkgCategory");

  if (editingId) editingId.value = "";
  if (modeTitle) modeTitle.textContent = "Add New Tour Package";
  if (saveBtn) saveBtn.textContent = "+ Add Package";
  if (cancelBtn) cancelBtn.hidden = true;

  document.getElementById("packageForm")?.reset();
  if (catSelect) catSelect.value = activeCategory;
}

function startEditPackage(id) {
  const pkg = getPackages().find((item) => item.id === id);
  if (!pkg) return;

  activeCategory = pkg.category;
  syncActiveTabUI();

  document.getElementById("editingPackageId").value = pkg.id;
  document.getElementById("pkgCategory").value = pkg.category;
  document.getElementById("pkgName").value = pkg.name;
  document.getElementById("pkgDestination").value = pkg.destination;
  document.getElementById("pkgPrice").value = pkg.price;
  document.getElementById("pkgImage").value = pkg.image || "";
  document.getElementById("pkgDescription").value = pkg.description;

  document.getElementById("formModeTitle").textContent = "Edit Tour Package";
  document.getElementById("savePackageBtn").textContent = "Update Package";
  document.getElementById("cancelEditBtn").hidden = false;

  renderPackagesTable(getPackages());
  document
    .getElementById("packageForm")
    ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function deletePackage(id) {
  const packages = getPackages();
  const target = packages.find((item) => item.id === id);
  if (!target) return;

  if (!confirm(`Delete "${target.name}"?`)) return;

  const updated = packages.filter((item) => item.id !== id);
  savePackages(updated);

  if (document.getElementById("editingPackageId")?.value === id) {
    resetPackageForm();
  }
  renderAll();
}

function syncActiveTabUI() {
  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === activeCategory);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("adminLoginForm");
  const quickUnlock = document.getElementById("quickUnlockBtn");
  const logoutBtn = document.getElementById("adminLogoutBtn");
  const accountForm = document.getElementById("adminAccountForm");
  const packageForm = document.getElementById("packageForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const searchInput = document.getElementById("adminSearchInput");
  const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document
      .getElementById("adminUsername")
      .value.trim()
      .toLowerCase();
    const pass = document.getElementById("adminPasscode").value.trim();
    const errEl = document.getElementById("adminAuthError");

    if (user === "admin" && pass.length >= 4) {
      if (errEl) errEl.hidden = true;
      setAuthState(true);
    } else if (errEl) {
      errEl.textContent =
        "Use username 'admin' and a passcode of at least 4 characters.";
      errEl.hidden = false;
    }
  });

  quickUnlock?.addEventListener("click", () => setAuthState(true));
  logoutBtn?.addEventListener("click", () => setAuthState(false));

  accountForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const updatedAcc = {
      name:
        document.getElementById("accountDisplayName").value.trim() ||
        DEFAULT_ADMIN_ACCOUNT.name,
      email:
        document.getElementById("accountEmail").value.trim() ||
        DEFAULT_ADMIN_ACCOUNT.email,
      role:
        document.getElementById("accountRole").value.trim() ||
        DEFAULT_ADMIN_ACCOUNT.role,
    };
    writeStorage(ADMIN_ACCOUNT_KEY, updatedAcc);
    renderAccountInfo();

    const notice = document.getElementById("accountSaveNotice");
    if (notice) {
      notice.textContent = "Admin account details saved.";
      notice.hidden = false;
    }
  });

  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      syncActiveTabUI();
      const catSelect = document.getElementById("pkgCategory");
      if (catSelect && !document.getElementById("editingPackageId")?.value) {
        catSelect.value = activeCategory;
      }
      renderPackagesTable(getPackages());
    });
  });

  packageForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const idField = document.getElementById("editingPackageId").value;
    const category = document.getElementById("pkgCategory").value;
    const name = document.getElementById("pkgName").value.trim();
    const destination = document.getElementById("pkgDestination").value.trim();
    const price = Number(document.getElementById("pkgPrice").value);
    const image = document.getElementById("pkgImage").value.trim();
    const description = document.getElementById("pkgDescription").value.trim();

    if (
      !name ||
      !destination ||
      Number.isNaN(price) ||
      price < 0 ||
      !description
    )
      return;

    const packages = getPackages();

    if (idField) {
      const idx = packages.findIndex((item) => item.id === idField);
      if (idx !== -1) {
        packages[idx] = {
          ...packages[idx],
          category,
          name,
          destination,
          price,
          image,
          description,
        };
      }
    } else {
      packages.push({
        id: "pkg-" + Date.now(),
        category,
        name,
        destination,
        price,
        image,
        description,
      });
    }

    savePackages(packages);
    activeCategory = category;
    syncActiveTabUI();
    resetPackageForm();
    renderAll();
  });

  cancelEditBtn?.addEventListener("click", resetPackageForm);

  searchInput?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderPackagesTable(getPackages());
  });

  resetDefaultsBtn?.addEventListener("click", () => {
    if (!confirm("Restore default sample packages across all 4 categories?"))
      return;
    savePackages([...DEFAULT_PACKAGES]);
    resetPackageForm();
    renderAll();
  });

  const alreadyLoggedIn = Boolean(readStorage(ADMIN_SESSION_KEY, false));
  setAuthState(alreadyLoggedIn);
});
