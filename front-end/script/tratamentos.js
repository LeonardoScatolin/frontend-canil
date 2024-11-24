const API_URL = "https://apicanil.duckdns.org/consulta/";
const tratamentosList = document.getElementById('tratamentos-list');
let tratamentosData = [];
let tratamentoIdToDelete = null;

// Carrega os tratamentos ao iniciar
async function loadTratamentos() {
    try {
        const response = await fetch(API_URL);
        tratamentosData = await response.json();
        renderTratamentos(tratamentosData);
    } catch (error) {
        console.error("Erro ao carregar tratamentos:", error);
        tratamentosList.innerHTML = '<p class="text-danger">Erro ao carregar os tratamentos. Tente novamente mais tarde.</p>';
    }
}

// Renderiza os tratamentos
function renderTratamentos(tratamentos) {
    tratamentosList.innerHTML = "";

    if (tratamentos.length === 0) {
        tratamentosList.innerHTML = '<p class="text-center">Nenhum tratamento encontrado.</p>';
        return;
    }

    tratamentos.forEach(tratamento => {
        const tratamentoCard = `
            <div class="col-md-4 col-sm-6 col-12 text-center">
                <div class="custom-card">
                    <h4>${tratamento.nome_animal}</h4>
                    <p>Veterinário: ${tratamento.nome_veterinario}</p>
                    <p>Data: ${new Date(tratamento.dataconsulta).toLocaleDateString()}</p>
                    <p>Motivo: ${tratamento.motivo}</p>
                    <p>Prescrição: ${tratamento.prescricao}</p>
                    <a href="edittratamento.html?id=${tratamento.idconsultas}" class="btn btn-custom mb-2">Editar</a>
                    <button class="btn btn-sair mb-2" onclick="openDeleteModal(${tratamento.idconsultas})">Excluir</button>
                </div>
            </div>
        `;
        tratamentosList.innerHTML += tratamentoCard;
    });
}

// Busca tratamentos por nome do animal
function searchTratamentos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredTratamentos = tratamentosData.filter(tratamento =>
        tratamento.nome_animal.toLowerCase().includes(searchTerm)
    );
    renderTratamentos(filteredTratamentos);
}

// Abre o modal de confirmação para exclusão
function openDeleteModal(id) {
    tratamentoIdToDelete = id;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Exclui o tratamento
async function deleteTratamento() {
    try {
        const response = await fetch(`${API_URL}${tratamentoIdToDelete}`, { method: 'DELETE' });

        if (response.ok) {
            loadTratamentos();
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();
        } else {
            alert("Erro ao excluir o tratamento.");
        }
    } catch (error) {
        console.error("Erro ao excluir tratamento:", error);
    }
}

// Adiciona evento ao botão de confirmação
document.getElementById('confirmDeleteButton').addEventListener('click', deleteTratamento);

// Evento de busca
document.getElementById('search-button').addEventListener('click', searchTratamentos);

// Inicia o carregamento
loadTratamentos();
