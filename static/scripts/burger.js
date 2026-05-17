const burgerMenu = document.getElementById('burgerMenu');
const overlay = document.getElementById('overlay');
const yearSpan = document.getElementById('year');
const floatButton = document.getElementById('floatButton');

yearSpan.textContent = new Date().getFullYear();

function showBurger() {
    burgerMenu.style.transform = 'translateY(0)';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
}

function hideBurger() {
    burgerMenu.style.transform = 'translateY(-100%)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
}

async function getPhoneNumber(){
    try{
        const response = await fetch("/data");
        if (!response.ok){
            throw new Error("Статус відповіді: " + response.status);
        }
        const data = await response.json();
        return data.contacts.phone.replaceAll(" ", "");
    }
    catch(e){
        console.log("Помилка при завантаженні даних:", e);
        return "";
    }
}
(async () => {
    floatButton.href = "tel:" + await getPhoneNumber();
})();