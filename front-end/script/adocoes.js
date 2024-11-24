const API_URL = "https://apicanil.duckdns.org/adocoes/";
const ANIMAL_API_URL = "https://apicanil.duckdns.org/animal/";
const adocaoListDiv = document.getElementById('adocao-list');
let adocaoIdToDelete = null;
let animalIdToUpdate = null;

async function fetchAdocoes() {
    try {
        const response = await fetch(API_URL);
        const adocoes = await response.json();

        adocaoListDiv.innerHTML = '';

        if (adocoes.length === 0) {
            adocaoListDiv.innerHTML = '<p class="text-center">Nenhuma adoção encontrada no momento.</p>';
            return;
        }

        adocoes.forEach(adocao => {
            const adocaoCard = `
                <div class="col-md-4 col-sm-6 col-12 text-center">
                    <div class="custom-card">
                        <h4>Adoção #${adocao.idadocoes}</h4>
                        <p><strong>Data:</strong> ${new Date(adocao.dataadocao).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Animal:</strong> ${adocao.nome_animal}</p>
                        <p><strong>Adotante:</strong> ${adocao.nome_adotante}</p>
                        <a href="infoadotante.html?id=${adocao.idadocoes}" class="btn btn-custom mb-2">Editar</a>
                        <button class="btn btn-sair mb-2" onclick="openDeleteAdocaoModal(${adocao.idadocoes}, ${adocao.id_animal})">Excluir</button>
                    </div>
                </div>
            `;
            adocaoListDiv.innerHTML += adocaoCard;
        });
    } catch (error) {
        console.error('Erro ao carregar as adoções:', error);
        adocaoListDiv.innerHTML = '<p class="text-danger text-center">Erro ao carregar as adoções. Tente novamente mais tarde.</p>';
    }
}

// Abre o modal de exclusão
function openDeleteAdocaoModal(adocaoId, animalId) {
    adocaoIdToDelete = adocaoId;
    animalIdToUpdate = animalId;
    const deleteAdocaoModal = new bootstrap.Modal(document.getElementById('deleteAdocaoModal'));
    deleteAdocaoModal.show();
}

// Atualiza o status do animal para "Disponível"
async function updateAnimalStatus() {
    try {
        const response = await fetch(`${ANIMAL_API_URL}${animalIdToUpdate}`);
        const animal = await response.json();

        const updateResponse = await fetch(`${ANIMAL_API_URL}${animalIdToUpdate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...animal,
                status: "Disponível"
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar o status do animal');
        }
    } catch (error) {
        console.error('Erro ao atualizar o status do animal:', error);
        throw error;
    }
}

// Exclui a adoção e atualiza o status do animal
async function deleteAdocao() {
    try {
        // Primeiro exclui a adoção
        const deleteResponse = await fetch(`${API_URL}${adocaoIdToDelete}`, { method: 'DELETE' });

        if (deleteResponse.ok) {
            // Se a exclusão for bem-sucedida, atualiza o status do animal
            await updateAnimalStatus();
            
            // Atualiza a lista de adoções e fecha o modal
            fetchAdocoes();
            const deleteAdocaoModal = bootstrap.Modal.getInstance(document.getElementById('deleteAdocaoModal'));
            deleteAdocaoModal.hide();
        } else {
            alert('Erro ao excluir a adoção.');
        }
    } catch (error) {
        console.error('Erro ao excluir a adoção ou atualizar o animal:', error);
        alert('Erro ao excluir a adoção. Tente novamente mais tarde.');
    }
}

// Adiciona o evento de exclusão ao botão de confirmação do modal
document.getElementById('confirmDeleteAdocaoButton').addEventListener('click', deleteAdocao);

// Carrega as adoções ao iniciar
fetchAdocoes();