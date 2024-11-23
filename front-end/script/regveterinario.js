// Recupera o ID do veterinário se for edição
const URL_PARAMS = new URLSearchParams(window.location.search);
const vetId = URL_PARAMS.get('id');
const API_URL = "https://apicanil.duckdns.org/veterinario/";

// Função para carregar os dados do veterinário caso seja edição
async function fetchVeterinarianData() {
    if (vetId) {
        try {
            const response = await fetch(`${API_URL}${vetId}`);
            const vet = await response.json();
            if (vet) {
                document.getElementById('nome').value = vet.nome;
                document.getElementById('telefone').value = vet.telefone;
                document.getElementById('email').value = vet.email;
                document.getElementById('crmv').value = vet.crmv;
                document.getElementById('formTitle').innerText = 'Editar Veterinário';
                document.getElementById('submitButton').innerText = 'Atualizar Veterinário';
            }
        } catch (error) {
            console.error('Erro ao carregar dados do veterinário:', error);
        }
    }
}

// Função para enviar o formulário (criar ou editar)
document.getElementById('vetForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const crmv = document.getElementById('crmv').value;

    const vetData = { nome, telefone, email, crmv };

    try {
        let response;
        if (vetId) {
            // Edita veterinário
            response = await fetch(`${API_URL}${vetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vetData)
            });
        } else {
            // Cria novo veterinário
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vetData)
            });
        }

        const responseData = await response.json();
        console.log(responseData); // Verifica a resposta da API

        if (response.ok) {
            alert('Veterinário salvo com sucesso!');
            window.location.href = 'veterinarios.html'; // Redireciona para a listagem
        } else {
            alert('Erro ao salvar veterinário.');
        }
    } catch (error) {
        console.error('Erro ao salvar veterinário:', error);
        alert('Erro ao salvar veterinário.');
    }
});

// Carrega os dados do veterinário se for edição
fetchVeterinarianData();