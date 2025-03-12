function logout() {
    alert("Вы вышли из системы!");
    window.location.href = "/login"; // Перенаправление на страницу входа
}

function loadClients() {
    fetch("/clients/")
        .then(response => response.json())
        .then(clients => {
            const tableBody = document.getElementById("clients-body");
            tableBody.innerHTML = "";

            clients.forEach(client => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${client.id}</td>
                    <td>${client.full_name}</td>
                    <td>${client.inn}</td>
                    <td>${client.ogrn}</td>
                    <td>${client.status}</td>
                    <td>
                        <button class="details-btn" onclick="viewClient(${client.id})">Подробнее</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки клиентов:", error));
}

function viewClient(clientId) {
    window.location.href = `/client.html?id=${clientId}`;
}

// Логика открытия/закрытия окна уведомлений
function toggleNotifications() {
    const notificationBox = document.getElementById("notification-box");
    notificationBox.classList.toggle("visible");
}

// Загружаем список клиентов при открытии страницы
document.addEventListener("DOMContentLoaded", loadClients);
