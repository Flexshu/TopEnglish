const burgerMenu = document.getElementById('burgerMenu');
const overlay = document.getElementById('overlay');
const yearSpan = document.getElementById('year');

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