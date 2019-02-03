class Timer {

    constructor() {

    }

    initTimer() {

    }

    createTimer() {
        this.createTimerListener();
        this.displaySessionStorageInformations();
    }

    createTimerListener() {
        let buttonCancelAll = document.getElementById("cancelAllButton")

        buttonCancelAll.addEventListener("click", () => {
            this.cancelAll(buttonCancelAll);
        })
    }

    displaySessionStorageInformations(){
        let reservationInformations = document.getElementById("webStorageInfos")
        let buttonCancelAll = document.getElementById("cancelAllButton")
        
        if (sessionStorage.getItem("stationName")) {
            buttonCancelAll.style.display = "inline-block";
            reservationInformations.textContent = "Une réservation à la station " + sessionStorage.getItem("stationName") + " a été faite par " + " " + localStorage.getItem("familyName") + localStorage.getItem("firstName")
        }
    }

    cancelAll(buttonCancelAll) {
        let reservationInformations = document.getElementById("webStorageInfos")
        let availableBikes = document.getElementById('availableBikes')
        let numberAvailableBikes = Number(availableBikes.textContent)
        let familyName = document.getElementById("nameFam")
        let firstName = document.getElementById("nameFirst")

        familyName.value = ""; // we clear the inputs
        firstName.value = "";

        numberAvailableBikes++ // we replace the bike
        sessionStorage.clear()
        localStorage.clear()
        buttonCancelAll.style.display = "none";
        reservationInformations.textContent = "Pas de réservation pour le moment"
        availableBikes.textContent = numberAvailableBikes; // we update the number of bikes
    }

}