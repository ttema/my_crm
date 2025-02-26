document.addEventListener("DOMContentLoaded", function () {
    checkIfLoggedIn();
});

function checkIfLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
        fetch("/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(user => {
            if (user.role === "client") {
                window.location.href = "/client_profile.html";
            } else {
                window.location.href = "/index.html";
            }
        })
        .catch(() => {
            localStorage.removeItem("token");  // Если токен некорректен, удаляем его
        });
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${username}&password=${password}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);

            fetch("/auth/me", {
                headers: { "Authorization": `Bearer ${data.access_token}` }
            })
            .then(response => response.json())
            .then(user => {
                if (user.role === "client") {
                    window.location.href = "/client_profile.html";
                } else {
                    window.location.href = "/index.html";
                }
            });
        } else {
            document.getElementById("error-message").textContent = "Неверный логин или пароль";
        }
    })
    .catch(error => console.error("Ошибка входа:", error));
}
