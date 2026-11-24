
/* ==========================================
   CUSTOMIZED TRIP PLANNER
   PALAWAN DESTINATION PAGE
========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ======================================
       SEARCH FUNCTION
    ====================================== */

    const searchForm = document.getElementById('custom-search-form');

    searchForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        const query = document
            .getElementById('home-location-search')
            ?.value.trim();

        if (query) {
            window.location.href =
                'tripplanner.html?search=' +
                encodeURIComponent(query);
        }
    });


    /* ======================================
       SHOPPING CART
    ====================================== */

    document
        .getElementById('custom-cart-button')
        ?.addEventListener('click', () => {

            if (typeof window.openCart === 'function') {
                window.openCart();
            } else {
                alert('Cart feature is not connected on this page yet.');
            }

        });


    /* ======================================
       LOGIN BUTTON
    ====================================== */

    document
        .getElementById('custom-login-button')
        ?.addEventListener('click', () => {

            if (typeof window.showLoginNotice === 'function') {
                window.showLoginNotice();
            } else {
                alert('Login feature is not connected on this page yet.');
            }

        });

});


/* ==========================================
   PALAWAN DESTINATION SLIDER
========================================== */

const travelDestinations = [

    {
        name: 'Puerto Princesa',
        region: 'PALAWAN',
        image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=85'
    },

    {
        name: 'El Nido',
        region: 'PALAWAN',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=85'
    },

    {
        name: 'Coron',
        region: 'PALAWAN',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=85'
    },

    {
        name: 'Port Barton',
        region: 'PALAWAN',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85'
    },

    {
        name: 'San Vicente',
        region: 'PALAWAN',
        image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=85'
    }

];


/* ==========================================
   SLIDER VARIABLES
========================================== */

let travelStart = 0;

const travelCards = document.getElementById('travelCards');
const travelCounter = document.getElementById('travelCounter');


/* ==========================================
   DISPLAY DESTINATION CARDS
========================================== */

function renderTravelCards() {

    if (!travelCards || !travelCounter) return;

    const visibleCount = window.matchMedia('(max-width: 540px)').matches
        ? 2
        : 3;

    travelCards.replaceChildren();

    for (let i = 0; i < visibleCount; i++) {

        const destination =
            travelDestinations[
                (travelStart + i) % travelDestinations.length
            ];

        const card = document.createElement('article');
        card.className = 'travel-card';

        const img = document.createElement('img');
        img.src = destination.image;
        img.alt = destination.name;
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.className = 'travel-card-info';

        const heading = document.createElement('h3');
        heading.textContent = destination.name;

        const label = document.createElement('p');
        label.textContent = destination.region;

        info.append(heading, label);
        card.append(img, info);
        travelCards.append(card);
    }

    travelCounter.textContent =
        `${String(travelStart + 1).padStart(2, '0')} / ` +
        `${String(travelDestinations.length).padStart(2, '0')}`;
}


/* ==========================================
   PREVIOUS BUTTON
========================================== */

document
    .getElementById('travelPrev')
    ?.addEventListener('click', () => {

        travelStart =
            (travelStart - 1 + travelDestinations.length)
            % travelDestinations.length;

        renderTravelCards();
    });


/* ==========================================
   NEXT BUTTON
========================================== */

document
    .getElementById('travelNext')
    ?.addEventListener('click', () => {

        travelStart =
            (travelStart + 1) % travelDestinations.length;

        renderTravelCards();
    });


/* ==========================================
   RESPONSIVE SLIDER
========================================== */

window.addEventListener('resize', renderTravelCards);


/* ==========================================
   INITIALIZE SLIDER
========================================== */

renderTravelCards();
