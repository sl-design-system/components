function isLight() {
    return localStorage.getItem("light-mode");
}

function toggleLightClass() {
    document.querySelector(":root").classList.toggle("light");
}

function toggleLocalStorageItem() {
    if (isLight()) {
        localStorage.removeItem("light-mode");
    } else {
        localStorage.setItem("light-mode", "set");
    }
}

if (isLight()) {
    toggleLightClass();
}

document.querySelector('.theme-icon').addEventListener("click", () => {
    toggleLocalStorageItem();
    toggleLightClass();
});
