"use strict";

const CUSTOMER_SESSION_KEY = "ppowCustomerLoggedIn_v1";
const CUSTOMER_PROFILE_KEY = "ppowCustomerProfile_v1";
const ADMIN_SESSION_KEY = "ppowAdminLoggedIn_v1";

const ADMIN_CREDENTIALS = {
  email: "jeannyveve.cusi@yahoo.com",
  password: "admin123",
};

const CUSTOMER_CREDENTIALS = {
  email: "xennkunn@gmail.com",
  password: "user1234",
};

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

function showLoginError(message) {
  const errEl =
    document.getElementById("loginError") ||
    document.getElementById("authError") ||
    document.querySelector(".login-error");

  if (errEl) {
    errEl.textContent = message;
    errEl.hidden = false;
    errEl.style.display = "block";
    errEl.style.color = "#ff8a80";
  } else {
    alert(message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("loginForm") ||
    document.getElementById("customerLoginForm") ||
    document.querySelector("form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput =
      document.getElementById("loginEmail") ||
      document.getElementById("email") ||
      document.getElementById("loginUsername") ||
      document.getElementById("username") ||
      form.querySelector('input[type="email"], input[type="text"]');

    const passwordInput =
      document.getElementById("loginPassword") ||
      document.getElementById("password") ||
      form.querySelector('input[type="password"]');

    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!email || !password) {
      showLoginError("Pakilagay ang Email Address at Password.");
      return;
    }

    // 1. Admin Login -> admin.html (admin.css & admin.js dashboard)
    if (
      email === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      saveStorage(ADMIN_SESSION_KEY, true);
      saveStorage(CUSTOMER_SESSION_KEY, false);
      window.location.href = "admin.html";
      return;
    }

    // 2. Customer Login -> index.html (Customer Home Page)
    if (
      email === CUSTOMER_CREDENTIALS.email.toLowerCase() &&
      password === CUSTOMER_CREDENTIALS.password
    ) {
      saveStorage(CUSTOMER_SESSION_KEY, true);
      saveStorage(CUSTOMER_PROFILE_KEY, {
        name: "Xenn Kunn",
        email: CUSTOMER_CREDENTIALS.email,
        role: "customer",
        loggedInAt: new Date().toISOString(),
      });
      saveStorage(ADMIN_SESSION_KEY, false);
      window.location.href = "index.html";
      return;
    }

    // Fallback kung may bagong na-register na customer account sa localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("ppowRegisteredUsers_v1") || "[]",
    );
    const matchedUser = registeredUsers.find(
      (u) =>
        String(u.email || "")
          .trim()
          .toLowerCase() === email && String(u.password || "") === password,
    );

    if (matchedUser) {
      saveStorage(CUSTOMER_SESSION_KEY, true);
      saveStorage(CUSTOMER_PROFILE_KEY, {
        name: matchedUser.name || matchedUser.fullName || "Customer",
        email: matchedUser.email,
        role: "customer",
        loggedInAt: new Date().toISOString(),
      });
      saveStorage(ADMIN_SESSION_KEY, false);
      window.location.href = "index.html";
      return;
    }

    showLoginError("Invalid email address or password.");
  });
});
