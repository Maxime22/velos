let next = document.getElementById("next");
let prev = document.getElementById("prev");
let stopBtn = document.getElementById("stopDiap");
let restartBtn = document.getElementById("startDiap");
let numberOfSlides = document.getElementsByClassName("imgDiap");
let btnFirstSlide = document.getElementById("firstButtonSlide");
let currentSlide = 1;
let run = 1; /* for the spacebar event, to know if the progressBar runs */
let widthBar = 0;
let intervals = []; /* Will be used to store the intervals in a global table and to be able to delete them */

// We start the progress bar
progressBar(0);

btnFirstSlide.addEventListener("click", function (e) {
    run = 1;
    changeSlide(1);
});

stopBtn.addEventListener("click", function (e) {
    run = 0;
    stopProgressBar();
    
});

restartBtn.addEventListener("click", function (e) {
    run = 1;
    startProgressBar();
});

next.addEventListener("click", function (e) {
    run = 1;
    changeSlide(1);
});

prev.addEventListener("click", function (e) {
    run = 1;
    changeSlide(-1);
});

document.addEventListener("keyup", function (e) {
    console.log(run);
    if (e.keyCode == "37") { /* Left Arrow */
        run = 1;
        changeSlide(-1);
    }
    if (e.keyCode == "39") { /* Right Arrow */
        run = 1;
        changeSlide(1);
    }
    if (e.keyCode == "32" && run == 1) { 
        run = 0;
        stopProgressBar();
    } else if (e.keyCode == "32" && run == 0) {
        run = 1;
        startProgressBar();
    }

});

function changeSlide(changeSlideVar) {

    currentSlide = currentSlide + changeSlideVar;

    if (currentSlide <= 0) {
        currentSlide = numberOfSlides.length;
    }
    if (currentSlide > numberOfSlides.length) {
        currentSlide = 1;
    }

    for (let i = 0; i < numberOfSlides.length; i++) {
        numberOfSlides[i].style.display = "none";
    }

    numberOfSlides[currentSlide - 1].style.display = "block";

    // Each time we change the slide, the progress bar is reinitialized
    progressBar(0);
}

function progressBar(widthBar2) {
    let elem = document.getElementById("divTime");

    intervals.forEach(clearInterval); // clear all the intervals used if some exist
    let intvl = setInterval(frame, 20); // each 20 ms we add 0.4% so each 2000ms we add 40% so each 5000ms we have widthBar = 100%
    intervals.push(intvl);

    function frame() {
        if (widthBar2 >= 100) {
            clearInterval(intvl);
            changeSlide(1);
            widthBar2 = 0;
            widthBar = widthBar2;
        } else {
            widthBar2 = widthBar2 + 0.4;
            elem.style.width = widthBar2 + '%';
            widthBar = widthBar2; /* give the information globally notably for the startProgressBar function */
        }
    }

}

function stopProgressBar() {
    intervals.forEach(clearInterval); // clear all the intervals used if some exist, so it stop the progress bar
}

function startProgressBar() {
    progressBar(widthBar); // clear all the intervals used if some exist, so it stop the progress bar
}