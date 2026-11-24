
/* ==========================================
   AI TRAVEL ASSISTANT - CHATBOT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const chatbotWindow =
        document.getElementById("chatbotWindow");

    const chatbotToggle =
        document.getElementById("chatbotToggle");

    const chatbotClose =
        document.getElementById("chatbotClose");

    const chatbotMessages =
        document.getElementById("chatbotMessages");

    const chatbotForm =
        document.getElementById("chatbotForm");

    const chatbotInput =
        document.getElementById("chatbotInput");

    if (!chatbotWindow || !chatbotToggle ||
        !chatbotClose || !chatbotMessages ||
        !chatbotForm || !chatbotInput) return;

    /* OPEN / CLOSE CHATBOT */

    function setChatbotOpen(open) {
        chatbotWindow.classList.toggle("open", open);
        chatbotToggle.setAttribute(
            "aria-expanded", String(open)
        );

        if (open) chatbotInput.focus();
    }

    chatbotToggle.addEventListener("click", () => {
        setChatbotOpen(
            !chatbotWindow.classList.contains("open")
        );
    });

    chatbotClose.addEventListener("click", () => {
        setChatbotOpen(false);
    });

    /* DISPLAY MESSAGE */

    function addMessage(message, sender) {

        const bubble = document.createElement("div");

        bubble.className =
            "chat-message " +
            (sender === "user"
                ? "user-message"
                : "bot-message");

        // textContent prevents injected HTML
        bubble.textContent = message;

        chatbotMessages.appendChild(bubble);

        chatbotMessages.scrollTop =
            chatbotMessages.scrollHeight;
    }

    /* TOUR INFORMATION */

    const tourPrices = {
        puerto: [
            "Underground River Tour - ₱2,800",
            "Honda Bay Island Hopping - ₱2,300",
            "Jungle Firefly Watching - ₱2,200",
            "Halfday City Tour - ₱990",
            "Bay Cruise & Firefly Watching - ₱2,000",
            "Dolphin Watching - ₱1,500"
        ],
        elnido: [
            "Island Hopping Tour A - ₱1,600",
            "Island Hopping Tour B - ₱1,700",
            "Island Hopping Tour C - ₱1,800",
            "Island Hopping Tour D - ₱1,900"
        ],
        coron: [
            "Island Hopping Tour A - ₱1,300",
            "Town Tour - ₱1,200",
            "Island Escapade Tour - ₱1,800",
            "Island Hopping Tour B - ₱1,800"
        ]
    };

    /* AUTOMATIC CHATBOT REPLIES */

    function getBotReply(message) {

        const text = message.toLowerCase();

        if (/\b(hello|hi|hey|good morning|good afternoon|kumusta)\b/.test(text)) {
            return "Hello! Welcome to Puerto Princesa of Wonder Travel and Tours. You can ask me about Puerto Princesa, El Nido, Coron, tour prices, or how to book.";
        }

        if (text.includes("coron")) {
            return "Here are our Coron tour packages:\n\n" +
                tourPrices.coron.join("\n") +
                "\n\nYou can explore these packages in our Trip Planner.";
        }

        if (text.includes("el nido") || text.includes("elnido")) {
            return "Here are our El Nido tour packages:\n\n" +
                tourPrices.elnido.join("\n") +
                "\n\nChoose your preferred tour in our Trip Planner.";
        }

        if (text.includes("puerto princesa") ||
            text.includes("underground river") ||
            text.includes("honda bay")) {
            return "Here are our Puerto Princesa tours:\n\n" +
                tourPrices.puerto.join("\n") +
                "\n\nVisit our Trip Planner to select a tour.";
        }

        if (text.includes("price") ||
            text.includes("prices") ||
            text.includes("magkano") ||
            text.includes("rate") ||
            text.includes("cost")) {
            return "Our tour prices depend on the destination and package. You can ask me about Puerto Princesa, El Nido, or Coron to see the listed prices.";
        }

        if (text.includes("book") ||
            text.includes("reservation") ||
            text.includes("checkout")) {
            return "To book a tour, open Trip Planner, choose Tour Only, select your destination, and choose a tour package. Follow the available booking steps on the website.";
        }

        if (text.includes("custom") ||
            text.includes("itinerary") ||
            text.includes("plan my trip")) {
            return "You can create your own itinerary using Customize Your Trip in our Trip Planner. Select the tours you want to include in your travel schedule.";
        }

        if (text.includes("contact") ||
            text.includes("phone") ||
            text.includes("email")) {
            return "You can contact our travel agency at jeannyveve.cusi@gmail.com or call 0906-456-0426 (Globe) / 0919-272-6174 (Smart).";
        }

        if (text.includes("thank")) {
            return "You're welcome! Have a wonderful trip!";
        }

        return "I can help you with our destinations, tour packages, listed prices, booking steps, and contact information. Try asking: What are the El Nido tours?";
    }

    /* SEND MESSAGE */

    chatbotForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const message = chatbotInput.value.trim();

        if (!message) return;

        addMessage(message, "user");

        chatbotInput.value = "";

        const reply = getBotReply(message);

        addMessage(reply, "bot");
    });

});
