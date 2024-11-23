let veterinarians = []; // Variável para armazenar os veterinários

// Função para carregar a lista de veterinários
async function fetchVeterinarians() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/veterinario/");
        veterinarians = await response.json();
        displayVeterinarians(veterinarians); // Exibe todos os veterinários ao carregar a página
    } catch (error) {
        console.error('Erro ao carregar os veterinários:', error);
    }
}

// Função para exibir os veterinários
function displayVeterinarians(vets) {
    const vetListDiv = document.getElementById('vet-list');
    vetListDiv.innerHTML = ''; // Limpa a lista antes de adicionar os veterinários

    vets.forEach(vet => {
        const vetCard = `
            <div class="col-md-4 col-sm-6 col-12 text-center">
                <div class="custom-card">
                    <h4>Veterinário: ${vet.nome}</h4>
                    <p>E-mail: ${vet.email}</p>
                    <p>Telefone: ${vet.telefone}</p>
                    <p>CRMV: ${vet.crmv}</p>
                    <a href="regveterinario.html?id=${vet.idveterinario}" class="btn btn-custom mb-2">Editar</a>
                    <a href="#" onclick="deleteVeterinarian(${vet.idveterinario})" class="btn btn-sair mb-2">Excluir</a>
                </div>
            </div>
        `;
        vetListDiv.innerHTML += vetCard;
    });
}

// Função para excluir um veterinário
async function deleteVeterinarian(vetId) {
    const confirmDelete = confirm("Tem certeza que deseja excluir este veterinário?");
    if (confirmDelete) {
        try {
            const response = await fetch(`https://apicanil.duckdns.org/veterinario/${vetId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (response.ok) {
                alert('Veterinário excluído com sucesso!');
                fetchVeterinarians(); // Atualiza a lista de veterinários
            } else {
                alert('Erro ao excluir o veterinário.');
            }
        } catch (error) {
            console.error('Erro ao excluir veterinário:', error);
            alert('Erro ao excluir o veterinário.');
        }
    }
}

// Função para buscar veterinários
function searchVeterinarians() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredVeterinarians = veterinarians.filter(vet => {
        return vet.nome.toLowerCase().includes(searchTerm) ||
            vet.email.toLowerCase().includes(searchTerm) ||
            vet.telefone.toLowerCase().includes(searchTerm);
    });
    displayVeterinarians(filteredVeterinarians); // Exibe os veterinários filtrados
}

// Carrega os veterinários ao carregar a página
fetchVeterinarians();