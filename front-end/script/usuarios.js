let users = []; // Variável para armazenar os adotantes

// Função para carregar a lista de adotantes
async function fetchAdotantes() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/adotante/");
        users = await response.json();
        displayUsers(users); // Exibe todos os adotantes ao carregar a página
    } catch (error) {
        console.error('Erro ao carregar os adotantes:', error);
    }
}

// Função para exibir os adotantes
function displayUsers(adotantes) {
    const userListDiv = document.getElementById('user-list');
    userListDiv.innerHTML = ''; // Limpa a lista antes de adicionar os usuários

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
                    <a href="#" onclick="deleteUser(${user.idadotante})" class="btn btn-sair mb-2">Excluir</a>
                </div>
            </div>
        `;
        userListDiv.innerHTML += userCard;
    });
}

// Função para excluir um adotante
async function deleteUser(userId) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este adotante?");
    if (confirmDelete) {
        try {
            const response = await fetch(`https://apicanil.duckdns.org/adotante/${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json(); // Recebe a resposta da API
            console.log(data); // Verifica a resposta da API
            if (response.ok) {
                alert('Adotante excluído com sucesso!');
                fetchAdotantes(); // Atualiza a lista de adotantes
            } else {
                alert('Erro ao excluir o adotante.');
            }
        } catch (error) {
            console.error('Erro ao excluir adotante:', error);
            alert('Erro ao excluir o adotante.');
        }
    }
}

// Função para buscar adotantes
function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user => {
        return (
            user.nome.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.cpf.includes(searchTerm) // Filtro por CPF também
        );
    });
    displayUsers(filteredUsers); // Exibe os adotantes filtrados
}

// Carrega os adotantes ao carregar a página
fetchAdotantes();