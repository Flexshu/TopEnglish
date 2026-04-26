const transitionDuration = 750;
let current = 0;
let clickingEnabled = true;

const reviews = [...document.getElementsByClassName("b4ReviewCard")];
const dots = [...document.getElementsByClassName("b4Dot")];
const buttons = [...document.getElementsByClassName("b4Button")];

function normalize(index){
    return (index + reviews.length) % reviews.length;
}

function removeClasses(currentId){
    const beforePrev = normalize(currentId - 2);
    const prev = normalize(currentId - 1);
    const next = normalize(currentId + 1);
    const afterNext = normalize(currentId + 2);

    reviews[beforePrev].classList.remove("b4BeforeLeftCard");
    reviews[prev].classList.remove("b4LeftCard");
    reviews[currentId].classList.remove("b4CurrentCard");
    reviews[next].classList.remove("b4RightCard");
    reviews[afterNext].classList.remove("b4AfterRightCard");
    dots[currentId].classList.remove("b4CurrentDot");
}

function addClasses(currentId){
    const beforePrev = normalize(currentId - 2);
    const prev = normalize(currentId - 1);
    const next = normalize(currentId + 1);
    const afterNext = normalize(currentId + 2);

    reviews[beforePrev].classList.add("b4BeforeLeftCard");
    reviews[prev].classList.add("b4LeftCard");
    reviews[currentId].classList.add("b4CurrentCard");
    reviews[next].classList.add("b4RightCard");
    reviews[afterNext].classList.add("b4AfterRightCard");
    dots[currentId].classList.add("b4CurrentDot");
}

function disableButtons(){
    buttons.forEach((button) => {
        button.disabled = true;
    });
    clickingEnabled = false;
    setTimeout(() => {
        buttons.forEach((button) => {
            button.disabled = false;
            clickingEnabled = true;
        });
    }, transitionDuration);
}

function removeTransition(){
    reviews.forEach((review) => {
        review.style.transition = "none";
    });
}

function returnTransition(){
    reviews.forEach((review) => {
        review.style.transition = `transform 0.75s ease, left 0.75s ease, opacity 0.75s ease`;
    });
}

function scrollCarouselLeft(){
    removeClasses(current);
    current = normalize(current - 1);
    addClasses(current);
    disableButtons();
}

function scrollCarouselRight(){
    removeClasses(current);
    current = normalize(current + 1);
    addClasses(current);
    disableButtons();
}

function scrollToCard(id){
    removeClasses(current);
    if (Math.abs(current - id) > 1 && Math.abs(current - id) < 5){
        removeTransition();
    }
    current = id;
    addClasses(current);
    disableButtons();
    setTimeout(() => {
        returnTransition();
    }, transitionDuration);
}

for (let i = 0; i < dots.length; i++){
    dots[i].addEventListener('click', () => {
        if (!clickingEnabled) return;
        scrollToCard(i);
    });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    removeTransition();
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        returnTransition();
    }, 10);
});