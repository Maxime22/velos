class Slider {

    constructor() {
        this.slider = null;
        this.imgs = null;
        this.displayNextBeforeButtons = null;
        this.controlButtonsStartStop = null;

        // not initialized in the init because i use init only if controlButtonsStartStop is on true, good method ?
        this.stopBtn = null;
        this.restartBtn = null;

        this.currentSlide = null;
        this.run = null;
        this.widthBar = null;
        this.intvl = null;
        this.intervals = []; // Will be used to store the intervals in a global table and to be able to delete them
    }

    init(idSlider, slider, imgs, displayNextBeforeButtons, controlButtonsStartStop, displayProgressBar) {
        /*
        this.btnFirstSlide = document.getElementById("firstButtonSlide");*/

        this.idSlider = idSlider;
        this.slider = slider;
        this.imgs = imgs;
        this.displayNextBeforeButtons = displayNextBeforeButtons;
        this.controlButtonsStartStop = controlButtonsStartStop;
        this.displayProgressBar = displayProgressBar;
        this.currentSlide = 1;
        this.run = true; /* for the spacebar event, to know if the progressBar runs */
        this.widthBar = 0;
    }

    createHtml() {

        let sectionId = document.getElementById(this.idSlider);

        // Create a div to contain the slider, necessary ?
        let sliderContainer = document.createElement("div");
        sliderContainer.classList.add("row", "relativePos");
        sectionId.appendChild(sliderContainer);

        this.createImages(sliderContainer);
        this.createInterface(sliderContainer);
        this.createEvents();
    }

    createImages(sliderContainer) {

        this.imgs.forEach(function (elementImage, index) {
            // IMAGE
            let figure = document.createElement("figure");
            figure.classList.add("figureDiap");
            figure.setAttribute("id", 'fig' + index);

            let image = document.createElement("img");
            image.setAttribute('src', elementImage.url);
            image.setAttribute('alt', elementImage.alt);
            image.setAttribute('title', elementImage.title);
            image.style.height = '720px';
            image.style.width = '100%';

            // FIGCAPTION
            let figcaption = document.createElement("figcaption");
            figcaption.classList.add("blockFigcaption");

            let figcaptionTitle = document.createElement("div");
            figcaptionTitle.classList.add("titleDiap");
            figcaptionTitle.textContent = elementImage.figcaptionTitle;

            let figcaptionDescription = document.createElement("div");
            if (index === 0) {
                figcaptionDescription.classList.add("instructions");
            } else {
                figcaptionDescription.classList.add("instructionsWhite");
            }
            figcaptionDescription.textContent = elementImage.figcaptionText;

            // DELETE DISPLAY FOR TEST
            if (index !== 0) {
                figure.style.display = 'none';
            }

            figcaption.appendChild(figcaptionTitle);
            figcaption.appendChild(figcaptionDescription);
            figure.appendChild(image);
            figure.appendChild(figcaption);
            sliderContainer.appendChild(figure);
        });

    }

    createInterface(sliderContainer) {

        // BUTTONS PREV AND NEXT
        if (this.displayNextBeforeButtons === true) {

            let prev = document.createElement("a");
            prev.setAttribute("id", "prev");
            prev.innerHTML = "&#10094;";

            let next = document.createElement("a");
            next.setAttribute("id", "next");
            next.innerHTML = "&#10095;";

            sliderContainer.appendChild(prev);
            sliderContainer.appendChild(next);
        }

        // CONTROL START AND STOP
        if (this.controlButtonsStartStop === true) {

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

            sliderContainer.appendChild(divControl);

            // GOOD TO PUT THAT HERE ?
            this.stopBtn = document.getElementById("stopDiap");
            this.restartBtn = document.getElementById("startDiap");
        }

        /* PROGRESS BAR */
        if (this.displayProgressBar === true) {
            let divProgress = document.createElement("div");
            divProgress.setAttribute("id", "myProgress");

            let divTime = document.createElement("div");
            divTime.setAttribute("id", "divTime");

            divProgress.appendChild(divTime);
            sliderContainer.appendChild(divProgress);
        }
    }

    createEvents() {

        /*this.slider.btnFirstSlide.addEventListener("click", function (e) {
            slider.changeSlide(1, true);
        });*/

        if (this.controlButtonsStartStop === true) {
            this.stopBtn.addEventListener("click", function (e) {
                slider.startOrStopProgressBar(false);
            });

            this.restartBtn.addEventListener("click", function (e) {
                slider.startOrStopProgressBar(true);
            });
        }

        if (this.displayNextBeforeButtons === true) {
            let next = document.getElementById("next");
            let prev = document.getElementById("prev");

            next.addEventListener("click", function (e) {
                slider.changeSlide(1, true);
            });

            prev.addEventListener("click", function (e) {
                slider.changeSlide(-1, true);
            });
        }

        document.addEventListener("keyup", function (e) {
            if (e.keyCode == "37") {
                slider.changeSlide(-1, true);
            }
            if (e.keyCode == "39") {
                slider.changeSlide(1, true);
            }
            if (e.keyCode == "32" && run === true) {
                //slider.startOrStopProgressBar(false);
            } else if (e.keyCode == "32" && run === false) {
                //slider.startOrStopProgressBar(true);
            }

        });

    }

    changeSlide(changeSlideVar, run) {
        let allSlides = document.getElementsByClassName("figureDiap");
        this.run = run;

        this.currentSlide = this.currentSlide + changeSlideVar;

        if (this.currentSlide <= 0) {
            this.currentSlide = allSlides.length;
        }
        if (this.currentSlide > allSlides.length) {
            this.currentSlide = 1;
        }

        for (let i = 0; i < allSlides.length; i++) {
            allSlides[i].style.display = "none";
        }

        allSlides[this.currentSlide - 1].style.display = "block";

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
            changeSlide(1, true);
            widthBar2 = 0;
            this.widthBar = widthBar2;
        } else {
            widthBar2 = widthBar2 + 0.4;
            elem.style.width = widthBar2 + '%';
            this.widthBar = widthBar2; // give the information globally notably for the startOrStopProgressBar function 
        }
    }

    startOrStopProgressBar(run){
        this.run = run;
        if(run === true){
            this.progressBar(this.widthBar);
        }else{
            this.intervals.forEach(clearInterval);
        }

    }


}

