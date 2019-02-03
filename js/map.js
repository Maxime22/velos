class Map {

    constructor() {
        this.myMap = null;
        this.iconBase = null;
        this.markerClusters = null;
    }

    initMap(configMap) {
        this.iconBase = configMap.iconBase
        // Create the object "myMap" and insert it in the HTML where the id is "map"
        this.myMap = L.map('map').setView([configMap.lat, configMap.lon], 13);
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
        this.createMarkersAndInitStations() // the first time we init, we call the API
        // Update markers
        setInterval(() => this.createMarkersAndInitStations(), 1200000); // each 1 200 000 ms (20min) we call the API JCDecaux to have the datas we need
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
        let stationName = document.getElementById('stationName')
        let stationAddress = document.getElementById('stationAddress')
        let stationStatus = document.getElementById('stationStatus')
        let nbTotalPlace = document.getElementById('nbTotalPlace')
        let availablePlaces = document.getElementById('availablePlaces')
        let availableBikes = document.getElementById('availableBikes')
        let buttonReservation = document.getElementById("reservationBtn")
        let messageBikesAvailable = document.getElementById("messageBikeAvailable")
        let allDetailsOfTheReservation = document.getElementById("allDetailsOfTheReservation") // display the informations
        let startMessageInformation = document.getElementById("startMessageInformation")

        stationName.textContent = eventMarker.target.station_name;
        stationAddress.textContent = eventMarker.target.station_address;
        stationStatus.textContent = eventMarker.target.station_status;
        nbTotalPlace.textContent = eventMarker.target.station_bike_stands;
        availablePlaces.textContent = eventMarker.target.station_available_bike_stands;

        if (sessionStorage.getItem("numberAvailableBikes") && sessionStorage.getItem("stationName") === stationName.textContent) { // if we have already the number in the session storage and 
            // we are at the good station, we display this one, otherwise we take the data from the API
            availableBikes.textContent = sessionStorage.getItem("numberAvailableBikes")
        } else {
            availableBikes.textContent = eventMarker.target.station_available_bikes;
        }

        if (eventMarker.target.station_available_bikes !== 0) {
            buttonReservation.removeAttribute("disabled")
            messageBikesAvailable.textContent = ""
        } else {
            buttonReservation.disabled = true;
            messageBikesAvailable.textContent = "Aucun vélos disponibles !"
        }

        startMessageInformation.textContent = "";
        allDetailsOfTheReservation.style.display = "block";
    }

    updateIcons(station) { // en fonction de la station => je crée des icones différentes
        // We define the icon for the marker, size (iconSize), position (iconAnchor) and popupAnchor
        let myIcon = null;
        let percentageAvailable = station.available_bikes / station.bike_stands;
        let iconAnchorBase = [14, 50];
        let iconSizePerBikeStand = [10, 16]; // do that depending on the size of the station (bike_stands)
        if (10 <= station.bike_stands && station.bike_stands < 20) {
            iconSizePerBikeStand = [20, 32];
        } else if (20 <= station.bike_stands && station.bike_stands < 30) {
            iconSizePerBikeStand = [30, 48];
        } else if (30 <= station.bike_stands && station.bike_stands < 40) {
            iconSizePerBikeStand = [40, 64];
        } else if (40 <= station.bike_stands) {
            iconSizePerBikeStand = [50, 80];
        }

        if (station.status === "OPEN") {
            if (percentageAvailable === 0) {
                myIcon = L.icon({
                    iconUrl: this.iconBase + "redbikemark.png",
                    iconSize: iconSizePerBikeStand,
                    iconAnchor: iconAnchorBase
                    //popupAnchor: [0, 100],
                });
            } else if (0 <= percentageAvailable && percentageAvailable < 0.25) {
                myIcon = L.icon({
                    iconUrl: this.iconBase + "orangebikemark.png",
                    iconSize: iconSizePerBikeStand,
                    iconAnchor: iconAnchorBase
                });
            } else if (0.25 <= percentageAvailable && percentageAvailable < 0.5) {
                myIcon = L.icon({
                    iconUrl: this.iconBase + "yellowbikemark.png",
                    iconSize: iconSizePerBikeStand,
                    iconAnchor: iconAnchorBase
                });
            } else if (0.5 <= percentageAvailable && percentageAvailable < 0.75) {
                myIcon = L.icon({
                    iconUrl: this.iconBase + "bluebikemark.png",
                    iconSize: iconSizePerBikeStand,
                    iconAnchor: iconAnchorBase
                });
            } else if (0.75 <= percentageAvailable) {
                myIcon = L.icon({
                    iconUrl: this.iconBase + "greenbikemark.png",
                    iconSize: iconSizePerBikeStand,
                    iconAnchor: iconAnchorBase
                });
            }
            return myIcon;
        } else {
            myIcon = L.icon({
                iconUrl: this.iconBase + "graybikemark.png",
                iconSize: iconSizePerBikeStand,
                iconAnchor: iconAnchorBase
            });
        }
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