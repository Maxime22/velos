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

    init(idSlider, imgs, config) {
        this.idSlider = idSlider;
        this.imgs = imgs;
        this.displayNextBeforeButtons = config.displayNextBeforeButtons;
        this.controlButtonsStartStop = config.controlButtonsStartStop;
        this.displayProgressBar = config.displayProgressBar;
        this.sliderNumber = config.sliderNumber;
        this.currentSlide = 1;
        this.run = true; /* for the spacebar event, to know if the progressBar runs */
        this.widthBar = 0;
    }

    createHtml() {
        let sectionId = document.getElementById(this.idSlider);
        let sliderContainer = document.createElement("div");
        sliderContainer.classList.add("row", "relativePos");
        sectionId.appendChild(sliderContainer);
        this.createSliderContent(sliderContainer);
        this.createInterface(sliderContainer);
        this.createEvents();
    }

    createSliderContent(sliderContainer) {
        let divFigure = document.createElement("div");
        divFigure.classList.add("divFigure");

        this.imgs.forEach((elementImage, index) => {
            let figure = document.createElement("figure");
            let image = document.createElement("img");
            let figcaption = document.createElement("figcaption");
            let figcaptionTitle = document.createElement("div");
            let figcaptionDescription = document.createElement("div");
            let btnSlide = document.createElement("a");

            this.createImages(figure, image, elementImage, index)
            this.createFigcaptions(figcaption, figcaptionTitle, figcaptionDescription, elementImage, index, btnSlide)

            if (index !== 0) { figure.style.display = "none" }
            /*   figure.style.opacity = '0'  */ // DURING THE CREATION, DELETE DISPLAY FOR OTHER SLIDES

            this.appendChildImg(figcaption, figcaptionTitle, figcaptionDescription, index, btnSlide, figure, image, divFigure)
        });

        sliderContainer.appendChild(divFigure);
    }

    createImages(figure, image, elementImage, index) {
        figure.classList.add("figureDiap");
        figure.classList.add('fig' + index);
        image.setAttribute('src', elementImage.url);
        image.setAttribute('alt', elementImage.alt);
        image.setAttribute('title', elementImage.title);
        image.classList.add("imgSlider");
    }

    createFigcaptions(figcaption, figcaptionTitle, figcaptionDescription, elementImage, index, btnSlide) {
        figcaption.classList.add("blockFigcaption");

        for (let i = 0; i < elementImage.figcaption.length; i++) {
            if (elementImage.figcaption[i].type === "title") { // TITLE
                figcaptionTitle.classList.add("titleDiap");
                figcaptionTitle.textContent = elementImage.figcaption[i].value;
            }
            if (elementImage.figcaption[i].type === "text") { // TEXT
                figcaptionDescription.textContent = elementImage.figcaption[i].value;
            }
            if (elementImage.figcaption[i].type === "button") { // BUTTONS
                btnSlide.classList.add("btn", "btn-primary", "firstButtonSlide");
                btnSlide.textContent = elementImage.figcaption[i].value;
            }
        }

        index === 0 ? figcaptionDescription.classList.add("instructions") : figcaptionDescription.classList.add("instructionsWhite");
    }

    appendChildImg(figcaption, figcaptionTitle, figcaptionDescription, index, btnSlide, figure, image, divFigure) {
        figcaption.appendChild(figcaptionTitle);
        figcaption.appendChild(figcaptionDescription);
        if (index === 0) {
            figcaption.appendChild(btnSlide);
        }
        figure.appendChild(image);
        figure.appendChild(figcaption);
        divFigure.appendChild(figure);
    }

    createInterface(sliderContainer) {
        this.createButtonNextPrev(sliderContainer)
        this.createControlStartStop(sliderContainer)
        this.createProgressBar(sliderContainer)
    }

    createButtonNextPrev(sliderContainer) {
        if (this.displayNextBeforeButtons === true) {
            let prev = document.createElement("a");
            let next = document.createElement("a");
            prev.classList.add("prev");
            prev.innerHTML = "&#10094;";
            next.classList.add("next");
            next.innerHTML = "&#10095;";
            sliderContainer.appendChild(prev);
            sliderContainer.appendChild(next);
        }
    }

    createControlStartStop(sliderContainer) {
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
            restartBtn.classList.add("startDiap");
            icoStart.classList.add("fas", "fa-play");
            stopContain.classList.add("col-1");
            stopBtn.classList.add("stopDiap");
            icoStop.classList.add("fas", "fa-pause");

            restartBtn.appendChild(icoStart);
            startContain.appendChild(restartBtn);
            stopBtn.appendChild(icoStop);
            stopContain.appendChild(stopBtn);
            divControl.appendChild(startContain);
            divControl.appendChild(stopContain);
            sliderContainer.appendChild(divControl);
        }
    }

    createProgressBar(sliderContainer) {
        if (this.displayProgressBar === true) {
            let divProgress = document.createElement("div");
            let divTime = document.createElement("div");

            divProgress.classList.add("myProgress");
            divTime.classList.add("divTime");

            divProgress.appendChild(divTime);
            sliderContainer.appendChild(divProgress);
        }
    }

    createEvents() {
        this.createButtonsEvents()
        this.createKeyboardEvents()
    }

    createButtonsEvents() {
        if (document.getElementsByClassName("firstButtonSlide")) {
            document.getElementsByClassName("firstButtonSlide")[this.sliderNumber].addEventListener("click", (e) => {
                this.changeSlide(1, true);
            });
        }

        if (this.controlButtonsStartStop === true) {
            let stopBtn = document.getElementsByClassName("stopDiap")[this.sliderNumber];
            let restartBtn = document.getElementsByClassName("startDiap")[this.sliderNumber];

            stopBtn.addEventListener("click", (e) => {
                this.startOrStopProgressBar(false);
            });
            restartBtn.addEventListener("click", (e) => {
                this.startOrStopProgressBar(true);
            });
        }

        if (this.displayNextBeforeButtons === true) {
            let next = document.getElementsByClassName("next")[this.sliderNumber];
            let prev = document.getElementsByClassName("prev")[this.sliderNumber];

            next.addEventListener("click", (e) => { // without this at the beginning we would have a this targeting the next and not the object
                this.changeSlide(1, true);
            });
            prev.addEventListener("click", (e) => {
                this.changeSlide(-1, true);
            });
        }
    }

    createKeyboardEvents() {
        document.addEventListener("keypress", (e) => { // Delete the scroll with the spacebar
            if (e.keyCode === 32) {
                e.preventDefault();
            }
        });

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

        if (this.currentSlide <= 0) { this.currentSlide = allSlides.length }
        if (this.currentSlide > allSlides.length) { this.currentSlide = 1 }

        for (let i = 0; i < allSlides.length; i++) {
            /* allSlides[i].style.opacity = "0"; */
            allSlides[i].style.display = "none";
        }

        /* allSlides[this.currentSlide - 1].style.opacity = "1"; */
        allSlides[this.currentSlide - 1].style.display = "block";

        // Each time we change the slide, the progress bar is reinitialized
        this.progressBar(0);
    }

    progressBar(widthBarParam) {
        this.widthBar = widthBarParam
        let progressElem = document.getElementsByClassName("divTime")[this.sliderNumber];
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
            widthBarParam = widthBarParam + 0.4;
            progressElem.style.width = widthBarParam + '%';
            this.widthBar = widthBarParam;
        }
    }

    startOrStopProgressBar(run) {
        this.run = run;
        run === true ? this.progressBar(this.widthBar) : this.intervals.forEach(clearInterval);
    }
}

