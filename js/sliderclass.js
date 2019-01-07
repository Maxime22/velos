class Slider {

    constructor() {
        this.next = null;
        this.prev = null;
        this.stopBtn = null;
        this.restartBtn = null;
        this.btnFirstSlide = null;
        this.currentSlide = null;
        this.run = null;
        this.widthBar = null;
        this.intvl = null;
        this.intervals = []; /* Will be used to store the intervals in a global table and to be able to delete them */
        this.imagesSlide = ["imgSlid1", "imgSlid2", "imgSlid3", "imgSlid4"];
    }

    init() {
        this.next = document.getElementById("next");
        this.prev = document.getElementById("prev");
        this.stopBtn = document.getElementById("stopDiap");
        this.restartBtn = document.getElementById("startDiap");
        this.btnFirstSlide = document.getElementById("firstButtonSlide");
        this.currentSlide = 1;
        this.run = 1; /* for the spacebar event, to know if the progressBar runs */
        this.widthBar = 0;
    }

    createHtml() {
        let sectionId = document.getElementById("diaporama");

        /* CENTER */
        let divCenterText = document.createElement("div");
        divCenterText.classList.add("row", "centerText");
        sectionId.appendChild(divCenterText);

        /* IMAGES */
        this.imagesSlide.forEach(function (element) {
            let divImg = document.createElement("div");
            divImg.classList.add("imgDiap");
            divImg.setAttribute("id", element);

            let divBlockInstru = document.createElement("div");
            divBlockInstru.classList.add("blockInstructions");

            let spanInstruction = document.createElement("span");
            spanInstruction.classList.add("instructionsWhite");

            if (element == "imgSlid1") {

                let titleImg = document.createElement("h1");
                titleImg.classList.add("titleDiap");

                let lobsterStyleSMF = document.createElement("span");
                lobsterStyleSMF.classList.add("lobsterStyle");
                lobsterStyleSMF.textContent = "SMF Vélos";
                titleImg.appendChild(lobsterStyleSMF);

                titleImg.append(" , l'application de réservation "); /* allow to add object or text after the last child */

                let spanGreen = document.createElement("span");
                spanGreen.classList.add("vertT");
                spanGreen.textContent = "écolo !";
                titleImg.appendChild(spanGreen);

                spanInstruction.textContent = `Ce diaporama vous explique toute la démarche à suivre pour réserver en ligne, 
                alors n'hésitez plus !`;
                spanInstruction.classList.remove("instructionsWhite");
                spanInstruction.classList.add("instructions");

                let btnFirstSlide = document.createElement("a");
                btnFirstSlide.classList.add("btn", "btn-primary");
                btnFirstSlide.setAttribute("id","firstButtonSlide")
                btnFirstSlide.textContent = "Cliquez-ici pour en savoir plus";

                divBlockInstru.appendChild(titleImg);
                divBlockInstru.appendChild(spanInstruction);
                divBlockInstru.appendChild(btnFirstSlide);


            } else if (element == "imgSlid2") {

                spanInstruction.textContent = `C'est simple et rapide ! La carte vous permet de choisir la station la
                plus proche, il suffit de cliquer dessus`;
                divBlockInstru.appendChild(spanInstruction);

            } else if (element == "imgSlid3") {

                spanInstruction.textContent = `Des informations vous sont données concernant le nombre de
                disponibilités`;
                divBlockInstru.appendChild(spanInstruction);

            } else if (element == "imgSlid4") {

                spanInstruction.textContent = `Vous signez et c'est terminé !`;
                divBlockInstru.appendChild(spanInstruction);

            }

            divImg.appendChild(divBlockInstru);
            divCenterText.appendChild(divImg);
        });

        /* BUTTONS */

        let prev = document.createElement("a");
        prev.setAttribute("id", "prev");
        prev.innerHTML = "&#10094;";

        let next = document.createElement("a");
        next.setAttribute("id", "next");
        next.innerHTML = "&#10095;";

        divCenterText.appendChild(prev);
        divCenterText.appendChild(next);

        /* CONTROL */

        let divContainControl = document.createElement("div");
        divContainControl.classList.add("container-fluid");

        let divControl = document.createElement("div");
        divControl.classList.add("col-12", "row", "controlDiap");

        let startContain = document.createElement("div");
        startContain.classList.add("offset-5", "col-1");
        let restartBtn = document.createElement("a");
        restartBtn.setAttribute("id", "startDiap");
        let icoStart = document.createElement("i");
        icoStart.classList.add("fas", "fa-play");
        restartBtn.appendChild(icoStart);
        startContain.appendChild(restartBtn);

        let stopContain = document.createElement("div");
        stopContain.classList.add("col-1");
        let stopBtn = document.createElement("a");
        stopBtn.setAttribute("id", "stopDiap");
        let icoStop = document.createElement("i");
        icoStop.classList.add("fas", "fa-pause");
        stopBtn.appendChild(icoStop);
        stopContain.appendChild(stopBtn);

        divControl.appendChild(startContain);
        divControl.appendChild(stopContain);
        divContainControl.appendChild(divControl);

        divCenterText.appendChild(divContainControl);

        /* PROGRESS BAR */

        let divProgress = document.createElement("div");
        divProgress.setAttribute("id", "myProgress");

        let divTime = document.createElement("div");
        divTime.setAttribute("id", "divTime");

        divProgress.appendChild(divTime);
        divCenterText.appendChild(divProgress);

    }

    changeSlide(changeSlideVar, run) {
        let numberOfSlides = document.getElementsByClassName("imgDiap");
        this.run = run;

        this.currentSlide = this.currentSlide + changeSlideVar;

        if (this.currentSlide <= 0) {
            this.currentSlide = numberOfSlides.length;
        }
        if (this.currentSlide > numberOfSlides.length) {
            this.currentSlide = 1;
        }

        for (let i = 0; i < numberOfSlides.length; i++) {
            numberOfSlides[i].style.display = "none";
        }

        numberOfSlides[this.currentSlide - 1].style.display = "block";

        // Each time we change the slide, the progress bar is reinitialized
        this.progressBar(0);
    }

    progressBar(widthBar2) {
        let elem = document.getElementById("divTime");
        this.intervals.forEach(clearInterval); // clear all the intervals used if some exist
        this.intvl = setInterval(this.frame(widthBar2, elem), 20); // each 20 ms we add 0.4% so each 2000ms we add 40% so each 5000ms we have widthBar = 100%
        this.intervals.push(this.intvl);
    }

    frame(widthBar2, elem) {
        if (widthBar2 >= 100) {
            clearInterval(this.intvl);
            changeSlide(1, 1);
            widthBar2 = 0;
            this.widthBar = widthBar2;
        } else {
            widthBar2 = widthBar2 + 0.4;
            elem.style.width = widthBar2 + '%';
            this.widthBar = widthBar2; /* give the information globally notably for the startProgressBar function */
        }
    }

    stopProgressBar(run) {
        this.run = run;
        this.intervals.forEach(clearInterval); // clear all the intervals used if some exist, so it stop the progress bar
    }

    startProgressBar(run) {
        this.run = run;
        this.progressBar(this.widthBar); // clear all the intervals used if some exist, so it stops the progress bar
    }

}

let slider = new Slider;
slider.createHtml(); // Why can't i put this line after the eventListeners ??????

slider.btnFirstSlide.addEventListener("click", function (e) {
    slider.changeSlide(1, 1);
});

slider.stopBtn.addEventListener("click", function (e) {
    slider.stopProgressBar(0);
});

slider.restartBtn.addEventListener("click", function (e) {
    slider.startProgressBar(1);
});

slider.next.addEventListener("click", function (e) {
    slider.changeSlide(1, 1);
});

slider.prev.addEventListener("click", function (e) {
    slider.changeSlide(-1, 1);
});

document.addEventListener("keyup", function (e) {
    if (e.keyCode == "37") { /* Left Arrow */
        slider.changeSlide(-1, 1);
    }
    if (e.keyCode == "39") { /* Right Arrow */
        slider.changeSlide(1, 1);
    }
    if (e.keyCode == "32" && run == 1) {
        slider.stopProgressBar(0);
    } else if (e.keyCode == "32" && run == 0) {
        slider.startProgressBar(1);
    }

});

slider.init();
// We start the progress bar
slider.progressBar(0);