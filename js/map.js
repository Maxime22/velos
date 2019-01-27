
// JCDECAUX, the second parameter is the callback function
ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=1f9c43ee6a3f921ba77e7aa991c9dcd9a957a85f", function (response) {
    var creteilStations = JSON.parse(response);
    /* Display all the creteil station names */
    creteilStations.forEach(function(station){
        console.log(station.name," latitude : ", station.position.lat," longitude : ", station.position.lng);
        
    });
});

// Ajax call
function ajaxGet(url, callback) {
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