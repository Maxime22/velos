class Reservation {

    constructor() {
        this.displayValid = null;
        this.idContainerCanvas = null;
        this.idCanvas = null;
        this.idBtnValidation = null;
        this.idBtnErase = null;
        this.canIDraw = null;
        this.isCanvasFilled = null;
    }

    initReservation(configCanvas) {
        this.idContainerCanvas = configCanvas.idContainerCanvas;
        this.idCanvas = configCanvas.idCanvas;
        this.idBtnValidation = configCanvas.idValidationButton;
        this.idBtnErase = configCanvas.idEraseButton;
        this.displayValid = false;
        this.canIDraw = false;
        this.isCanvasFilled = false;
    }

    createReservation() {
        this.createCanvas()
        this.createTimer()
        this.createListenerReservations()
    }

    /* RESERVATION LOGIC */

    createListenerReservations() {
        let divContainerCanvas = document.getElementById(this.idContainerCanvas)
        let familyName = document.getElementById("nameFam")
        let firstName = document.getElementById("nameFirst")

        this.createBtnReservationListener()

        familyName.addEventListener("input", (e) => { // called each time the input is changed
            if (e.target.value === "") {
                this.updateCanvas() // delete the signature
                divContainerCanvas.style.display = "none" // delete the canvas container and the buttons if an input is not filled
                this.displayValid = false;
            }
        })

        firstName.addEventListener("input", (e) => {
            if (e.target.value === "") {
                this.updateCanvas() // delete the signature
                divContainerCanvas.style.display = "none" // delete the canvas container and the buttons if an input is not filled
                this.displayValid = false;
            }
        })
    }

    createBtnReservationListener() {
        let btnReservation = document.getElementById("reservationBtn")
        let familyName = document.getElementById("nameFam")
        let firstName = document.getElementById("nameFirst")

        btnReservation.addEventListener("click", () => {
            if (familyName.checkValidity() && firstName.checkValidity()) {
                if (!sessionStorage.getItem("alreadyReserved")) { // check if we already reserved
                    this.displayCanvasAndButtons();
                } else {
                    alert("Un vélo est déjà réservé, veuillez annuler cette réservation pour en prendre un autre si vous le souhaitez")
                }
            }else{
                alert("Veuillez remplir votre nom et votre prénom pour pouvoir réserver")
            }
        });
    }

    validateReservation(eventValidate) {
        eventValidate.preventDefault(); // forbid the submission of the form
        let divContainerCanvas = document.getElementById(this.idContainerCanvas)
        let familyName = document.getElementById("nameFam")
        let firstName = document.getElementById("nameFirst")
        let reservationInformations = document.getElementById("webStorageInfos")
        let buttonCancelAll = document.getElementById("cancelAllButton")

        this.getAllStationData() // get all the data then send it to sessionStorage

        this.updateCanvas() // delete the signature
        divContainerCanvas.style.display = "none" // delete the canvas container
        this.displayValid = false;

        localStorage.setItem("familyName", familyName.value) // store the family name in the API Web Storage
        localStorage.setItem("firstName", firstName.value) // store the first name in the API Web Storage
        sessionStorage.setItem("alreadyReserved", true) // create a storage for the reservation checking, to not be able to reserve several times

        buttonCancelAll.style.display = "inline-block";

        reservationInformations.textContent =
            "Une réservation à la station " + sessionStorage.getItem("stationName") + " a été faite par " + localStorage.getItem("familyName") + " " + localStorage.getItem("firstName")
    }

    getAllStationData() {
        let stationName = document.getElementById('stationName')
        let stationAddress = document.getElementById('stationAddress')
        let stationStatus = document.getElementById('stationStatus')
        let nbTotalPlace = document.getElementById('nbTotalPlace')
        let availablePlaces = document.getElementById('availablePlaces')
        let availableBikes = document.getElementById('availableBikes')
        let buttonReservation = document.getElementById("reservationBtn")
        let messageBikesAvailable = document.getElementById("messageBikeAvailable")

        let numberNbTotalPlace = Number(nbTotalPlace.textContent)
        let numberAvailablePlaces = Number(availablePlaces.textContent)
        let numberAvailableBikes = Number(availableBikes.textContent)

        numberAvailableBikes-- // we take a bike
        if (numberAvailableBikes !== 0) { // we check if we have more than 0 otherwise we tell it to the customer
            buttonReservation.removeAttribute("disabled")
            messageBikesAvailable.textContent = ""
        } else {
            buttonReservation.disabled = true;
            messageBikesAvailable.textContent = "Aucun vélos disponibles !"
        }

        this.sendToSessionStorage(stationName, stationAddress, stationStatus, numberNbTotalPlace, numberAvailablePlaces, numberAvailableBikes);

        availableBikes.textContent = numberAvailableBikes; // we update the number of bikes
    }

    sendToSessionStorage(stationName, stationAddress, stationStatus, numberNbTotalPlace, numberAvailablePlaces, numberAvailableBikes){
        sessionStorage.setItem("stationName", stationName.textContent) // we send all to the sessionStorage
        sessionStorage.setItem("stationAddress", stationAddress.textContent)
        sessionStorage.setItem("stationStatus", stationStatus.textContent)
        sessionStorage.setItem("numberNbTotalPlace", numberNbTotalPlace)
        sessionStorage.setItem("numberAvailablePlaces", numberAvailablePlaces)
        sessionStorage.setItem("numberAvailableBikes", numberAvailableBikes)
    }

    /* CANVAS LOGIC */

    createCanvas() {
        let divContainerCanvas = document.getElementById(this.idContainerCanvas)
        let divContainerButtons = document.createElement("div");
        divContainerButtons.setAttribute("id", "containerButtonsCanvas")
        let canvas = document.createElement("canvas")
        canvas.setAttribute("id", this.idCanvas)

        let buttonValidation = this.createButtonValidation()
        let buttonErase = this.createButtonErase()

        divContainerButtons.appendChild(buttonValidation)
        divContainerButtons.appendChild(buttonErase)
        divContainerCanvas.appendChild(canvas)
        divContainerCanvas.appendChild(divContainerButtons)

        this.createListenersCanvas()
    }

    createListenersCanvas() {
        let buttonErase = document.getElementById(this.idBtnErase)
        let buttonValidation = document.getElementById(this.idBtnValidation)

        this.createMouseListeners()

        buttonErase.addEventListener("click", (eventErase) => {
            this.eraseCanvas(eventErase);
        });

        buttonValidation.addEventListener("click", (eventValidate) => {
            this.validateReservation(eventValidate);
        });
    }

    createMouseListeners() {
        let canvas = document.getElementById(this.idCanvas)
        let context = canvas.getContext('2d')

        canvas.addEventListener("mousedown", (eventMouse) => {
            this.canIDraw = true; // Allow to draw
            this.isCanvasFilled = true;
            context.strokeStyle = "black";
            context.beginPath();
            context.moveTo(eventMouse.offsetX, eventMouse.offsetY);

            canvas.addEventListener("mousemove", (eventMouse) => {
                if (this.canIDraw) {
                    context.lineTo(eventMouse.offsetX, eventMouse.offsetY)
                    context.stroke()
                }
            });
        });

        document.addEventListener("mouseup", () => { // Forbid to draw
            this.canIDraw = false
            this.checkIfCanvasIsFilled()
        });
    }

    createButtonValidation() {
        let buttonValidation = document.createElement("button")
        buttonValidation.classList.add("btn", "btn-success")
        buttonValidation.setAttribute("id", this.idBtnValidation)
        buttonValidation.textContent = "Valider"
        buttonValidation.disabled = "disabled" // We can't validate at the creation
        return buttonValidation
    }

    createButtonErase() {
        let buttonErase = document.createElement("button")
        buttonErase.classList.add("btn", "btn-danger")
        buttonErase.setAttribute("id", this.idBtnErase)
        buttonErase.textContent = "Effacer"
        buttonErase.disabled = "disabled" // We can't erase at the creation
        return buttonErase
    }

    disableButtonsValidateAndErase() { // forbid the validation and the erase when the canvas is erased or we just validated
        let buttonErase = document.getElementById(this.idBtnErase)
        let buttonValidation = document.getElementById(this.idBtnValidation)
        buttonErase.disabled = "disabled"
        buttonValidation.disabled = "disabled"
    }

    checkIfCanvasIsFilled() { // allow the validation or the erase if when we filled the canvas
        let buttonErase = document.getElementById(this.idBtnErase)
        let buttonValidation = document.getElementById(this.idBtnValidation)
        if (this.isCanvasFilled) {
            buttonErase.removeAttribute("disabled")
            buttonValidation.removeAttribute("disabled")
        }
    }

    displayCanvasAndButtons() {
        if (this.displayValid === false) {
            let divContainerCanvas = document.getElementById(this.idContainerCanvas)
            divContainerCanvas.style.display = "block";
            this.displayValid = true;
        }
    }

    eraseCanvas(eventErase) {
        eventErase.preventDefault();
        let canvas = document.getElementById(this.idCanvas)
        let context = canvas.getContext('2d')
        context.clearRect(0, 0, 300, 150);
        this.isCanvasFilled = false;
        this.disableButtonsValidateAndErase()
    }

    updateCanvas() { // without the preventDefault of eraseCanvas otherwise the validateReservation function doesn't work
        let canvas = document.getElementById(this.idCanvas)
        let context = canvas.getContext('2d')
        context.clearRect(0, 0, 300, 150);
        this.isCanvasFilled = false;
        this.disableButtonsValidateAndErase()
    }

    /* TIMER AND FOOTER */

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
