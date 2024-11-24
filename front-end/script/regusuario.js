// Recupera o ID do usuário se for edição
const URL_PARAMS = new URLSearchParams(window.location.search);
const userId = URL_PARAMS.get('id');
const API_URL = "https://apicanil.duckdns.org/adotante/";

// Função para carregar os dados do usuário caso seja edição
async function fetchUserData() {
    if (userId) {
        try {
            const response = await fetch(`${API_URL}${userId}`);
            const user = await response.json();
            if (user) {
                document.getElementById('nome').value = user.nome;
                document.getElementById('cpf').value = user.cpf;
                document.getElementById('email').value = user.email;
                document.getElementById('endereco').value = user.endereco;
                document.getElementById('telefone').value = user.telefone;
                document.getElementById('formTitle').innerText = 'Editar Usuário';
                document.getElementById('submitButton').innerText = 'Atualizar Usuário';
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }
}

// Função para enviar o formulário (criar ou editar)
document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;

    const userData = { nome, cpf, email, endereco, telefone };

    try {
        let response;
        if (userId) {
            // Edita usuário
            response = await fetch(`${API_URL}${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            // Cria novo usuário
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }

        const responseData = await response.json();
        console.log(responseData); // Verifica a resposta da API

        if (response.ok) {
            alert('Adotante salvo com sucesso!');
            window.location.href = 'usuarios.html'; // Redireciona para a listagem
        } else {
            alert('Erro ao salvar adotante.');
        }
    } catch (error) {
        console.error('Erro ao salvar adotante:', error);
        alert('Erro ao salvar adotante.');
    }
});

// Carrega os dados do usuário se for edição
fetchUserData();