const API_URL = "https://apicanil.duckdns.org/adocoes/";
const adocaoListDiv = document.getElementById('adocao-list');
let adocaoIdToDelete = null;

// Carrega a lista de adoções
async function fetchAdocoes() {
    try {
        const response = await fetch(API_URL);
        const adocoes = await response.json();

        adocaoListDiv.innerHTML = ''; // Limpa a lista antes de adicionar as adoções

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
                        <button class="btn btn-sair mb-2" onclick="openDeleteAdocaoModal(${adocao.idadocoes})">Excluir</button>
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
function openDeleteAdocaoModal(adocaoId) {
    adocaoIdToDelete = adocaoId;
    const deleteAdocaoModal = new bootstrap.Modal(document.getElementById('deleteAdocaoModal'));
    deleteAdocaoModal.show();
}

// Exclui a adoção
async function deleteAdocao() {
    try {
        const response = await fetch(`${API_URL}${adocaoIdToDelete}`, { method: 'DELETE' });

        if (response.ok) {
            fetchAdocoes(); // Atualiza a lista de adoções
            const deleteAdocaoModal = bootstrap.Modal.getInstance(document.getElementById('deleteAdocaoModal'));
            deleteAdocaoModal.hide();
        } else {
            alert('Erro ao excluir a adoção.');
        }
    } catch (error) {
        console.error('Erro ao excluir a adoção:', error);
        alert('Erro ao excluir a adoção. Tente novamente mais tarde.');
    }
}

// Adiciona o evento de exclusão ao botão de confirmação do modal
document.getElementById('confirmDeleteAdocaoButton').addEventListener('click', deleteAdocao);

// Carrega as adoções ao iniciar
fetchAdocoes();
