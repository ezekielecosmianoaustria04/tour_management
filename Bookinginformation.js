// ----- Settings -----
const INQUIRY_URL = "inquiry.html";   // where "No" goes (inquiry form / contact page)
const MAX_PAX = 30;

// ----- Elements -----
const $ = (id) => document.getElementById(id);
const el = {
  ask: $("askBlock"), yes: $("yesBtn"), no: $("noBtn"), status: $("status"),
  flight: $("flightBlock"), arrival: $("arrival"), departure: $("departure"),
  pax: $("pax"), up: $("paxUp"), down: $("paxDown"), error: $("error"), next: $("continueBtn")
};

// ----- Helpers -----
function localNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function hideQuestion() {
  el.ask.classList.add("gone");
  el.ask.setAttribute("aria-hidden", "true");
  el.yes.disabled = true;
  el.no.disabled = true;
  setTimeout(() => { el.ask.hidden = true; }, 450);
}

// ----- Yes / No -----
el.yes.addEventListener("click", () => {
  hideQuestion();
  el.flight.disabled = false;          // enable the Flight section
  el.arrival.min = localNow();
  el.departure.min = localNow();
  el.arrival.focus();
  syncPax();
  validate();
});

el.no.addEventListener("click", () => {
  hideQuestion();
  el.status.hidden = false;
  el.status.textContent = "No problem! Taking you to our inquiry form…";
  setTimeout(() => { window.location.href = INQUIRY_URL; }, 1500);
});

// ----- Pax (1 to 30 only) -----
function setPax(n) {
  el.pax.value = Math.min(MAX_PAX, Math.max(1, n));
  syncPax();
  validate();
}
function syncPax() {
  const n = Number(el.pax.value);
  el.up.disabled = el.flight.disabled || n >= MAX_PAX;
  el.down.disabled = el.flight.disabled || n <= 1;
}
el.up.addEventListener("click", () => setPax((Number(el.pax.value) || 0) + 1));
el.down.addEventListener("click", () => setPax((Number(el.pax.value) || 2) - 1));
el.pax.addEventListener("input", () => {
  if (el.pax.value !== "" && Number(el.pax.value) > MAX_PAX) el.pax.value = MAX_PAX;   // cap at 30
  syncPax();
});
el.pax.addEventListener("blur", () => {
  if (el.pax.value === "" || Number(el.pax.value) < 1) el.pax.value = 1;
  syncPax();
  validate();
});

// ----- Validation -----
function validate() {
  let msg = "";
  const a = el.arrival.value, d = el.departure.value;
  const pax = Number(el.pax.value);

  if (a) el.departure.min = a;         // departure can't be before arrival
  if (a && d && d <= a) msg = "Departure must be after arrival.";
  else if (el.pax.value === "" || !Number.isInteger(pax) || pax < 1) msg = "Enter at least 1 pax.";

  el.error.textContent = msg;
  el.next.disabled = !(a && d && !msg) || el.flight.disabled;
}

[el.arrival, el.departure, el.pax].forEach((i) => i.addEventListener("input", validate));

// ----- Continue -----
el.next.addEventListener("click", () => {
  const info = {
    bookedFlight: true,
    arrival: el.arrival.value,
    departure: el.departure.value,
    pax: Number(el.pax.value)
  };
  try { sessionStorage.setItem("bookingInfo", JSON.stringify(info)); } catch (e) { /* storage may be blocked */ }
  el.status.hidden = false;
  el.status.textContent = "Flight details saved. Next: guest information.";
  // To go to the next page, add: window.location.href = "guestinformation.html";
});

syncPax();
validate();

$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();   // connect this to your location search page
});