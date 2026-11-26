document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginPanel = document.getElementById("loginPanel");
  const signupPanel = document.getElementById("signupPanel");
  const title = document.getElementById("formTitle");
  const subtitle = document.getElementById("formSubtitle");
  const message = document.getElementById("message");

  function notify(text, error = false) {
    message.hidden = false;
    message.textContent = text;
    message.classList.toggle("error", error);
  }
  function switchTab(tab) {
    const signup = tab === "signup";
    loginPanel.hidden = signup;
    signupPanel.hidden = !signup;
    loginTab.classList.toggle("active", !signup);
    signupTab.classList.toggle("active", signup);
    loginTab.setAttribute("aria-selected", String(!signup));
    signupTab.setAttribute("aria-selected", String(signup));
    title.textContent = signup ? "Create Your Account" : "Welcome Back!";
    subtitle.textContent = signup
      ? "Sign up to start planning your next adventure."
      : "Log in to your account to continue.";
    message.hidden = true;
    history.replaceState(null, "", signup ? "#signup" : "#login");
  }
  loginTab.addEventListener("click", () => switchTab("login"));
  signupTab.addEventListener("click", () => switchTab("signup"));
  document.querySelectorAll("[data-switch]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.switch));
  });
  if (location.hash === "#signup") switchTab("signup");

  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.textContent = visible ? "Show" : "Hide";
      button.setAttribute(
        "aria-label",
        visible ? "Show password" : "Hide password",
      );
    });
  });

  document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    notify(
      "Login form is ready. Connect it to your secure server authentication endpoint to verify accounts. No login has been performed.",
    );
  });

  document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    if (password !== confirm) {
      notify("Passwords do not match. Please try again.", true);
      document.getElementById("confirmPassword").focus();
      return;
    }
    notify(
      "Your customer registration details are valid. Connect this form to your secure backend to create the account. No account has been created yet.",
    );
  });

  // These buttons are UI placeholders until real OAuth is configured on the server.
  // Never collect Google/Facebook passwords or simulate a successful sign-in here.
  document.querySelectorAll("[data-provider]").forEach((button) => {
    button.addEventListener("click", () => {
      const provider = button.dataset.provider;
      notify(
        `Continue with ${provider} is not connected yet. Set up ${provider} OAuth on your backend before this can sign you in.`,
      );
      message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });

  document.getElementById("forgotPassword").addEventListener("click", () => {
    notify(
      "Password reset requires a secure backend and email verification. This feature is not connected yet.",
    );
  });
});

("use strict");

const CUSTOMER_SESSION_KEY = "ppowCustomerLoggedIn_v1";
const CUSTOMER_PROFILE_KEY = "ppowCustomerProfile_v1";
const ADMIN_SESSION_KEY = "ppowAdminLoggedIn_v1";

function saveSession(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error saving session:", err);
  }
}

function getSelectedRole() {
  const checkedRadio = document.querySelector(
    'input[name="loginRole"]:checked',
  );
  if (checkedRadio && checkedRadio.value) {
    return checkedRadio.value.toLowerCase();
  }

  const roleSelect =
    document.getElementById("loginRole") || document.getElementById("userRole");
  if (roleSelect && roleSelect.value) {
    return roleSelect.value.toLowerCase();
  }

  return "";
}

function showLoginMessage(message, isError = true) {
  const errorBox =
    document.getElementById("loginError") ||
    document.getElementById("authError") ||
    document.querySelector(".login-error");

  if (errorBox) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    errorBox.style.color = isError ? "#ff8a80" : "#62d5c4";
  } else {
    alert(message);
  }
}

function redirectAfterLogin(role, userIdentifier) {
  if (role === "admin") {
    saveSession(ADMIN_SESSION_KEY, true);
    window.location.href = "admin.html";
    return;
  }

  saveSession(CUSTOMER_SESSION_KEY, true);
  saveSession(CUSTOMER_PROFILE_KEY, {
    identifier: userIdentifier,
    role: "customer",
    loggedInAt: new Date().toISOString(),
  });
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm =
    document.getElementById("loginForm") ||
    document.getElementById("customerLoginForm") ||
    document.querySelector("form");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const identifierInput =
      document.getElementById("loginUsername") ||
      document.getElementById("loginEmail") ||
      document.getElementById("email") ||
      document.getElementById("username") ||
      loginForm.querySelector('input[type="text"], input[type="email"]');

    const passwordInput =
      document.getElementById("loginPassword") ||
      document.getElementById("password") ||
      loginForm.querySelector('input[type="password"]');

    const identifier = identifierInput ? identifierInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!identifier || !password) {
      showLoginMessage("Pakilagay ang username/email at password.");
      return;
    }

    const chosenRole = getSelectedRole();
    const isAdminAccount =
      chosenRole === "admin" ||
      identifier.toLowerCase() === "admin" ||
      identifier.toLowerCase().startsWith("admin@");

    if (isAdminAccount) {
      if (password.length < 4) {
        showLoginMessage(
          "Kailangan ng hindi bababa sa 4 characters ang passcode para sa Admin.",
        );
        return;
      }
      redirectAfterLogin("admin", identifier);
    } else {
      redirectAfterLogin("customer", identifier);
    }
  });
});
