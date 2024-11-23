// Função para carregar a lista de adoções
async function fetchAdocoes() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/adocoes/");
        const adocoes = await response.json();
        const adocaoListDiv = document.getElementById('adocao-list');
        adocaoListDiv.innerHTML = ''; // Limpa a lista antes de adicionar as adoções

        adocoes.forEach(adocao => {
            const adocaoCard = `
                <div class="col-md-4 col-sm-6 col-12 text-center">
                    <div class="custom-card">
                        <h4>Adoção #${adocao.idadocoes}</h4>
                        <p><strong>Data:</strong> ${new Date(adocao.dataadocao).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Animal:</strong> ${adocao.nome_animal}</p>
                        <p><strong>Adotante:</strong> ${adocao.nome_adotante}</p>
                        <a href="infoadotante.html?id=${adocao.idadocoes}" class="btn btn-custom mb-2">Editar</a>
                        <button class="btn btn-sair mb-2" onclick="deleteAdocao(${adocao.idadocoes})">Excluir</button>
                    </div>
                </div>
            `;
            adocaoListDiv.innerHTML += adocaoCard;
        });
    } catch (error) {
        console.error('Erro ao carregar as adoções:', error);
    }
}

// Função para excluir uma adoção
async function deleteAdocao(adocaoId) {
    const confirmDelete = confirm("Tem certeza que deseja excluir esta adoção?");
    if (confirmDelete) {
        try {
            // Obtém os detalhes da adoção antes de excluí-la
            const adocaoResponse = await fetch(`https://apicanil.duckdns.org/adocoes/${adocaoId}`);
            const adocaoData = await adocaoResponse.json();
            const animalId = adocaoData.id_animal; // Salva o id_animal antes da exclusão

            if (!animalId) {
                alert("Erro: Não foi possível localizar o ID do animal associado a esta adoção.");
                return;
            }

            // Exclui a adoção
            const response = await fetch(`https://apicanil.duckdns.org/adocoes/${adocaoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Atualiza o status do animal para "Disponível"
                await updateAnimalStatusToAvailable(animalId);
                alert('Adoção excluída com sucesso!');
                fetchAdocoes(); // Atualiza a lista de adoções
            } else {
                alert('Erro ao excluir a adoção.');
            }
        } catch (error) {
            console.error('Erro ao excluir adoção:', error);
            alert('Erro ao excluir a adoção.');
        }
    }
}

// Função para atualizar o status do animal para "Disponível"
async function updateAnimalStatusToAvailable(animalId) {
    try {
        // Faz o fetch do animal atual para manter os dados existentes
        const response = await fetch(`https://apicanil.duckdns.org/animal/${animalId}`);
        if (!response.ok) {
            alert("Erro: Não foi possível encontrar o animal para atualizar o status.");
            return;
        }

        const animalData = await response.json();

        // Atualiza o status para "Disponível"
        animalData.status = "Disponível";

        // Envia a atualização para a API
        const updateResponse = await fetch(`https://apicanil.duckdns.org/animal/${animalId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animalData)
        });

        if (!updateResponse.ok) {
            alert("Erro: Não foi possível atualizar o status do animal.");
        }
    } catch (error) {
        console.error('Erro ao atualizar o status do animal:', error);
        alert('Erro ao atualizar o status do animal.');
    }
}

// Carrega as adoções ao carregar a página
fetchAdocoes();