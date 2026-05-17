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

const phoneCard = document.getElementById("b5PhoneCard");
const telegramCard = document.getElementById("b5TelegramCard");
const viberCard = document.getElementById("b5ViberCard");
const emailCard = document.getElementById("b5EmailCard");
const phoneLabel = document.getElementById("b5PhoneLabel");
const telegramLabel = document.getElementById("b5TelegramLabel");
const viberLabel = document.getElementById("b5ViberLabel");
const emailLabel = document.getElementById("b5EmailLabel");

async function getData(){
    try{
        const response = await fetch("/data");
        if (!response.ok){
            throw new Error("Статус відповіді: " + response.status);
        }
        const data = await response.json();
        return data;
    }
    catch(e){
        console.log("Помилка при завантаженні даних:", e);
        return { prices: { solo: null, duo: null, squad: null }, contacts: { phone: null, viber: null, telegram: null, email: null } };
    }
}

function setData(data){
    phoneCard.href = "tel:" + data.contacts.phone.replaceAll(" ", "");
    telegramCard.href = "https://t.me/" + data.contacts.telegram.replaceAll("@", "");
    viberCard.href = "viber://chat?number=" + data.contacts.viber.replaceAll(" ", "");
    emailCard.href = "mailto:" + data.contacts.email;
    phoneLabel.textContent = data.contacts.phone;
    telegramLabel.textContent = data.contacts.telegram;
    viberLabel.textContent = data.contacts.viber;
    emailLabel.textContent = data.contacts.email;
}

(async () => {
    const data = await getData();
    setData(data);
})();