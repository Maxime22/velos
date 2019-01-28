class Map {

    constructor() {
        this.myMap = null;
        this.iconBase = null;
        this.markerClusters = null;
    }

    initMap(lat, lon, iconBase) {
        this.iconBase = iconBase
        // Create the object "myMap" and insert it in the HTML where the id is "map"
        this.myMap = L.map('map').setView([lat, lon], 13);
        // Leaflet doesn't receive the map (tiles) on a default server, we have to tell him which server we want. Here OpenStreetMap.fr
        // L correspond to the object Leaflet
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // Data Source (always better to say from where does it come from)
            attribution: 'Datas © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 13,
            maxZoom: 17
        }).addTo(this.myMap);
        // Initialize the assembling of markers
        this.markerClusters = L.markerClusterGroup();
        // Create markers
        this.createMarkersAndInitStations()
        // Update markers
        setInterval(() => this.createMarkersAndInitStations(), 20000); // each 20000 ms we call the API JCDecaux to have the datas we need
    }

    // We use the JCDECAUX API and the ajaxGet function, the second parameter is the callback function
    createMarkersAndInitStations() {
        // Clear all the markers in the Cluster
        this.markerClusters.clearLayers();
        this.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=1f9c43ee6a3f921ba77e7aa991c9dcd9a957a85f", (response) => {
            // Take the stations from the API JCDECAUX    
            let creteilStations = JSON.parse(response);
            creteilStations.forEach((station) => {
                let myIcon = this.updateIcons(station)
                let marker = L.marker([station.position.lat, station.position.lng], { icon: myIcon });
                // MarkerClusters
                // Add the marker on the layer
                this.markerClusters.addLayer(marker);
                // We add all what we need as informations in the marker for the event click
                // Static datas
                marker.station_number = station.number
                marker.station_contract_name = station.contract_name
                marker.station_name = station.name
                marker.station_address = station.address
                marker.station_banking = station.banking
                marker.station_bonus = station.bonus
                // Dynamic datas
                marker.station_status = station.status
                marker.station_bike_stands = station.bike_stands
                marker.station_available_bike_stands = station.available_bike_stands
                marker.station_available_bikes = station.available_bikes
                marker.station_last_update = station.last_update
                marker.on('click', this.onClickMarker) // On is like addEventListener
                // marker.bindPopup(station.name); // Add a pop up to see the address of each station
            });
            this.myMap.addLayer(this.markerClusters); // JE NE COMPRENDS PAS POURQUOI CA ENLEVE LES MARKERS ET NE RAJOUTE PAS UNE COUCHE SUPPLEMENTAIRE DANS LA MAP...
        });
    }

    onClickMarker(eventMarker) {
        //console.log(eventMarker.target.station_address)
        let stationName = document.getElementById('stationName');
        let stationAddress = document.getElementById('stationAddress');
        let stationStatus = document.getElementById('stationStatus');
        let availablePlaces = document.getElementById('availablePlaces');
        let availableBikes = document.getElementById('availableBikes');

        stationName.textContent = eventMarker.target.station_name;
        stationAddress.textContent = eventMarker.target.station_address;
        stationStatus.textContent = eventMarker.target.station_status;
        availablePlaces.textContent = eventMarker.target.station_available_bike_stands;
        availableBikes.textContent = eventMarker.target.station_available_bikes;
    }

    updateIcons(station) { // en fonction de la station => je crée des icones différentes
        // We define the icon for the marker, size (iconSize), position (iconAnchor) and popupAnchor
        let myIcon = null;
        if (station.available_bikes > 5) {
            myIcon = L.icon({
                iconUrl: this.iconBase + "bluemark.png",
                iconSize: [30, 50],
                iconAnchor: [14, 50]
                //popupAnchor: [0, 100],
            });
        } else if (station.available_bikes <= 5) {
            myIcon = L.icon({
                iconUrl: this.iconBase + "greenmark.png",
                iconSize: [30, 50],
                iconAnchor: [14, 50]
                //popupAnchor: [0, 100],
            });
        }
        return myIcon;
    }

    // Ajax call function for the API which are sending the datas
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