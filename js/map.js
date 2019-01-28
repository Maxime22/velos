
class Map {

    constructor() {
        this.myMap = null;
        this.markers = []; // we create a list for the objects markers
        this.iconBase = null;
        this.markerClusters = null;
        this.icons = [];
    }

    initMap(lat, lon, iconBase) {

        this.iconBase = iconBase
        // Create the object "myMap" and insert it in the HTML where the id is "map"
        this.myMap = L.map('map').setView([lat, lon], 11);
        // Leaflet doesn't receive the map (tiles) on a default server, we have to tell him which server we want. Here OpenStreetMap.fr
        // L correspond to the object Leaflet
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
            // Data Source (always better to say from where does it come from)
            attribution: 'Datas © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - <a href="//openstreetmap.fr">OSM France</a>',
            minZoom: 12,
            maxZoom: 20
        }).addTo(this.myMap);
        // Initialize the assembling of markers
        this.markerClusters = L.markerClusterGroup();
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

            creteilStations.forEach(function (station, index) {
                let myIcon = thisObject.createIcon()
                let marker = L.marker([station.position.lat, station.position.lng], { icon: myIcon });

                //thisObject.icons.push(myIcon)
                // let marker = L.marker([station.position.lat, station.position.lng], { icon: thisObject.icons[index] }); // we send the icon of our class because we need to update this icon, and the icon has to modify at the same time
                // MarkerClusters
                thisObject.markerClusters.addLayer(marker);
                //let marker2 = L.marker([station.position.lat, station.position.lng]).addTo(thisObject.myMap);
                // ADD ALL WHAT WE NEED AS INFORMATIONS IN THE MARKER FOR THE EVENT CLICK
                // STATIC DATAS
                marker.station_number = station.number
                marker.station_contract_name = station.contract_name
                marker.station_name = station.name
                marker.station_address = station.address
                marker.station_banking = station.banking
                marker.station_bonus = station.bonus
                marker.on('click', thisObject.onClickMarker) // On is like addEventListener
                // marker.bindPopup(station.name); // Add a pop up to see the address of each station
                // We fill and initialize the list marker to have all the informations we need about the stations who are in the markers
                thisObject.markers.push(marker);
                // UPDATE DYNAMIC DATAS => NECESSARY ?
                setInterval(() => thisObject.updateMarkerDatas(marker, station), 2000000); // each 20000 ms
                // UPDATE ICONS, LIKE THAT ?
                setInterval(() => thisObject.updateIcons(marker), 20000); // each 20000 ms
            });
            // setInterval(console.log(thisObject.markers[0]), 2000) // Check if the dynamic datas change
            thisObject.myMap.addLayer(thisObject.markerClusters);
        });
    }

    onClickMarker(eventMarker) {
        //console.log(eventMarker.target.station_address)
    }

    createIcon() {
        // We define the icon for the marker, size (iconSize), position (iconAnchor) and popupAnchor
        let myIcon = L.icon({
            iconUrl: this.iconBase + "bluemark.png",
            iconSize: [30, 50],
            iconAnchor: [14, 50]
            //popupAnchor: [0, 100],
        });
        return myIcon;
    }

    updateIcons(marker) {
        if(marker.station_available_bikes > 5){
            let myIcon = L.icon({
                iconUrl: this.iconBase + "greenmark.png",
                iconSize: [30, 50],
                iconAnchor: [14, 50]
            });
        }
        /* for (let index = 0; index < this.markers.length; index++) {
            if (this.markers[index].station_number === marker.station_number) {
                this.markers[index] = marker;
            }
        } */
    }

    // EST-CE QUE CETTE FONCTION RECALL L'API ?
    updateMarkerDatas(marker, station) {
        marker.station_status = station.status
        marker.station_bike_stands = station.bike_stands
        marker.station_available_bike_stands = station.available_bike_stands
        marker.station_available_bikes = station.available_bikes
        marker.station_last_update = station.last_update
        for (let index = 0; index < this.markers.length; index++) {
            if (this.markers[index].station_number === marker.station_number) { // if the station number is the same, we update the list of markers
                this.markers[index] = marker;
            }
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