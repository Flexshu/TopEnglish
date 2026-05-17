const popup = document.getElementById("popupWrapper");
const label = document.getElementById("popupLabel");
const selectWrapper = document.getElementById("popupSelectWrapper");
const select = document.getElementById("popupSelect");
const input = document.getElementById("popupInput");
const errorMessage = document.getElementById("popupErrorMessage");
const pricesButton = document.getElementById("pricesButton");
const contactsButton = document.getElementById("contactsButton");
const readyButton = document.getElementById("readyButton");
const cancelButton = document.getElementById("cancelButton");
const hourPrices = document.getElementsByClassName("hourPrice");
const monthPrices = document.getElementsByClassName("monthPrice");
const contacts = document.getElementsByClassName("contact");

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

let data = {};
(async () => {
    data = await getData();
    fillTables();
})();

async function saveData(){
    try{
        const response = await fetch("/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok){
            throw new Error("Статус відповіді: " + response.status);
        }
    }
    catch(e){
        console.log("Помилка при збереженні даних:", e);
    }
}

function fillTables(){
    hourPrices[0].textContent = data.prices.solo ?? 0;
    hourPrices[1].textContent = data.prices.duo ?? 0;
    hourPrices[2].textContent = data.prices.squad ?? 0;
    monthPrices[0].textContent = data.prices.solo * 4;
    monthPrices[1].textContent = data.prices.duo * 4;
    monthPrices[2].textContent = data.prices.squad * 4;

    contacts[0].textContent = data.contacts.phone ?? "—";
    contacts[1].textContent = data.contacts.viber ?? "—";
    contacts[2].textContent = data.contacts.telegram ?? "—";
    contacts[3].textContent = data.contacts.email ?? "—";
}

let popupParams = {
    labelText: "",
    selectWrapperDisplay: "",
    selectOptions: [],
    inputDisplay: "",
    inputPlaceholder: "",
    errorMessageText: "",
    changedItem: "",
    step: 0
}
let selectValue = "", inputValue = "";

function setPopupParams(){
    if (popupParams.changedItem === "prices"){
        if (popupParams.step === 1){
            popupParams.labelText = "Формат занять:";
            popupParams.selectWrapperDisplay = "block";
            popupParams.selectOptions = [["Особистий", "solo"], ["Парний", "duo"], ["Груповий", "squad"]];
            popupParams.inputDisplay = "none";
        }
        else if (popupParams.step === 2){
            popupParams.labelText = "Нова ціна:";
            popupParams.selectWrapperDisplay = "none";
            popupParams.inputDisplay = "block";
            popupParams.inputPlaceholder = "Уведіть ціну";
        }
    }
    else if (popupParams.changedItem === "contacts"){
        if (popupParams.step === 1){
            popupParams.labelText = "Спосіб звʼязку:";
            popupParams.selectWrapperDisplay = "block";
            popupParams.selectOptions = [["Телефон", "phone"], ["Viber", "viber"], ["Telegram", "telegram"], ["Email", "email"]];
            popupParams.inputDisplay = "none";
        }
        else if (popupParams.step === 2){
            popupParams.labelText = "Новий контакт:";
            popupParams.selectWrapperDisplay = "none";
            popupParams.inputDisplay = "block";
            popupParams.inputPlaceholder = "Уведіть контакт";
        }
    }
}

function fillSelect(){
    select.innerHTML = "";
    for (let i = 0; i < popupParams.selectOptions.length; i++){
        let option = document.createElement("option");
        option.textContent = popupParams.selectOptions[i][0];
        option.value = popupParams.selectOptions[i][1];
        select.appendChild(option);
    }
}

function showPopup(){
    label.textContent = popupParams.labelText;
    selectWrapper.style.display = popupParams.selectWrapperDisplay;
    input.style.display = popupParams.inputDisplay;
    input.placeholder = popupParams.inputPlaceholder;
    input.value = "";
    errorMessage.style.display = "none";
    errorMessage.textContent = "";
    fillSelect();
    popup.style.opacity = 1;
    popup.style.pointerEvents = "all";
}

function hidePopup(){
    popup.style.opacity = 0;
    popup.style.pointerEvents = "none";
    input.classList.remove("error");
}

function showError(){
    errorMessage.style.display = "block";
    errorMessage.textContent = popupParams.errorMessageText;
    input.classList.add("error");
}

function checkInput(){
    if (inputValue === ""){
        popupParams.errorMessageText = "Заповніть поле введення";
        showError();
        return false;
    }
    if (popupParams.changedItem === "prices"){
        const regex = /^\d+$/;
        if (!regex.test(inputValue)){
            popupParams.errorMessageText = "Ціна повинна бути числом";
            showError();
            return false;
        }
    }
    else if (popupParams.changedItem === "contacts"){
        if (selectValue === "phone" || selectValue === "viber"){
            const regex = /^\+380[\d ]+$/;
            if (!regex.test(inputValue)){
                popupParams.errorMessageText = "Неправильний формат.\n Приклад: +380 67 123 45 67";
                showError();
                return false;
            }
        }
        else if (selectValue === "telegram"){
            if (!inputValue.startsWith("@")){
                popupParams.errorMessageText = "Telegram повинен починатися з @";
                showError();
                return false;
            }
        }
        else if (selectValue === "email"){
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(inputValue)){
                popupParams.errorMessageText = "Некоректний формат email";
                showError();
                return false;
            }
        }
    }
    return true;
}

pricesButton.addEventListener("click", () => {
    popupParams.changedItem = "prices";
    popupParams.step = 1;
    setPopupParams();
    showPopup();
});

contactsButton.addEventListener("click", () => {
    popupParams.changedItem = "contacts";
    popupParams.step = 1;
    setPopupParams();
    showPopup();
});

readyButton.addEventListener("click", () => {
    if (popupParams.step === 1){
        selectValue = select.value;
        popupParams.step = 2;
        setPopupParams();
        showPopup();
    }
    else if (popupParams.step === 2){
        inputValue = input.value;
        if (!checkInput()) return;
        hidePopup();
        data[popupParams.changedItem][selectValue] = inputValue;
        fillTables();
        saveData();
    }
});

cancelButton.addEventListener("click", () => {
    hidePopup();
});

input.addEventListener("focus", () => {
    input.classList.remove("error");
});