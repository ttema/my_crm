function logout() {
    localStorage.removeItem("token");  // Удаляем токен
    window.location.href = "/login.html";  // Перенаправляем на вход
}
