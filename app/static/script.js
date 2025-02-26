document.addEventListener("DOMContentLoaded", function () {
    console.log("Скрипт запущен, вызываю fetchClients()");
    fetchClients();
});

function fetchClients() {
    fetch("/clients/")
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("clients-body");
        tableBody.innerHTML = "";

        if (data.length === 1 && data[0].full_name === "Список пуст") {
            tableBody.innerHTML = `<tr><td colspan="6">Список клиентов пуст</td></tr>`;
            return;
        }

        data.forEach(client => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${client.id}</td>
                <td>${client.full_name}</td>
                <td>${client.inn}</td>
                <td>${client.ogrn}</td>
                <td>${client.status}</td>
                <td>
                    <button onclick="viewClient(${client.id})">Подробнее</button>
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