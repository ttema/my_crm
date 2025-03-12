document.addEventListener("DOMContentLoaded", function () {
    loadClient();
    loadDocuments();
    loadVerification()
});

function getClientId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function loadClient() {
    const clientId = getClientId();

    fetch(`/clients/${clientId}`)
        .then(response => response.json())
        .then(client => {
            document.getElementById("full_name").textContent = client.full_name;
            document.getElementById("short_name").textContent = client.short_name;
            document.getElementById("legal_form").textContent = client.legal_form;
            document.getElementById("inn").textContent = client.inn;
            document.getElementById("ogrn").textContent = client.ogrn;
            document.getElementById("registration_date").textContent = client.registration_date;

            document.getElementById("legal_address").textContent = client.legal_address;
            document.getElementById("actual_address").textContent = client.actual_address || "-";
            document.getElementById("phone").textContent = client.phone;
            document.getElementById("email").textContent = client.email;
            document.getElementById("website").textContent = client.website || "-";

            document.getElementById("director_name").textContent = client.director_name;
            document.getElementById("representation_basis").textContent = client.representation_basis;

            document.getElementById("authorized_capital").textContent = client.authorized_capital.toLocaleString();
            document.getElementById("main_activity").textContent = client.main_activity;
            document.getElementById("expected_turnover").textContent = client.expected_turnover ? client.expected_turnover.toLocaleString() : "-";
            document.getElementById("employee_count").textContent = client.employee_count || "-";

            document.getElementById("owner_name").textContent = client.owner_name;
            document.getElementById("owner_share").textContent = client.owner_share;
            document.getElementById("owner_birth_date").textContent = client.owner_birth_date || "-";
            document.getElementById("owner_company_name").textContent = client.owner_company_name || "-";
            document.getElementById("owner_inn").textContent = client.owner_inn || "-";

            document.getElementById("status").textContent = client.status;
            document.getElementById("is_verified").textContent = client.is_verified ? "Да" : "Нет";
        })
        .catch(error => console.error("Ошибка загрузки клиента:", error));
}

function loadVerification() {
    const clientId = getClientId();

    fetch(`/clients/${clientId}/verify`)
        .then(response => response.json())
        .then(verification => {
            document.getElementById("risk_score").textContent = verification.risk_score;
            document.getElementById("blacklist_status").textContent = verification.blacklist_status;
            document.getElementById("financial_risk").textContent = verification.financial_risk;
            document.getElementById("tax_debt").textContent = verification.tax_debt;
            document.getElementById("sanctions").textContent = verification.sanctions;
        })
        .catch(error => console.error("Ошибка проверки контрагента:", error));
}

function goBack() {
    window.location.href = "/index.html";
}

function approveClient() {
    const clientId = getClientId();

    fetch(`/clients/${clientId}/approve`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("status").textContent = data.new_status;
    })
    .catch(error => {
        console.error("Ошибка при одобрении клиента:", error);
        alert("Не удалось изменить статус клиента.");
    });
}

function resetClientStatus() {
    const clientId = getClientId();

    fetch(`/clients/${clientId}/reset_status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("status").textContent = data.new_status;
    })
    .catch(error => {
        console.error("Ошибка при возврате статуса клиента:", error);
        alert("Не удалось изменить статус клиента.");
    });
}

function loadDocuments() {
    const clientId = getClientId();

    fetch(`/documents/clients/${clientId}/documents`)
        .then(response => response.json())
        .then(documents => {
            console.log("Документы клиента:", documents);

            const tableBody = document.getElementById("documents-body");
            tableBody.innerHTML = "";

            if (documents.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5">Документы не загружены</td></tr>`;
                return;
            }

            documents.forEach(doc => {
                const status = doc.first_approve ? "Заверен" : "Ожидает заверения";

                const row = document.createElement("tr");
                row.setAttribute("data-doc-id", doc.id); // Атрибут для поиска строки

                row.innerHTML = `
                    <td>${doc.id}</td>
                    <td>${doc.filename}</td>
                    <td class="doc-status">${status}</td>
                    <td>
                        <div class="btn-group">
                            <div class="btn-row">
                                <button class="btn btn-primary" onclick="openDocument('${doc.file_path}')">Открыть</button>
                                <a href="/${doc.file_path}" download="${doc.filename}">
                                    <button class="btn btn-primary">Скачать</button>
                                </a>
                            </div>
                            <div class="btn-row">
                                <button class="btn btn-success" onclick="approveDocument(${doc.id})">Заверить</button>
                                <button class="btn btn-danger" onclick="rejectDocument(${doc.id})">Отклонить</button>
                            </div>
                        </div>
                    </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Ошибка загрузки документов:", error));
}

function openDocument(filePath) {
    window.open(`/${filePath}`, '_blank');
}

function approveDocument(documentId) {
    fetch(`/documents/${documentId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        // Обновляем статус без перезагрузки всей страницы
        const row = document.querySelector(`tr[data-doc-id="${documentId}"]`);
        if (row) {
            row.querySelector(".doc-status").textContent = "Заверен"; // Меняем текст в колонке "Статус"
        }
    })
    .catch(error => console.error("Ошибка заверения документа:", error));
}

function rejectDocument(documentId) {
    fetch(`/documents/${documentId}/reject`, { method: "PUT" })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadDocuments(); // Обновляем список документов
    })
    .catch(error => console.error("Ошибка отклонения документа:", error));
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (message === "") return;

    // Добавляем сообщение в чат
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.classList.add("chat-message");
    chatBox.appendChild(messageElement);

    // Очищаем поле ввода
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight; // Прокручиваем вниз
}

