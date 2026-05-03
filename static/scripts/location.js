let windowContainer = document.getElementById("windowContainer");

function showWindow(){
    windowContainer.style.opacity = 1;
    windowContainer.style.pointerEvents = "all";
}

function closeWindow(){
    windowContainer.style.opacity = 0;
    windowContainer.style.pointerEvents = "none";
}