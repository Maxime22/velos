
class Map {

    constructor() {
        this.myMap = null;
        this.markers = []; // we create a list for the objects markers
    }

    initMap(lat, lon) {
        // Create the object "myMap" and insert it in the HTML where the id is "map"
        this.myMap = L.map('map').setView([lat, lon], 11);
        // Leaflet doesn't receive the map (tiles) on a default server, we have to tell him which server we want. Here OpenStreetMap.fr
        // L correspond to the object Leaflet
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // Data Source (always better to say from where does it come from)
            attribution: 'Datas © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 14,
            maxZoom: 20
        }).addTo(this.myMap);

        // Create markers
        this.createMarkersAndInitStations()
    }

    // We use the JCDECAUX API and the ajaxGet function, the second parameter is the callback function
    createMarkersAndInitStations() {
        // We extend the scope of this otehrwise it is undefined in the functions
        let thisObject = this;
        this.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=1f9c43ee6a3f921ba77e7aa991c9dcd9a957a85f", function (response) {
            // Take the stations from the API JCDECAUX    
            let creteilStations = JSON.parse(response);
            creteilStations.forEach(function (station) {
                // console.log(station.name, " latitude : ", station.position.lat, " longitude : ", station.position.lng);
                let marker = L.marker([station.position.lat, station.position.lng]).addTo(thisObject.myMap);
                // ADD ALL WHAT WE NEED AS INFORMATIONS IN THE MARKER FOR THE EVENT
                marker.station_number = station.number
                marker.station_contract_name = station.contract_name
                marker.station_name = station.name
                marker.station_address = station.address
                marker.station_banking = station.banking
                marker.station_bonus = station.bonus
                marker.station_status = station.status
                marker.station_bike_stands = station.bike_stands
                marker.station_available_bike_stands = station.available_bike_stands
                marker.station_available_bikes = station.available_bikes
                marker.station_last_update = station.last_update
                // console.log(marker)
                marker.on('click', thisObject.onClickMarker) // On is like addEventListener
                // marker.bindPopup(station.name); // Add a pop up to see the address of each station
                // We fill and initialize the list marker to have all the informations we need about the stations who are in the markers
                thisObject.markers.push(marker);
            });
        });
    }

    onClickMarker(eventMarker) {
        console.log(eventMarker.target.station_address)
    }

    // Ajax call function
    ajaxGet(url, callback) {
        // HTTP Request
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                // send the response to the callback method
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function () {
            console.error("Erreur réseau avec l'URL " + url);
        });
        req.send(null);
    }

}