
class Map {

    constructor() {
        this.myMap = null;

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
    }

    createMarkers(){
        this.callJCDecaux()
        
    }

    callJCDecaux() {
        // We use the JCDECAUX API and the ajaxGet function, the second parameter is the callback function
        let thisObject = this;
        this.ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=1f9c43ee6a3f921ba77e7aa991c9dcd9a957a85f", function (response) {
            let creteilStations = JSON.parse(response);
            // Display all the creteil station names
            creteilStations.forEach(function (station) {
                console.log(station.name, " latitude : ", station.position.lat, " longitude : ", station.position.lng);
                let marker = L.marker([station.position.lat, station.position.lng]).addTo(thisObject.myMap);
                // Add a pop up to see the address
                marker.bindPopup(station.name);
            });
        });
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