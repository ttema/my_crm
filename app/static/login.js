function fakeLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        alert("Вход выполнен!");
        window.location.href = "index.html"; // Редирект на список клиентов
    }

    return false; // Чтобы форма не отправлялась
}
