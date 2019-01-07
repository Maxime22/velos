ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=creteil&apiKey=1f9c43ee6a3f921ba77e7aa991c9dcd9a957a85f", function (response) {
    var creteilStations = JSON.parse(response);
    /* Display all the creteil station names */
    creteilStations.forEach(function(station){
        console.log(station.name);
        console.log(station.address);
    });
});