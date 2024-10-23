// Vizchange map start point
import lib from 'vizchange-plot-builder';


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

// Function to fetch stations from HTML
/**
function fetchStationsFromHTML() {
    const stations = [];
    const stationElements = document.querySelectorAll('#station-list li');
    stationElements.forEach(station => {
        stations.push({
            id: station.getAttribute('data-id'),
            name: station.getAttribute('data-name'),
            latitude: parseFloat(station.getAttribute('data-latitude')),
            longitude: parseFloat(station.getAttribute('data-longitude')),

        });
    });

    return stations;
}
 */


let markers = new L.FeatureGroup();


function addStations (points) {
        points.forEach((point) => {
            let icon = L.divIcon({
                html: `<a class="icon KnKod-${point.geodata.KnKod}" id="${point.id}">
<div class="icon-content"></div><options id="station-${point.id}"
data-longitude=${point.longitude} 
data-latitude=${point.latitude} 
data-station="${point.id}" 
data-name="${point.name}"
data-set="annualTemperatures" 
data-hosturl="http://vizchange.hopto.org">
<!-- data-hosturl="https://acp.k8s.glimworks.se" -->

</options><a>`,
                className: 'icon-container hide KnKod-'+ point.geodata.KnKod + ' LnKod-' + point.geodata.LnKod,
                childId: point.id,
                configId: `#station-${point.id}`
            });
            let latLng = L.latLng(point.latitude, point.longitude)
            let marker = L.marker(latLng, {
                icon: icon,
            })

            marker.on('click', (event) => {
                $(`.plotArea`).removeClass('active')
                map.flyTo(event.target['_latlng'])
                $(`.plotArea`).toggleClass('active')

                $(`#plotField`).removeClass('show')
                $(`#plotField`).toggleClass('show')

                $('#plotConfig').attr('data-longitude', point.longitude)
                $('#plotConfig').attr('data-latitude', point.latitude)
                let configId = event.target.options.icon.options.configId;
                lib.renderFromData("mark", configId)
            })
            marker.bindPopup(`<b>${point.name}</b><br>${point.params}`)
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
        click: (e) => {
            let LnKod = feature.properties.LnKod;
            let KnKod = Number(feature.properties.KnKod);
            zoomToFeature(e, isNaN(Number(KnKod ? KnKod : LnKod)));

            if (KnKod) {
                // Remove the 'show' class from all icons and add it to the relevant ones
                //$(`.icon-container`).removeClass('show');
                $(`.icon-container`).removeClass('show');
                $(`.icon-container.KnKod-${KnKod}`).toggleClass('show');
                //$(`.kommun.KnKod-${KnKod}`).toggleClass('show');
            } else {
                // Handle landskap click if no KnKod (province)
                $(`.kommun`).removeClass('show');
                $(`.LnKod-${LnKod}`).removeClass('show');
                $(`.LnKod-${LnKod}`).toggleClass('active');
                $(`.kommun`).removeClass('show active');
                $(`.kommun.LnKod-${LnKod}`).toggleClass('show active');
            }
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
    kommun_layer = L.geoJSON(kommuner, {
        onEachFeature: onEachFeature,
        style: (feature) => {
            let kod = feature.properties.KnKod;
            // take first two numbers in KnKod
            let land = Math.floor(feature.properties.KnKod / 100)
            land = ""+land
            land = land.length === 1 ? "0"+land : land
            return {
                className: `kommun KnKod-${kod} LnKod-${land}`,
            };
        },
        zoom: 1,
    })
    await kommun_layer.addTo(map);
    let land_layer = L.geoJSON(landskap, {
        onEachFeature: onEachFeature,
        style: (feature) => {
            return {
                className: 'landskap LnKod-' + feature.properties.LnKod + ' show'
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

document.getElementById('temperatureButton').addEventListener('click', function() {
    // Render the temperature plot
    console.log("Temperature plot selected");
    $('.plot-button').removeClass('active')
    $('#temperatureButton').toggleClass('active')
    //lib.renderFromData("mark", "#station-temperature");
});

document.getElementById('precipitationButton').addEventListener('click', function() {
    // Render the precipitation plot
    console.log("Precipitation plot selected");
    $('.plot-button').removeClass('active')
    $('#precipitationButton').toggleClass('active')
    //lib.renderFromData("mark", "#station-precipitation");
});

document.getElementById('snowDepthButton').addEventListener('click', function() {
    // Render the snow depth plot
    console.log("Snow Depth plot selected");
    $('.plot-button').removeClass('active')
    $('#snowDepthButton').toggleClass('active')
    //lib.renderFromData("mark", "#station-snowdepth");
});
