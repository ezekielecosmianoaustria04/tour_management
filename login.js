"use strict";

/* ==========================================
   LOCAL STORAGE KEYS
========================================== */

const CUSTOMER_SESSION_KEY = "ppowCustomerLoggedIn_v1";
const CUSTOMER_PROFILE_KEY = "ppowCustomerProfile_v1";
const ADMIN_SESSION_KEY = "ppowAdminLoggedIn_v1";
const REGISTERED_USERS_KEY = "ppowRegisteredUsers_v1";

/* ==========================================
   DEFAULT DEMO ACCOUNTS
========================================== */

const ADMIN_CREDENTIALS = {
    email: "jeannyveve.cusi@yahoo.com",
    password: "admin123"
};

const CUSTOMER_CREDENTIALS = {
    email: "xennkunn@gmail.com",
    password: "user1234"
};

/* ==========================================
   LOCAL STORAGE FUNCTIONS
========================================== */

function saveStorage(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}

function getRegisteredUsers() {

    const users = JSON.parse(
        localStorage.getItem(REGISTERED_USERS_KEY) || "[]"
    );

    if (!Array.isArray(users)) {
        throw new Error("Invalid registered users data.");
    }

    return users;

}

/* ==========================================
   INITIALIZE LOGIN AND SIGN UP
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Login JavaScript loaded successfully.");

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const loginPanel = document.getElementById("loginPanel");
    const signupPanel = document.getElementById("signupPanel");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");

    const messageBox = document.getElementById("message");

    /* CHECK REQUIRED HTML ELEMENTS */

    if (
        !loginTab ||
        !signupTab ||
        !loginPanel ||
        !signupPanel ||
        !loginForm ||
        !signupForm ||
        !formTitle ||
        !formSubtitle ||
        !messageBox
    ) {

        console.error(
            "Login initialization failed. Missing HTML elements."
        );

        return;

    }

    /* ==========================================
       SHOW SUCCESS OR ERROR MESSAGE
    ========================================== */

    function showMessage(text, type = "error") {

        messageBox.textContent = text;

        messageBox.classList.remove(
            "error",
            "success"
        );

        messageBox.classList.add(type);

        messageBox.hidden = false;

        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

    function clearMessage() {

        messageBox.textContent = "";

        messageBox.hidden = true;

        messageBox.classList.remove(
            "error",
            "success"
        );

    }

    /* ==========================================
       SWITCH LOGIN AND SIGN UP
    ========================================== */

    function switchForm(type) {

        clearMessage();

        const isSignup = type === "signup";

        loginPanel.hidden = isSignup;

        signupPanel.hidden = !isSignup;

        loginTab.classList.toggle(
            "active",
            !isSignup
        );

        signupTab.classList.toggle(
            "active",
            isSignup
        );

        loginTab.setAttribute(
            "aria-selected",
            String(!isSignup)
        );

        signupTab.setAttribute(
            "aria-selected",
            String(isSignup)
        );

        if (isSignup) {

            formTitle.textContent = "Create Account";

            formSubtitle.textContent =
                "Sign up and start your travel adventure.";

        } else {

            formTitle.textContent = "Welcome!";

            formSubtitle.textContent =
                "Log in to your account to continue.";

        }

    }

    /* ==========================================
       LOGIN TAB
    ========================================== */

    loginTab.addEventListener("click", () => {

        switchForm("login");

    });

    /* ==========================================
       SIGN UP TAB
    ========================================== */

    signupTab.addEventListener("click", () => {

        switchForm("signup");

    });

    /* ==========================================
       BOTTOM LOGIN AND SIGN UP BUTTONS
    ========================================== */

    document.querySelectorAll("[data-switch]")
        .forEach(button => {

            button.addEventListener("click", () => {

                switchForm(button.dataset.switch);

            });

        });

    /* ==========================================
       SHOW AND HIDE PASSWORD
    ========================================== */

    document.querySelectorAll(".toggle-password")
        .forEach(button => {

            button.addEventListener("click", () => {

                const targetId = button.dataset.target;

                const passwordInput =
                    document.getElementById(targetId);

                if (!passwordInput) return;

                const isPassword =
                    passwordInput.type === "password";

                passwordInput.type = isPassword
                    ? "text"
                    : "password";

                button.textContent = isPassword
                    ? "Hide"
                    : "Show";

                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            });

        });

    /* ==========================================
       CUSTOMER REGISTRATION
    ========================================== */

    signupForm.addEventListener("submit", event => {

        event.preventDefault();

        clearMessage();

        const fullName = document
            .getElementById("fullName")
            .value.trim();

        const email = document
            .getElementById("signupEmail")
            .value.trim()
            .toLowerCase();

        const contactNo = document
            .getElementById("contactNo")
            .value.trim();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        /* ======================================
           REQUIRED FIELDS
        ====================================== */

        if (
            !fullName ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            showMessage(
                "Please complete all required fields."
            );

            return;

        }

        /* ======================================
           FULL NAME VALIDATION
        ====================================== */

        if (fullName.length < 2) {

            showMessage(
                "Please enter your full name."
            );

            return;

        }

        /* ======================================
           EMAIL VALIDATION
        ====================================== */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showMessage(
                "Please enter a valid email address."
            );

            return;

        }

        /* ======================================
           CONTACT NUMBER VALIDATION
        ====================================== */

        const normalizedContact =
            contactNo.replace(/[\s-]/g, "");

        if (
            normalizedContact &&
            !/^(09\d{9}|\+639\d{9})$/.test(normalizedContact)
        ) {

            showMessage(
                "Please enter a valid Philippine mobile number."
            );

            return;

        }

        /* ======================================
           PASSWORD VALIDATION
        ====================================== */

        if (password.length < 8) {

            showMessage(
                "Password must contain at least 8 characters."
            );

            return;

        }

        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match."
            );

            return;

        }

        /* ======================================
           SAVE NEW CUSTOMER ACCOUNT
        ====================================== */

        try {

            const registeredUsers =
                getRegisteredUsers();

            /* CHECK DUPLICATE EMAIL */

            const emailExists =
                registeredUsers.some(user =>

                    String(user.email || "")
                        .trim()
                        .toLowerCase() === email

                );

            if (
                emailExists ||
                email === ADMIN_CREDENTIALS.email.toLowerCase() ||
                email === CUSTOMER_CREDENTIALS.email.toLowerCase()
            ) {

                showMessage(
                    "This email address is already registered."
                );

                return;

            }

            /* NEW CUSTOMER INFORMATION */

            const newCustomer = {

                id: Date.now(),

                name: fullName,

                fullName: fullName,

                email: email,

                contactNo: normalizedContact,

                password: password,

                role: "customer",

                status: "active",

                createdAt: new Date().toISOString()

            };

            registeredUsers.push(newCustomer);

            /* SAVE TO LOCAL STORAGE */

            saveStorage(
                REGISTERED_USERS_KEY,
                registeredUsers
            );

            /* CLEAR REGISTRATION FORM */

            signupForm.reset();

            /* RESET PASSWORD VISIBILITY */

            signupForm.querySelectorAll(".toggle-password")
                .forEach(button => {

                    const input = document.getElementById(
                        button.dataset.target
                    );

                    if (input) {
                        input.type = "password";
                    }

                    button.textContent = "Show";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                });

            /* RETURN TO LOGIN */

            switchForm("login");

            document.getElementById("loginEmail")
                .value = email;

            document.getElementById("loginPassword")
                .value = "";

            showMessage(
                "Account created successfully! You may now log in.",
                "success"
            );

            console.log(
                "Customer registration successful."
            );

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            showMessage(
                "Unable to create your account. Please try again."
            );

        }

    });

    /* ==========================================
       CUSTOMER LOGIN SESSION
    ========================================== */

    function loginCustomer(customer) {

        saveStorage(
            CUSTOMER_SESSION_KEY,
            true
        );

        saveStorage(
            ADMIN_SESSION_KEY,
            false
        );

        saveStorage(
            CUSTOMER_PROFILE_KEY,
            {

                id: customer.id || null,

                name:
                    customer.name ||
                    customer.fullName ||
                    "Customer",

                fullName:
                    customer.fullName ||
                    customer.name ||
                    "Customer",

                email: customer.email,

                contactNo: customer.contactNo || "",

                role: "customer",

                loggedInAt: new Date().toISOString()

            }
        );

        window.location.href = "index.html";

    }

    /* ==========================================
       LOGIN FORM
    ========================================== */

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        clearMessage();

        const email = document
            .getElementById("loginEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;

        /* REQUIRED FIELDS */

        if (!email || !password) {

            showMessage(
                "Please enter your email address and password."
            );

            return;

        }

        try {

            /* ==================================
               ADMIN LOGIN
            ================================== */

            if (
                email === ADMIN_CREDENTIALS.email.toLowerCase() &&
                password === ADMIN_CREDENTIALS.password
            ) {

                saveStorage(
                    ADMIN_SESSION_KEY,
                    true
                );

                saveStorage(
                    CUSTOMER_SESSION_KEY,
                    false
                );

                localStorage.removeItem(
                    CUSTOMER_PROFILE_KEY
                );

                window.location.href = "admin.html";

                return;

            }

            /* ==================================
               DEFAULT CUSTOMER LOGIN
            ================================== */

            if (
                email === CUSTOMER_CREDENTIALS.email.toLowerCase() &&
                password === CUSTOMER_CREDENTIALS.password
            ) {

                loginCustomer({

                    id: "demo-customer",

                    name: "Xenn Kunn",

                    email: CUSTOMER_CREDENTIALS.email,

                    contactNo: ""

                });

                return;

            }

            /* ==================================
               REGISTERED CUSTOMER LOGIN
            ================================== */

            const registeredUsers =
                getRegisteredUsers();

            const matchedUser =
                registeredUsers.find(user =>

                    String(user.email || "")
                        .trim()
                        .toLowerCase() === email &&

                    String(user.password || "") === password

                );

            if (matchedUser) {

                /* CHECK ACCOUNT STATUS */

                if (
                    matchedUser.status &&
                    matchedUser.status !== "active"
                ) {

                    showMessage(
                        "Your account is inactive. Please contact the administrator."
                    );

                    return;

                }

                loginCustomer(matchedUser);

                return;

            }

            /* INVALID LOGIN */

            showMessage(
                "Invalid email address or password."
            );

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            showMessage(
                "Unable to log in. Please try again."
            );

        }

    });

    /* ==========================================
       FORGOT PASSWORD
    ========================================== */

    const forgotPassword =
        document.getElementById("forgotPassword");

    if (forgotPassword) {

        forgotPassword.addEventListener("click", () => {

            showMessage(
                "Password recovery is not yet available. Please contact the travel agency."
            );

        });

    }

    /* ==========================================
       GOOGLE AND FACEBOOK AUTHENTICATION
    ========================================== */

    document.querySelectorAll(".social-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const provider =
                    button.dataset.provider;

                showMessage(
                    provider +
                    " authentication is not yet connected."
                );

            });

        });

    /* ==========================================
       DEFAULT DISPLAY
    ========================================== */

    switchForm("login");

    console.log(
        "Login and Sign Up initialized successfully."
    );

});