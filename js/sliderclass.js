class Slider {

    constructor() {
        this.imgs = null;
        this.displayNextBeforeButtons = null;
        this.controlButtonsStartStop = null;
        this.currentSlide = null;
        this.run = null;
        this.widthBar = null;
        this.intvl = null;
        this.intervals = []; // Will be used to store the intervals in a global table and to be able to delete them
    }

    init(idSlider, imgs, displayNextBeforeButtons, controlButtonsStartStop, displayProgressBar) {
        this.idSlider = idSlider;
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

            let figure = document.createElement("figure");
            let divFigure = document.createElement("div");
            let image = document.createElement("img");
            let figcaption = document.createElement("figcaption");
            let figcaptionTitle = document.createElement("div");
            let figcaptionDescription = document.createElement("div");
            let btnFirstSlide = document.createElement("a");

            // FIGURE
            divFigure.setAttribute("id", "divFigure" + index); //ID

            // IMAGE
            figure.classList.add("figureDiap");
            figure.setAttribute("id", 'fig' + index); //ID

            image.setAttribute('src', elementImage.url);
            image.setAttribute('alt', elementImage.alt);
            image.setAttribute('title', elementImage.title);
            image.classList.add("imgSlider");

            // FIGCAPTION
            figcaption.classList.add("blockFigcaption");

            if (elementImage.figcaptionTitle) {
                figcaptionTitle.classList.add("titleDiap");
                figcaptionTitle.textContent = elementImage.figcaptionTitle.value;
            }

            if (index === 0) {
                figcaptionDescription.classList.add("instructions");
            } else {
                figcaptionDescription.classList.add("instructionsWhite");
            }

            figcaptionDescription.textContent = elementImage.figcaptionText.value[0];

            // BUTTON FOR THE FIRST SLIDE
            btnFirstSlide.classList.add("btn", "btn-primary");
            btnFirstSlide.setAttribute("id", "firstButtonSlide") //ID
            btnFirstSlide.textContent = "Cliquez-ici pour en savoir plus";

            // DELETE DISPLAY FOR OTHER SLIDES
            if (index !== 0) {
                figure.style.display = 'none';
            }

            // APPENDCHILD
            figcaption.appendChild(figcaptionTitle);
            figcaption.appendChild(figcaptionDescription);
            if (index === 0) {
                figcaption.appendChild(btnFirstSlide);
            }
            figure.appendChild(image);
            figure.appendChild(figcaption);
            divFigure.appendChild(figure);
            sliderContainer.appendChild(divFigure);
        });

    }

    createInterface(sliderContainer) {

        // BUTTONS PREV AND NEXT
        if (this.displayNextBeforeButtons === true) {

            let prev = document.createElement("a");
            let next = document.createElement("a");

            prev.setAttribute("id", "prev"); //ID
            prev.innerHTML = "&#10094;";

            next.setAttribute("id", "next"); //ID
            next.innerHTML = "&#10095;";

            sliderContainer.appendChild(prev);
            sliderContainer.appendChild(next);
        }

        // CONTROL START AND STOP
        if (this.controlButtonsStartStop === true) {

            let divControl = document.createElement("div");
            let startContain = document.createElement("div");
            let restartBtn = document.createElement("a");
            let icoStart = document.createElement("i");
            let stopContain = document.createElement("div");
            let stopBtn = document.createElement("a");
            let icoStop = document.createElement("i");

            divControl.classList.add("col-12", "row", "controlDiap");

            startContain.classList.add("offset-5", "col-1");

            restartBtn.setAttribute("id", "startDiap"); //ID

            icoStart.classList.add("fas", "fa-play");
            restartBtn.appendChild(icoStart);
            startContain.appendChild(restartBtn);

            stopContain.classList.add("col-1");

            stopBtn.setAttribute("id", "stopDiap"); //ID

            icoStop.classList.add("fas", "fa-pause");
            stopBtn.appendChild(icoStop);
            stopContain.appendChild(stopBtn);

            divControl.appendChild(startContain);
            divControl.appendChild(stopContain);

            sliderContainer.appendChild(divControl);

        }

        // PROGRESS BAR
        if (this.displayProgressBar === true) {
            let divProgress = document.createElement("div");
            let divTime = document.createElement("div");

            divProgress.setAttribute("id", "myProgress"); //ID

            divTime.setAttribute("id", "divTime"); //ID

            divProgress.appendChild(divTime);
            sliderContainer.appendChild(divProgress);
        }
    }

    createEvents() {

        if (document.getElementById("firstButtonSlide")) {
            document.getElementById("firstButtonSlide").addEventListener("click", (e) => {
                this.changeSlide(1, true);
            });
        }

        // has been initialized in the control interface but not sure it is like that
        if (this.controlButtonsStartStop === true) {
            let stopBtn = document.getElementById("stopDiap");
            let restartBtn = document.getElementById("startDiap");

            stopBtn.addEventListener("click", (e) => {
                this.startOrStopProgressBar(false);
            });

            restartBtn.addEventListener("click", (e) => {
                this.startOrStopProgressBar(true);
            });
        }

        if (this.displayNextBeforeButtons === true) {
            let next = document.getElementById("next");
            let prev = document.getElementById("prev");

            next.addEventListener("click", (e) => { // without this at the beginning we would have a this targeting the next and not the object
                this.changeSlide(1, true);
            });

            prev.addEventListener("click", (e) => {
                this.changeSlide(-1, true);
            });
        }

        document.addEventListener("keyup", (e) => {
            if (e.keyCode === 37) {
                this.changeSlide(-1, true);
            }
            if (e.keyCode === 39) {
                this.changeSlide(1, true);
            }
            if (e.keyCode === 32 && this.run === true) {
                e.preventDefault();
                this.startOrStopProgressBar(false);
            } else if (e.keyCode === 32 && this.run === false) {
                this.startOrStopProgressBar(true);
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

    progressBar(widthBarParam) {
        this.widthBar = widthBarParam
        let progressElem = document.getElementById("divTime");
        this.intervals.forEach(clearInterval); // clear all the intervals used if some exist
        this.intvl = setInterval(() => this.frame(this.widthBar, progressElem), 20); // each 20 ms we add 0.4% so each 2000ms we add 40% so each 5000ms we have widthBar = 100%
        this.intervals.push(this.intvl);

    }

    frame(widthBarParam, progressElem) {
        if (widthBarParam >= 100) {
            clearInterval(this.intvl);
            this.changeSlide(1, true);
            widthBarParam = 0;
            this.widthBar = widthBarParam;
        } else {
            console.log("progress bar progress")
            widthBarParam = widthBarParam + 0.4;
            progressElem.style.width = widthBarParam + '%';
            this.widthBar = widthBarParam;
        }
    }

    startOrStopProgressBar(run) {
        this.run = run;
        if (run === true) {
            this.progressBar(this.widthBar);
        } else {
            this.intervals.forEach(clearInterval);
        }
    }


}

