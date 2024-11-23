let tratamentosData = []; // Variável para armazenar todos os tratamentos

// Função para buscar e exibir os tratamentos
async function loadTratamentos() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/consulta/");
        tratamentosData = await response.json(); // Salva todos os tratamentos

        renderTratamentos(tratamentosData); // Exibe todos os tratamentos inicialmente
    } catch (error) {
        console.error('Erro ao carregar tratamentos:', error);
    }
}

// Função para renderizar os tratamentos
function renderTratamentos(tratamentos) {
    const tratamentosList = document.getElementById('tratamentos-list');
    tratamentosList.innerHTML = ''; // Limpa a lista antes de adicionar novos itens

    // Exibe os tratamentos na página
    tratamentos.forEach(tratamento => {
        const tratamentoCard = document.createElement('div');
        tratamentoCard.classList.add('col-md-4', 'col-sm-6', 'col-12', 'text-center');
        tratamentoCard.innerHTML = `
            <div class="custom-card">
                <h4>${tratamento.nome_animal}</h4>
                <p>Veterinário: ${tratamento.nome_veterinario}</p>
                <p>Data: ${new Date(tratamento.dataconsulta).toLocaleDateString()}</p>
                <p>Motivo: ${tratamento.motivo}</p>
                <p>Prescrição: ${tratamento.prescricao}</p>
                <a href="edittratamento.html?id=${tratamento.idconsultas}" class="btn btn-custom mb-2">Editar</a>
                <button class="btn btn-sair mb-2" onclick="deleteTratamento(${tratamento.idconsultas})">Excluir</button>
            </div>
        `;
        tratamentosList.appendChild(tratamentoCard);
    });
}

// Função para excluir um tratamento
async function deleteTratamento(id) {
    const confirmDelete = confirm('Você tem certeza que deseja excluir este tratamento?');
    if (confirmDelete) {
        try {
            const response = await fetch(`https://apicanil.duckdns.org/consulta/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Tratamento excluído com sucesso!');
                loadTratamentos(); // Recarrega a lista de tratamentos
            } else {
                alert('Erro ao excluir tratamento.');
            }
        } catch (error) {
            console.error('Erro ao excluir tratamento:', error);
            alert('Erro ao excluir tratamento.');
        }
    }
}

// Função para realizar a busca de tratamentos por nome do animal
function searchTratamentos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredTratamentos = tratamentosData.filter(tratamento =>
        tratamento.nome_animal.toLowerCase().includes(searchTerm) // Filtra pelo nome do animal
    );
    renderTratamentos(filteredTratamentos); // Atualiza a lista de tratamentos com os resultados filtrados
}

// Adiciona o evento de busca ao clicar no botão
document.getElementById('search-button').addEventListener('click', searchTratamentos);

// Carrega os tratamentos ao carregar a página
loadTratamentos();