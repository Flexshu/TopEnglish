const hourPrices = document.getElementsByClassName("hourPrice");
const monthPrices = document.getElementsByClassName("monthPrice");
const phoneButton = document.getElementById("phoneButton");

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

function fillTable(data){
    hourPrices[0].textContent = data.prices.solo ?? 0;
    hourPrices[1].textContent = data.prices.duo ?? 0;
    hourPrices[2].textContent = data.prices.squad ?? 0;
    monthPrices[0].textContent = data.prices.solo * 4;
    monthPrices[1].textContent = data.prices.duo * 4;
    monthPrices[2].textContent = data.prices.squad * 4;
}

(async () => {
    const data = await getData();
    fillTable(data);
    phoneButton.href = "tel:" + data.contacts.phone.replaceAll(" ", "");
})();