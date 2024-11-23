// Função para carregar os adotantes e animais para os selects
async function loadOptions() {
    try {
        const [adotantesResponse, animaisResponse] = await Promise.all([
            fetch("https://apicanil.duckdns.org/adotante/"),
            fetch("https://apicanil.duckdns.org/animal/"),
        ]);

        const adotantes = await adotantesResponse.json();
        const animais = await animaisResponse.json();

        const adotanteSelect = document.getElementById('adotante');
        const animalSelect = document.getElementById('animal');

        // Carrega adotantes
        adotantes.forEach(adotante => {
            const option = document.createElement('option');
            option.value = adotante.idadotante;
            option.textContent = adotante.nome;
            adotanteSelect.appendChild(option);
        });

        // Carrega animais
        animais.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.idanimal;
            option.textContent = animal.nome;
            animalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar dados para os selects:', error);
    }
}

// Função para buscar as informações da adoção e do adotante
async function fetchAdotanteInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const idAdoacao = urlParams.get('id'); // Obtém o ID da adoção na URL

    try {
        // Requisição para buscar a adoção
        const adocaoResponse = await fetch(`https://apicanil.duckdns.org/adocoes/${idAdoacao}`);
        const adocao = await adocaoResponse.json();

        // Preenche os dados de adoção no formulário
        document.getElementById('adotante').value = adocao.id_adotante;
        document.getElementById('animal').value = adocao.nome_animal;
        document.getElementById('data-adocao').value = adocao.dataadocao.split('T')[0]; // Formato 'YYYY-MM-DD'

        // Requisição para buscar as informações do adotante
        const adotanteResponse = await fetch(`https://apicanil.duckdns.org/adotante/${adocao.id_adotante}`);
        const adotante = await adotanteResponse.json();

        // Preenche as informações do adotante
        document.getElementById('adotante-nome').textContent = adotante.nome;
        document.getElementById('adotante-email').textContent = adotante.email || 'Não informado';
        document.getElementById('adotante-cpf').textContent = adotante.cpf || 'Não informado';
    } catch (error) {
        console.error('Erro ao buscar informações da adoção:', error);
    }
}

// Função para salvar as alterações de adoção
document.getElementById('adocao-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const idAdoacao = new URLSearchParams(window.location.search).get('id');
    const adotanteId = document.getElementById('adotante').value;
    const animalId = document.getElementById('animal').value;
    const dataAdoacao = document.getElementById('data-adocao').value;

    const adocaoData = {
        adotante_idadotante: adotanteId,
        animal_idanimal: animalId,
        dataadocao: dataAdoacao
    };

    try {
        const response = await fetch(`https://apicanil.duckdns.org/adocoes/${idAdoacao}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adocaoData)
        });

        const responseData = await response.json();
        if (response.ok) {
            alert('Adoção atualizada com sucesso!');
            window.location.href = 'adocoes.html'; // Redireciona para a listagem de adoções
        } else {
            alert('Erro ao atualizar a adoção.');
        }
    } catch (error) {
        console.error('Erro ao salvar as alterações da adoção:', error);
        alert('Erro ao salvar as alterações da adoção.');
    }
});

// Carrega as opções e as informações da adoção ao carregar a página
loadOptions();
fetchAdotanteInfo();