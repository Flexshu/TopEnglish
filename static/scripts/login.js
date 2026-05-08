const button = document.getElementById("loginButton");
const passwordInput = document.getElementById("password");
const errorText = document.getElementById("errorText");

function showError(errorMessage){
    errorText.textContent = errorMessage;
    errorText.style.display = "block";
}

function hideError(){
    errorText.style.display = "none";
}

passwordInput.addEventListener("focus", () => {
    passwordInput.classList.remove("error");
});

button.addEventListener("click", async () => {
    if (passwordInput.value === "") {
        passwordInput.classList.add("error");
        showError("Уведіть пароль");
        return;
    }
    try {
        const response = await fetch("/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: passwordInput.value
            })
        });
        const data = await response.json();
        if (data.success) {
            hideError();
            window.location.href = "/admin";
        }
        else {
            showError(data.error);
            if (data.error === "Неправильний пароль") {
                passwordInput.classList.add("error");
            }
        }
    }
    catch(e) {
        showError("Помилка сервера: " + e.message);
    }
});