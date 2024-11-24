const API_URL = "https://apicanil.duckdns.org/adotante/";
let users = [];
let userIdToDelete = null;

// Função para carregar a lista de adotantes
async function fetchAdotantes() {
    try {
        const response = await fetch(API_URL);
        users = await response.json();
        displayUsers(users); // Exibe todos os adotantes ao carregar a página
    } catch (error) {
        console.error("Erro ao carregar os adotantes:", error);
        document.getElementById("user-list").innerHTML = '<p class="text-danger">Erro ao carregar os adotantes. Tente novamente mais tarde.</p>';
    }
}

// Função para exibir os adotantes
function displayUsers(adotantes) {
    const userListDiv = document.getElementById("user-list");
    userListDiv.innerHTML = "";

    if (adotantes.length === 0) {
        userListDiv.innerHTML = '<p class="text-center">Nenhum adotante encontrado.</p>';
        return;
    }

    adotantes.forEach(user => {
        const userCard = `
            <div class="col-md-4 col-sm-6 col-12 text-center">
                <div class="custom-card">
                    <h4>${user.nome}</h4>
                    <p>Email: ${user.email}</p>
                    <p>Telefone: ${user.telefone}</p>
                    <p>CPF: ${user.cpf}</p>
                    <p>Endereço: ${user.endereco}</p>
                    <a href="regusuario.html?id=${user.idadotante}" class="btn btn-custom mb-2">Editar</a>
                    <button class="btn btn-sair mb-2" onclick="openDeleteModal(${user.idadotante})">Excluir</button>
                </div>
            </div>
        `;
        userListDiv.innerHTML += userCard;
    });
}

// Função para abrir o modal de exclusão
function openDeleteModal(id) {
    userIdToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    deleteModal.show();
}

// Função para excluir um adotante
async function deleteUser() {
    try {
        const response = await fetch(`${API_URL}${userIdToDelete}`, { method: "DELETE" });

        if (response.ok) {
            fetchAdotantes();
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
            deleteModal.hide();
        } else {
            alert("Erro ao excluir o adotante.");
        }
    } catch (error) {
        console.error("Erro ao excluir adotante:", error);
    }
}

// Adiciona o evento de exclusão ao botão de confirmação
document.getElementById("confirmDeleteButton").addEventListener("click", deleteUser);

// Função para buscar adotantes
function searchUsers() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredUsers = users.filter(user =>
        user.nome.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.cpf.includes(searchTerm)
    );
    displayUsers(filteredUsers);
}

// Carrega os adotantes ao iniciar
fetchAdotantes();
