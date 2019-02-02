class Canvas {

    constructor() {
        this.displayValid = null;
        this.idContainerCanvas = null;
        this.idCanvas = null;
        this.idBtnValidation = null;
        this.idBtnErase = null;
        this.canIDraw = null;

        this.canvas = null;
        this.context = null;
    }

    initCanvas(configCanvas) {
        this.idContainerCanvas = configCanvas.idContainerCanvas;
        this.idCanvas = configCanvas.idCanvas;
        this.idBtnValidation = configCanvas.idValidationButton;
        this.idBtnErase = configCanvas.idEraseButton;
        this.displayValid = false;
        this.canIDraw = false;
    }

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

    createButtonValidation() {
        let buttonValidation = document.createElement("button")
        buttonValidation.classList.add("btn", "btn-success")
        buttonValidation.setAttribute("id", this.idBtnValidation)
        buttonValidation.textContent = "Valider"
        return buttonValidation
    }

    createButtonErase() {
        let buttonErase = document.createElement("button")
        buttonErase.classList.add("btn", "btn-danger")
        buttonErase.setAttribute("id", this.idBtnErase)
        buttonErase.textContent = "Effacer"
        return buttonErase
    }

    createListenersCanvas() {
        let canvas = document.getElementById(this.idCanvas)
        let context = canvas.getContext('2d')
        let btnReservation = document.getElementById("reservationBtn")
        let buttonErase = document.getElementById(this.idBtnErase)
        let buttonValidation= document.getElementById(this.idBtnValidation)

        btnReservation.addEventListener("click", () => {
            this.displayCanvasAndButtons();
        });

        buttonErase.addEventListener("click", () => {
            this.eraseCanvas();
        });

        buttonValidation.addEventListener("click", () =>{
            this.validateCanvas();
        });

        canvas.addEventListener("mousedown", (eventMouse) => {
            this.canIDraw = true; // Allow to draw
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
            this.canIDraw = false;
        });

    }

    displayCanvasAndButtons() {
        if (this.displayValid === false) {
            let divContainerCanvas = document.getElementById(this.idContainerCanvas)
            divContainerCanvas.style.display = "block";

            this.displayValid = true;
        }
    }

    eraseCanvas() {
        let canvas = document.getElementById(this.idCanvas)
        let context = canvas.getContext('2d')
        context.clearRect(0, 0, 300, 150);
    }

    validateCanvas(){

    }


}
