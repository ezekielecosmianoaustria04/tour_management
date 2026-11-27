// ----- Data -----
const rooms = [
  { name: "Standard Room",        desc: "Quiet room with garden view.",          price: 1800, color: "#cfe3df" },
  { name: "Deluxe Room",          desc: "Bigger space with a work desk.",        price: 2400, color: "#d9e6d0" },
  { name: "Superior Room",        desc: "High floor with city view.",            price: 2700, color: "#e6e2cc" },
  { name: "Family Room",          desc: "Fits the whole family comfortably.",    price: 3600, color: "#e9d9c4" },
  { name: "Junior Suite",         desc: "Separate sitting area.",                price: 4200, color: "#e5cfc9" },
  { name: "Executive Suite",      desc: "Lounge access and breakfast.",          price: 5200, color: "#d6d3e6" },
  { name: "Ocean View Room",      desc: "Balcony facing the sea.",               price: 4800, color: "#c6dfe8" },
  { name: "Garden Villa",         desc: "Private garden and plunge pool.",       price: 6500, color: "#cde4cf" },
  { name: "Honeymoon Suite",      desc: "Bathtub, candles, late checkout.",      price: 7200, color: "#ecd2d9" },
  { name: "Presidential Suite",   desc: "Two bedrooms, dining area, butler.",    price: 9800, color: "#ddd3b8" },
  { name: "Penthouse",            desc: "Top floor with a rooftop terrace.",     price: 12000, color: "#c9d3dc" }
];

const beds = [
  { id: "single", label: "Single bed",      add: 500,    width: 70 },
  { id: "double", label: "Double size bed", add: 700,  width: 100 },
  { id: "full",   label: "Full size",       add: 800,  width: 110 },
  { id: "queen",  label: "Queen size",      add: 1000,  width: 130 },
  { id: "king",   label: "King size",       add: 1300,  width: 150 },
  { id: "family", label: "Family size",     add: 1600, width: 190 }
];

const MAX_ROOMS = 20;
const DISCOUNT = 0.15;
const MAX_ADDONS = 5;

// ----- State -----
const state = { slide: 0, bed: "single", qty: 1, addons: [{ bed: "single", qty: 1 }], rooms: 1, cart: 0 };

// ----- Elements -----
const $ = (id) => document.getElementById(id);
const el = {
  bedNote: $("bedNote"),
  art: $("slideArt"),
  pag: $("pagination"), bedSelect: $("bedSelect"), bedPicture: $("bedPicture"),
  price: $("price"), total: $("total"), qty: $("qty"), qtyMsg: $("qtyMsg"),
  minus: $("qtyMinus"), plus: $("qtyPlus"),
  cart: $("cartCount"), roomTotal: $("roomTotal")
};

const peso = (n) => "₱" + Math.round(n).toLocaleString("en-PH");

// ----- Slider -----
function renderSlide() {
  const r = rooms[state.slide];
  el.art.style.background = r.color;
  el.art.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#0e4f56" stroke-width="1.2"><path d="M3 18V8M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11" r="1.6"/></svg>';
  el.art.setAttribute("aria-label", r.name);
  [...el.pag.children].forEach((b, i) => b.setAttribute("aria-selected", i === state.slide));
  renderPrice();
}

function goTo(i) {
  state.slide = (i + rooms.length) % rooms.length;
  renderSlide();
}

function buildPagination() {
  rooms.forEach((r, i) => {
    const b = document.createElement("button");
    b.setAttribute("role", "tab");
    b.setAttribute("aria-label", `Room ${i + 1}: ${r.name}`);
    b.addEventListener("click", () => goTo(i));
    el.pag.appendChild(b);
  });
}

// ----- Bed options -----
function buildBeds() {
  beds.forEach((b) => el.bedSelect.add(new Option(b.label, b.id)));
  el.bedSelect.addEventListener("change", () => {
    state.bed = el.bedSelect.value;
    renderBed();
    renderPrice();
  });
}

function renderBed() {
  const b = beds.find((x) => x.id === state.bed);
  const w = b.width;
  const x = (200 - w) / 2;
  const lines = state.addons.filter((a) => a.qty > 0)
    .map((a) => `+ ${a.qty} ${beds.find((s) => s.id === a.bed).label}`);
  const shown = lines.slice(0, 3);
  if (lines.length > 3) shown.push(`+ ${lines.length - 3} more`);
  const text = shown.map((t, i) =>
    `<text x="100" y="${98 + i * 12}" text-anchor="middle" font-size="10" fill="#b87016" font-weight="700">${t}</text>`).join("");
  el.bedPicture.innerHTML =
    `<svg viewBox="0 0 200 135" role="img" aria-label="${b.label}">` +
    `<rect x="${x}" y="30" width="${w}" height="12" rx="3" fill="#0e4f56"/>` +
    `<rect x="${x + 4}" y="42" width="${w - 8}" height="30" rx="4" fill="#fff" stroke="#0e4f56" stroke-width="2"/>` +
    `<rect x="${x + 10}" y="46" width="${Math.min(30, w / 3)}" height="12" rx="4" fill="#d98b2b"/>` +
    `<text x="192" y="18" text-anchor="end" font-size="16" font-weight="700" fill="#0e4f56">× ${state.qty}</text>` +
    `<rect x="${x}" y="72" width="6" height="16" fill="#0e4f56"/>` +
    `<rect x="${x + w - 6}" y="72" width="6" height="16" fill="#0e4f56"/>` +
    text + `</svg>`;
}

// ----- Price + quantity -----
function extrasPerRoom() {
  return state.addons.reduce((sum, a) => sum + beds.find((s) => s.id === a.bed).add * a.qty, 0);
}

function unitPrice() {
  return (rooms[state.slide].price + extrasPerRoom()) * (1 - DISCOUNT);
}

function renderPrice() {
  const unit = unitPrice();
  el.price.textContent = peso(unit);
  el.total.textContent = peso(unit * state.rooms);
  const n = state.addons.reduce((s, a) => s + a.qty, 0);
  $("bedNote").textContent = n
    ? `${n} extra bed${n > 1 ? "s" : ""}: +${peso(extrasPerRoom() * (1 - DISCOUNT))} per room.`
    : "Tap + to add another bed.";
}

function setQty(n) {
  if (n > MAX_ROOMS) {
    el.qtyMsg.textContent = `Up to ${MAX_ROOMS} beds only.`;
    n = MAX_ROOMS;
  } else {
    el.qtyMsg.innerHTML = "&nbsp;";
  }
  state.qty = Math.max(1, n);
  el.qty.textContent = state.qty;
  el.minus.disabled = state.qty <= 1;
  el.plus.disabled = state.qty >= MAX_ROOMS;
  renderBed();
  renderPrice();
}

function renderAddons() {
  const list = $("addonList");
  list.innerHTML = "";
  state.addons.forEach((a, i) => {
    const row = document.createElement("div");
    row.className = "addon-item";
    row.innerHTML =
      `<div class="bed-row"><div class="field"><label for="addon-sel-${i}">Bed size</label><div class="select-wrap"><select class="addon-select" id="addon-sel-${i}">` +
      beds.map((b) => `<option value="${b.id}" ${b.id === a.bed ? "selected" : ""}>${b.label}</option>`).join("") +
      `</select>` +
      (i === state.addons.length - 1
        ? `<button type="button" class="add-circle" aria-label="Add another bed" ${state.addons.length >= MAX_ADDONS ? "disabled" : ""}>+</button>`
        : `<span class="add-spacer"></span>`) +
      `</div></div><div class="field"><span>No. of beds</span><div class="stepper">` +
      `<button type="button" class="a-minus" aria-label="Fewer extra beds">−</button><output>${a.qty}</output>` +
      `<button type="button" class="a-plus" aria-label="More extra beds">+</button></div></div></div>` +
      (state.addons.length > 1 ? `<button type="button" class="remove-btn" aria-label="Remove this bed">×</button>` : "");
    const out = row.querySelector("output");
    const minus = row.querySelector(".a-minus");
    const plus = row.querySelector(".a-plus");
    const sync = () => {
      out.textContent = a.qty;
      minus.disabled = a.qty <= 0;
      plus.disabled = a.qty >= MAX_ROOMS;
      renderBed();
      renderPrice();
    };
    row.querySelector(".addon-select").addEventListener("change", (e) => { a.bed = e.target.value; sync(); });
    minus.addEventListener("click", () => { a.qty = Math.max(0, a.qty - 1); sync(); });
    plus.addEventListener("click", () => { a.qty = Math.min(MAX_ROOMS, a.qty + 1); sync(); });
    const addBtn = row.querySelector(".add-circle");
    if (addBtn) addBtn.addEventListener("click", () => {
      if (state.addons.length < MAX_ADDONS) { state.addons.push({ bed: "single", qty: 1 }); renderAddons(); }
    });
    const rm = row.querySelector(".remove-btn");
    if (rm) rm.addEventListener("click", () => { state.addons.splice(i, 1); renderAddons(); });
    minus.disabled = a.qty <= 0;
    plus.disabled = a.qty >= MAX_ROOMS;
    list.appendChild(row);
  });
  renderBed();
  renderPrice();
}

// ----- Events -----
$("prevBtn").addEventListener("click", () => goTo(state.slide - 1));
$("nextBtn").addEventListener("click", () => goTo(state.slide + 1));
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input, button")) return;
  if (e.key === "ArrowLeft") goTo(state.slide - 1);
  if (e.key === "ArrowRight") goTo(state.slide + 1);
});
el.minus.addEventListener("click", () => setQty(state.qty - 1));
el.plus.addEventListener("click", () => setQty(state.qty + 1));

$("bookBtn").addEventListener("click", () => {
  state.cart += state.rooms;
  el.cart.textContent = state.cart;
  const r = rooms[state.slide];
  const msg = $("roomsMsg");
  msg.style.color = "#0e4f56";
  msg.textContent = `${r.name} selected. Proceeding to booking information…`;
  setTimeout(() => { msg.innerHTML = "&nbsp;"; msg.style.color = ""; }, 2500);
});

$("searchBtn").addEventListener("click", () => {
  const q = prompt("Search rooms by name:");
  if (!q) return;
  const i = rooms.findIndex((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  i >= 0 ? goTo(i) : alert("No room found.");
});

// ----- Init -----
el.roomTotal.textContent = rooms.length;
buildPagination();
buildBeds();
renderBed();
renderSlide();
setQty(1);
renderAddons();