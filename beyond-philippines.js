document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       INTERNATIONAL DESTINATIONS
    ========================================== */

    const destinations = [
        ['Vietnam', 16.0, 108.0],
        ['Japan', 36.2, 138.2]
    ];


    /* ==========================================
       HTML ELEMENTS
    ========================================== */

    const mapNode = document.getElementById('internationalMap');
    const search = document.getElementById('destinationSearch');
    const count = document.getElementById('destinationCount');
    const status = document.getElementById('terrainSelection');

    if (!mapNode || !search || !count || !status) return;

    const buttons = new Map();
    const markers = new Map();

    let selected = null;
    let map = null;


    /* ==========================================
       MAP MARKER STYLE
    ========================================== */

    function styleMarker(name, hover = false) {

        const marker = markers.get(name);

        if (!marker) return;

        const active = selected === name;

        marker.setStyle({

            radius: hover ? 12 : active ? 11 : 7,

            weight: hover || active ? 4 : 2,

            color: hover || active
                ? '#ffb400'
                : '#ffffff',

            fillColor: hover
                ? '#ffe86a'
                : active
                    ? '#ffd700'
                    : '#0d9488',

            fillOpacity: 1

        });

    }


    /* ==========================================
       SELECT COUNTRY
    ========================================== */

    function choose(name) {

        const place = destinations.find(
            destination => destination[0] === name
        );

        if (!place) return;

        const previous = selected;

        selected = name;

        if (previous) {
            styleMarker(previous);
        }

        styleMarker(name);


        // Highlight selected country button

        buttons.forEach((button, key) => {

            const active = key === name;

            button.classList.toggle('active', active);

            button.setAttribute(
                'aria-pressed',
                String(active)
            );

        });


        // Display selected country

        status.textContent =
            'Selected destination: ' + name;


        // Display attractions and tour packages

        renderAttractions(name);


        // Automatically zoom to selected country

        if (map) {

            map.flyTo(
                [place[1], place[2]],
                6,
                {
                    duration: 1.1
                }
            );

            markers.get(name)?.openTooltip();

        }

    }


    /* ==========================================
       DISPLAY ATTRACTIONS AND TOUR PACKAGES
    ========================================== */

    function renderAttractions(name) {

        const sections = document.querySelectorAll(
            '#international [data-attractions-for]'
        );

        sections.forEach(section => {

            const match =
                section.dataset.attractionsFor === name;

            section.hidden = !match;

        });

    }


    /* ==========================================
       DESTINATION BUTTONS
    ========================================== */

    document.querySelectorAll(
        '#terrainButtons [data-destination]'
    ).forEach(button => {

        const name = button.dataset.destination;

        buttons.set(name, button);

        button.addEventListener('click', () => {

            choose(name);

        });

    });


    /* ==========================================
       DESTINATION SEARCH
    ========================================== */

    function filter() {

        const query = search.value
            .trim()
            .toLowerCase();

        let visible = 0;

        buttons.forEach((button, name) => {

            const match = name
                .toLowerCase()
                .includes(query);

            button.hidden = !match;

            if (match) {
                visible++;
            }

        });

        count.textContent =
            `${visible} of ${destinations.length} destinations`;

    }


    search.addEventListener('input', filter);

    filter();


    /* ==========================================
       HEADER SEARCH BAR
    ========================================== */

    const headerSearch = document.getElementById(
        'home-location-search'
    );

    const headerSearchForm = document.getElementById(
        'headerSearchForm'
    );


    headerSearchForm?.addEventListener('submit', event => {

        event.preventDefault();

        if (!headerSearch) return;

        const query = headerSearch.value.trim();

        search.value = query;

        filter();


        // Check if country name matches

        const exact = destinations.find(([name]) =>

            name.toLowerCase() === query.toLowerCase()

        );


        if (exact) {

            choose(exact[0]);

        }


        // Scroll to destination search

        search.scrollIntoView({

            behavior: 'smooth',

            block: 'center'

        });

    });


    /* ==========================================
       CHECK LEAFLET CONNECTION
    ========================================== */

    if (typeof L === 'undefined') {

        mapNode.textContent =
            'Terrain map could not load. You can still select a destination below.';

        mapNode.style.padding = '24px';

        return;

    }


    /* ==========================================
       INITIALIZE INTERACTIVE MAP
    ========================================== */

    map = L.map(mapNode, {

        center: [26.0, 123.0],

        zoom: 4,

        minZoom: 3,

        maxZoom: 15,

        scrollWheelZoom: false

    });


    /* ==========================================
       TERRAIN MAP LAYER
    ========================================== */

    L.tileLayer(

        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',

        {

            attribution:
                'Map data © OpenStreetMap contributors, SRTM | Map style © OpenTopoMap',

            maxZoom: 15

        }

    ).addTo(map);


    /* ==========================================
       DEFAULT MAP VIEW
    ========================================== */

    map.fitBounds(

        [
            [8, 102],
            [46, 146]
        ],

        {
            padding: [20, 20]
        }

    );


    /* ==========================================
       CREATE COUNTRY MAP MARKERS
    ========================================== */

    destinations.forEach(([name, lat, lng]) => {

        const marker = L.circleMarker(

            [lat, lng],

            {

                radius: 7,

                color: '#ffffff',

                weight: 2,

                fillColor: '#0d9488',

                fillOpacity: 1

            }

        ).addTo(map);


        /* COUNTRY TOOLTIP */

        marker.bindTooltip(name, {

            direction: 'top',

            offset: [0, -8]

        });


        markers.set(name, marker);


        /* YELLOW HOVER EFFECT */

        marker.on('mouseover', () => {

            styleMarker(name, true);

            marker.openTooltip();

        });


        /* RETURN TO DEFAULT STYLE */

        marker.on('mouseout', () => {

            styleMarker(name);

        });


        /* CLICK COUNTRY MARKER */

        marker.on('click', () => {

            choose(name);

        });

    });

});