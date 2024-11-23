// Função para carregar adotantes e animais para o formulário
async function loadOptions() {
    try {
        const [adotantesResponse, animaisResponse] = await Promise.all([
            fetch("https://apicanil.duckdns.org/adotante/"),
            fetch("https://apicanil.duckdns.org/animal/")
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
        console.error('Erro ao carregar dados para o formulário:', error);
    }
}

// Função para registrar a adoção
document.getElementById('adocaoForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const adotanteId = document.getElementById('adotante').value;
    const animalId = document.getElementById('animal').value;
    const dataAdoacao = document.getElementById('dataAdoacao').value;

    // Verifica se os campos estão preenchidos
    if (!adotanteId || !animalId || !dataAdoacao) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Dados para o corpo da requisição de adoção
    const adocaoData = {
        adotante_idadotante: adotanteId,
        animal_idanimal: animalId,
        dataadocao: dataAdoacao
    };

    try {
        // Envia a adoção para a API
        const response = await fetch("https://apicanil.duckdns.org/adocoes/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adocaoData)
        });

        if (response.ok) {
            // Atualiza o status do animal para "Adotado"
            await updateAnimalStatus(animalId);
            alert('Adoção registrada com sucesso!');
            window.location.href = 'adocoes.html';
        } else {
            const data = await response.json();
            alert('Erro ao registrar adoção: ' + (data.message || 'Erro desconhecido.'));
        }
    } catch (error) {
        console.error('Erro ao registrar adoção:', error);
        alert('Erro ao registrar adoção.');
    }
});

// Função para atualizar o status do animal
async function updateAnimalStatus(animalId) {
    try {
        // Faz o fetch do animal atual para manter os dados existentes
        const response = await fetch(`https://apicanil.duckdns.org/animal/${animalId}`);
        const animalData = await response.json();

        // Atualiza o status para "Adotado"
        animalData.status = "Adotado";

        // Envia a atualização para a API
        await fetch(`https://apicanil.duckdns.org/animal/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animalData)
        });
    } catch (error) {
        console.error('Erro ao atualizar o status do animal:', error);
        alert('Erro ao atualizar o status do animal.');
    }
}

// Carrega os dados do formulário ao carregar a página
loadOptions();