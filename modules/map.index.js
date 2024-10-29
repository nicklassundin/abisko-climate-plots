// Vizchange map start point
//import lib from 'vizchange-plot-builder';
import lib from '../../renderer/lib.js';


// Initialize leaflet.js
import L from 'leaflet'

// Initialize the map
let map = L.map('map', {
    dragging: false,
    maxZoom: 10,
    scrollWheelZoom: false,
});

import kommuner from '../res/geojson/kommuner.geo.json';
import landskap from '../res/geojson/lan.json';


//layerControl = L.control.layers({}, null, { collapsed: false }).addTo(map);


$(document).ready(function() {
    let size = 2
    let greenIcon = L.icon({
        iconUrl: 'resources/leaf-green.png',
        /*
        shadowUrl: 'resources/leaf-shadow.png',

         */

        iconSize:     [38/size, 95/size], // size of the icon
        shadowSize:   [50/size, 64/size], // size of the shadow
        iconAnchor:   [22/size, 94/size], // point of the icon which will correspond to marker's location
        shadowAnchor: [4/size, 62/size],  // the same for the shadow
        popupAnchor:  [-3/size, -76/size] // point from which the popup should open relative to the iconAnchor
    });

// Kommuner layer
    async function fetchStations() {
        try {
            const response = await fetch('/python/stations'); // Adjust the URL if needed
            if (!response) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the response as JSON
            const data = await response.json();
            return data.stations;

        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    }

    let markers = new L.FeatureGroup();

    function updateParentDisabledState() {
        $('.tab').each(function() {
            const $tabContent = $('#' + $(this).data('tab'));
            // Check if any child within this tab is not disabled
            if ($tabContent.find('.plot-button:not(.deactivate)').length > 0) {
                $(this).removeClass('deactivate'); // Remove disabled if any child is enabled
            } else {
                $(this).addClass('deactivate'); // Keep disabled if all children are disabled
            }
        });
    }

    // Initial state check
    updateParentDisabledState();

    // Re-check when any plot-button is clicked or dynamically updated
    $('.plot-button').on('click', function() {
        updateParentDisabledState();
    });

    async function updateDescription(event, longitude, latitude, name, lnkod, knkod) {
        $(`.plotArea`).removeClass('active')
        if (event.target['_latlng']) {
            map.flyTo(event.target['_latlng'])
        }
        $(`.plotArea`).toggleClass('active')
        $(`#plotField`).removeClass('show')
        $(`#plotField`).toggleClass('show')
        if(longitude){
            $('#description').attr('data-longitude', longitude)
            $('#description').attr('data-latitude', latitude)
        }
        $('#description').attr('data-lnkod', lnkod)
        $('#description').attr('data-knkod', knkod)
        $('#description').attr('data-set', $('.plot-button.active').attr('data-set'))
        $('#description').attr('data-baseline', $('.plot-button.active').attr('data-baseline'))
        $('#description').attr('data-name', name)

        //const response = await fetch(`/python/station?year=2000&lng=${longitude}&lat=${latitude}&random=true`)
        let url = `/python/station`
        if(longitude){
            url += `?lng=${longitude}&lat=${latitude}`
            url += '&'
        }else{
            url += `?`
        }
        if(lnkod){
            url += `LnKod=${lnkod}`
        }
        if(knkod){
            url += `&KnKod=${knkod}`
        }
        //url += 'reset=true'

        console.log(url)
        const response = await fetch(url)
        const datatypes = await response.json()
        console.log(datatypes)
        document.querySelectorAll('.plot-button').forEach(button => {
            let datatype = button.getAttribute('data-type')
            if (datatypes['available_statistics_data_types'][datatype]) {
                button.classList.remove('deactivate')
            } else {
                button.classList.add('deactivate')
            }
        })
        console.log('Update response done')
        updateParentDisabledState()
    }
    function addStations (points) {
        points.forEach((point) => {
            let icon = L.divIcon({
                html: `<a class="icon knkod-${point.geodata.KnKod}" id="${point.id}">
<div class="icon-content"></div><options id="station-${point.id}"
data-longitude=${point.longitude} 
data-latitude=${point.latitude} 
data-station="${point.id}" 
data-name="${point.name}"
data-set="annualTemperatures" 
data-hosturl="http://vizchange.hopto.org">
<!-- data-hosturl="https://acp.k8s.glimworks.se" -->

</options><a>`,
                className: 'icon-container hide knkod-'+ point.geodata.knkod + ' lnkod-' + point.geodata.lnkod,
                childId: point.id,
                configId: `#station-${point.id}`
            });
            let latLng = L.latLng(point.latitude, point.longitude)
            let marker = L.marker(latLng, {
                icon: icon,
            })

            marker.on('click', async (event) => {
                await updateDescription(event, point.longitude, point.latitude, point.name)
            })
            marker.bindPopup(`<b>${point.name}</b><br>${point.geodata.KnNamn}<br>${point.geodata.LnNamn}`)
            marker.on('mouseover', function (e) {
                this.openPopup();
            });
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            /*
            marker.bindTooltip(`${points.formatedName}`, {permanent: true, className: "label"})
             */
            markers.addLayer(marker)

            map.addLayer(markers)
        })
    }
    /*
    map.addLayer(markers)
     */
////


// Zoom feature
    function zoomToFeature(e, zoom) {
        let bounds = e.target.getBounds();
        //$(`.plotArea`).removeClass('active')
        //$(`#plotField`).removeClass('show')
        map.fitBounds(bounds);
        /*
        if(zoom){
            zoomLevel = map.getZoom()
        }else{
            zoomLevel = 10
        }
         */
    }
    function onEachFeature(feature, layer) {
        layer.on({
            click: async (e) => {
                let lnkod = feature.properties.LnKod;
                let knkod = Number(feature.properties.KnKod);
                zoomToFeature(e, isNaN(Number(knkod ? knkod : lnkod)));

                if (knkod) {
                    // Remove the 'show' class from all icons and add it to the relevant ones
                    //$(`.icon-container`).removeClass('show');
                    $(`.icon-container`).removeClass('show');
                    $(`.icon-container.knkod-${knkod}`).toggleClass('show');
                    //$(`.kommun.knkod-${knkod}`).toggleClass('show');
                } else {
                    // Handle landskap click if no knkod (province)
                    $(`.kommun`).removeClass('show');
                    $(`.lnkod-${lnkod}`).removeClass('show');
                    $(`.lnkod-${lnkod}`).toggleClass('active');
                    $(`.kommun`).removeClass('show active');
                    $(`.kommun.lnkod-${lnkod}`).toggleClass('show active');
                }
                $('#description').attr('data-knkod', knkod)
                $('#description').attr('data-lnkod', lnkod)
                let namn = feature.properties.LnNamn ? feature.properties.LnNamn : feature.properties.KnNamn
                await updateDescription(e, null, null, namn, lnkod, knkod)
            },
            dblclick: (e) => {
                /*
                console.log('double click', e)
                addKommuns(300)
                map.setZoom(1)
                 */
            }
        });
    }


    let kommun_layer = undefined
    function addKommuns() {
        kommun_layer.addTo(map);
    }

    window.onload = async () => {
        const stations = await fetchStations()
        addStations(stations)
        console.log(stations)
        const static_stations = JSON.parse(document.getElementById("stations-data").textContent);
        console.log(static_stations)
        kommun_layer = L.geoJSON(kommuner, {
            onEachFeature: onEachFeature,
            style: (feature) => {
                let kod = feature.properties.KnKod;
                // take first two numbers in knkod
                let land = Math.floor(feature.properties.KnKod / 100)
                land = ""+land
                land = land.length === 1 ? "0"+land : land
                return {
                    className: `kommun knkod-${kod} lnkod-${land}`,
                };
            },
            zoom: 1,
        })
        await kommun_layer.addTo(map);
        let land_layer = L.geoJSON(landskap, {
            onEachFeature: onEachFeature,
            style: (feature) => {
                return {
                    className: 'landskap lnkod-' + feature.properties.LnKod + ' show'
                };
            }
        })
        await land_layer.addTo(map);

        map.setMaxBounds(land_layer.getBounds());

        map.fitBounds(land_layer.getBounds(), {
            duration: 0,
            animation: false
        });
        console.log('Map loaded')

    }


// Generic event listener for all plot buttons
    document.querySelectorAll('.plot-button').forEach(button => {
        button.addEventListener('click', function() {
            // Get the data-set attribute to determine which plot to render
            const dataSet = this.getAttribute('data-set');

            // Log the selected plot (for debugging or confirmation)
            $('#description').attr('data-set', dataSet)
            $('#description').attr('data-type', this.getAttribute('data-type'))
            $('#description').attr('data-cat', this.getAttribute('data-cat'))
            // Remove 'active' class from all buttons, then add it to the clicked button
            document.querySelectorAll('.plot-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            lib.renderFromData("mark", '#description')
        });
    });
});
