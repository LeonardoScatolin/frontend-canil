const API_URL = "https://apicanil.duckdns.org/veterinario/";
const vetListDiv = document.getElementById('vet-list');
let veterinarians = [];
let veterinarianIdToDelete = null;

// Busca os veterinários na API
async function fetchVeterinarians() {
    try {
        const response = await fetch(API_URL);
        veterinarians = await response.json();
        renderVeterinarians(veterinarians);
    } catch (error) {
        console.error('Erro ao carregar os veterinários:', error);
        vetListDiv.innerHTML = '<p class="text-danger text-center">Erro ao carregar os veterinários. Tente novamente mais tarde.</p>';
    }
}

// Renderiza a lista de veterinários
function renderVeterinarians(vets) {
    vetListDiv.innerHTML = '';

    if (vets.length === 0) {
        vetListDiv.innerHTML = '<p class="text-center">Nenhum veterinário encontrado.</p>';
        return;
    }

    vets.forEach(vet => {
        const vetCard = `
            <div class="col-md-4 col-sm-6 col-12 text-center">
                <div class="custom-card">
                    <h4>Veterinário: ${vet.nome}</h4>
                    <p>E-mail: ${vet.email}</p>
                    <p>Telefone: ${vet.telefone}</p>
                    <p>CRMV: ${vet.crmv}</p>
                    <a href="regveterinario.html?id=${vet.idveterinario}" class="btn btn-custom mb-2">Editar</a>
                    <button class="btn btn-sair mb-2" onclick="openDeleteModal(${vet.idveterinario})">Excluir</button>
                </div>
            </div>
        `;
        vetListDiv.innerHTML += vetCard;
    });
}

// Abre o modal de confirmação para exclusão
function openDeleteModal(id) {
    veterinarianIdToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Exclui um veterinário
async function deleteVeterinarian() {
    try {
        const response = await fetch(`${API_URL}/${veterinarianIdToDelete}`, { method: 'DELETE' });

        if (response.ok) {
            fetchVeterinarians(); // Atualiza a lista de veterinários
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        } else {
            alert('Erro ao excluir o veterinário.');
        }
    } catch (error) {
        console.error('Erro ao excluir veterinário:', error);
    }
}

// Adiciona o evento de exclusão ao botão de confirmação
document.getElementById('confirmDeleteButton').addEventListener('click', deleteVeterinarian);

// Busca veterinários pelo nome ou outros atributos
function searchVeterinarians() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const filteredVets = veterinarians.filter(vet => 
        vet.nome.toLowerCase().includes(searchInput) || 
        vet.email.toLowerCase().includes(searchInput) || 
        vet.telefone.toLowerCase().includes(searchInput)
    );

    renderVeterinarians(filteredVets);
}

// Carrega os veterinários ao iniciar
fetchVeterinarians();
