const API_URL = "https://apicanil.duckdns.org/animal";
const animalList = document.getElementById('animal-list');
let allAnimals = [];
let animalIdToDelete = null;

// Busca os animais na API
async function fetchAnimals(filter = '') {
    try {
        const response = await fetch(API_URL);
        const animals = await response.json();
        allAnimals = animals;
        updateFilterCounters(); // Atualiza os contadores ao carregar os animais
        renderAnimals(animals, filter);
    } catch (error) {
        console.error('Erro ao buscar animais:', error);
        animalList.innerHTML = '<p class="text-danger">Erro ao carregar os animais. Tente novamente mais tarde.</p>';
    }
}

// Renderiza a lista de animais
function renderAnimals(animals, filter = '') {
    animalList.innerHTML = '';

    if (animals.length === 0) {
        animalList.innerHTML = '<p class="text-center">Nenhum animal encontrado.</p>';
        return;
    }

    const filteredAnimals = filter
        ? animals.filter(animal => animal.nome.toLowerCase().includes(filter.toLowerCase()))
        : animals;

    if (filteredAnimals.length === 0) {
        animalList.innerHTML = '<p class="text-center">Nenhum animal encontrado com os critérios aplicados.</p>';
        return;
    }

    filteredAnimals.forEach(animal => {
        const animalCard = `
            <div class="col-md-4 col-sm-6 col-12 text-center">
                <div class="custom-card">
                    <div class="status-tag ${animal.status === 'Disponível' ? 'bg-success' : 'bg-secondary'} text-white">${animal.status}</div>
                    <h4>${animal.nome}</h4>
                    <p>Sexo: ${animal.sexo}</p>
                    <p>Espécie: ${animal.tipo_animal}</p>
                    <p>Raça: ${animal.raca_animal}</p>
                    <a href="reganimal.html?id=${animal.idanimal}" class="btn btn-custom mb-2">Editar</a>
                    <button class="btn btn-sair mb-2" onclick="openDeleteModal(${animal.idanimal})">Excluir</button>
                </div>
            </div>
        `;
        animalList.innerHTML += animalCard;
    });
}

// Atualiza os contadores de filtros
function updateFilterCounters() {
    // Conta o total de animais
    const total = allAnimals.length;

    // Conta os animais por status
    const available = allAnimals.filter(animal => animal.status === 'Disponível').length;
    const adopted = allAnimals.filter(animal => animal.status === 'Adotado').length;

    // Atualiza os contadores no HTML
    document.getElementById('total-counter').textContent = total;
    document.getElementById('available-counter').textContent = available;
    document.getElementById('adopted-counter').textContent = adopted;
}

// Filtra os animais pelo status
function filterAnimals(status) {
    const filteredAnimals = status
        ? allAnimals.filter(animal => animal.status === status)
        : allAnimals;

    renderAnimals(filteredAnimals);
}

// Busca animais pelo nome
function searchAnimals() {
    const searchInput = document.querySelector('.search-input');
    const searchQuery = searchInput.value.trim();
    renderAnimals(allAnimals.filter(animal =>
        animal.nome.toLowerCase().includes(searchQuery.toLowerCase())
    ));
}

// Abre o modal de confirmação para exclusão
function openDeleteModal(id) {
    animalIdToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Exclui o animal
async function deleteAnimal() {
    try {
        const response = await fetch(`${API_URL}/${animalIdToDelete}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Animal excluído com sucesso!');
            fetchAnimals();
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        } else {
            alert('Erro ao excluir o animal.');
        }
    } catch (error) {
        console.error('Erro ao excluir o animal:', error);
    }
}

// Adiciona o evento de exclusão ao botão de confirmação
document.getElementById('confirmDeleteButton').addEventListener('click', deleteAnimal);

// Carrega os animais ao iniciar
fetchAnimals();
