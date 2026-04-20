let windowContainer = document.getElementById("windowContainer");
let windowOverlay = document.getElementById("windowOverlay");

function showWindow(){
    windowContainer.style.opacity = 1;
    windowContainer.style.pointerEvents = "all";
    windowOverlay.style.opacity = 1;
    windowOverlay.style.pointerEvents = "all";
}

function closeWindow(){
    windowContainer.style.opacity = 0;
    windowContainer.style.pointerEvents = "none";
    windowOverlay.style.opacity = 0;
    windowOverlay.style.pointerEvents = "none";
}