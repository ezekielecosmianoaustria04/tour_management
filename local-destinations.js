
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       PHILIPPINES MAP - ISLAND GROUP BOUNDS
    ========================================== */

    const bounds = {
        Luzon: [
            [12.3, 119],
            [21.5, 123.5]
        ],

        Visayas: [
            [9, 121],
            [12.8, 126]
        ],

        Mindanao: [
            [4.8, 122],
            [9.6, 127]
        ]
    };


    /* ==========================================
       HTML ELEMENTS
    ========================================== */

    const choices = [
        ...document.querySelectorAll('.island-choice')
    ];

    const groups = [
        ...document.querySelectorAll('.region-group')
    ];

    const places = [
        ...document.querySelectorAll('.place-card')
    ];

    const title = document.getElementById('selectedIslandTitle');
    const hint = document.getElementById('selectionHint');
    const mapLabel = document.getElementById('mapSelection');

    let map = null;
    let marker = null;


    /* ==========================================
       INITIALIZE INTERACTIVE SATELLITE MAP
    ========================================== */

    if (typeof L !== 'undefined') {

        map = L.map('philippinesMap', {
            scrollWheelZoom: false
        }).setView([12.5, 122.3], 6);


        /* ESRI WORLD IMAGERY */

        const imagery = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
                maxZoom: 18,
                attribution: 'Imagery © Esri and its data providers'
            }
        ).addTo(map);


        /* HANDLE MAP LOADING ERRORS */

        imagery.on('tileerror', () => {

            mapLabel.textContent =
                'Map imagery could not load. Check internet access or the map provider; destination selection still works.';

        });

    } else {

        document.getElementById('philippinesMap').textContent =
            'Map unavailable. Please connect to the internet to load the interactive map.';

    }


    /* ==========================================
       SELECT ISLAND GROUP
       LUZON / VISAYAS / MINDANAO
    ========================================== */

    function selectIsland(island) {

        choices.forEach(button => {

            const active = button.dataset.island === island;

            button.classList.toggle('active', active);

            button.setAttribute(
                'aria-pressed',
                String(active)
            );

        });


        /* SHOW SELECTED REGIONS */

        groups.forEach(group => {

            group.hidden = group.dataset.island !== island;

            const grid = group.querySelector('.place-grid');

            const toggle = group.querySelector('.region-toggle');

            grid.hidden = true;

            toggle.setAttribute('aria-expanded', 'false');

        });


        /* REMOVE PREVIOUS SELECTED PLACE */

        places.forEach(place => {
            place.classList.remove('active');
        });


        /* UPDATE TEXT */

        title.textContent = island + ' Regions';

        hint.textContent =
            'Choose a region below to view provinces and cities.';

        mapLabel.textContent =
            'Showing ' + island +
            '. Select a province or city to zoom in.';


        /* ZOOM MAP TO SELECTED ISLAND */

        if (map) {

            if (marker) {
                map.removeLayer(marker);
                marker = null;
            }

            map.fitBounds(bounds[island], {
                padding: [20, 20]
            });

            setTimeout(() => {
                map.invalidateSize();
            }, 100);

        }

    }


    /* ==========================================
       ISLAND BUTTON CLICK EVENTS
    ========================================== */

    choices.forEach(button => {

        button.addEventListener('click', () => {

            selectIsland(button.dataset.island);

        });

    });


    /* ==========================================
       REGION DROPDOWN FUNCTION
    ========================================== */

    groups.forEach(group => {

        const toggle = group.querySelector('.region-toggle');

        toggle.addEventListener('click', () => {

            const grid = group.querySelector('.place-grid');

            const opening = grid.hidden;


            /* CLOSE OTHER OPEN REGIONS */

            groups
                .filter(item => !item.hidden)
                .forEach(item => {

                    item.querySelector('.place-grid').hidden = true;

                    item.querySelector('.region-toggle')
                        .setAttribute('aria-expanded', 'false');

                });


            /* OPEN OR CLOSE SELECTED REGION */

            grid.hidden = !opening;

            toggle.setAttribute(
                'aria-expanded',
                String(opening)
            );


            /* UPDATE REGION INFORMATION */

            if (opening) {

                hint.textContent =
                    'Select a province or city in ' +
                    group.dataset.region + '.';

                mapLabel.textContent = group.dataset.region;

            }

        });

    });


    /* ==========================================
       SELECT PROVINCE OR CITY
    ========================================== */

    places.forEach(button => {

        button.addEventListener('click', () => {

            /* REMOVE PREVIOUS ACTIVE PLACE */

            places.forEach(place => {
                place.classList.remove('active');
            });

            button.classList.add('active');


            /* GET LOCATION DATA FROM HTML */

            const name = button.dataset.place;

            const lat = Number(button.dataset.lat);

            const lng = Number(button.dataset.lng);


            /* UPDATE SELECTED LOCATION */

            mapLabel.textContent =
                'Selected: ' + name +
                ' (approximate location)';


            /* UPDATE MAP MARKER */

            if (map) {

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(
                        '<strong>' +
                        name
                            .replaceAll('&', '&amp;')
                            .replaceAll('<', '&lt;') +
                        '</strong>'
                    )
                    .openPopup();


                /* ZOOM TO SELECTED PLACE */

                map.flyTo(
                    [lat, lng],
                    9,
                    {
                        duration: 1.1
                    }
                );

            }


            /* SCROLL TO MAP */

            document.querySelector('.map-panel')
                .scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

        });

    });


    /* ==========================================
       HEADER SEARCH FUNCTION
    ========================================== */

    document.getElementById('headerSearch')
        .addEventListener('submit', event => {

            event.preventDefault();

            const query = document
                .getElementById('headerQuery')
                .value
                .trim()
                .toLowerCase();

            if (!query) {
                return;
            }


            /* SEARCH PROVINCES AND CITIES */

            const found = places.find(place => {

                return place.dataset.place
                    .toLowerCase()
                    .includes(query);

            });


            if (found) {

                const group = found.closest('.region-group');

                selectIsland(group.dataset.island);

                group.querySelector('.region-toggle').click();

                found.click();

                return;
            }


            /* SEARCH REGIONS */

            const region = groups.find(group => {

                return group.dataset.region
                    .toLowerCase()
                    .includes(query);

            });


            if (region) {

                selectIsland(region.dataset.island);

                region.querySelector('.region-toggle').click();

                region.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

            } else {

                mapLabel.textContent =
                    'No matching destination in the provided list.';

            }

        });

});
