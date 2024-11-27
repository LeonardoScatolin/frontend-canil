// URL da API para obter as espécies, raças e criar/editar o animal
const API_URL = "https://apicanil.duckdns.org/tipo";
const ANIMAL_API_URL = "https://apicanil.duckdns.org/animal";
const URL_PARAMS = new URLSearchParams(window.location.search);
const animalId = URL_PARAMS.get('id');

// Função para carregar as espécies do banco de dados
async function fetchSpecies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const speciesSelect = document.getElementById('species');

        // Limpa as opções de espécies
        speciesSelect.innerHTML = `<option value="">Selecionar</option>`;

        // Filtra e adiciona apenas Gato e Cachorro
        const allowedSpecies = ['Gato', 'Cachorro'];
        const uniqueSpecies = [...new Set(data
            .filter(item => allowedSpecies.includes(item.tipo))
            .map(item => item.tipo)
        )];

        // Preenche o select de espécies com Gato e Cachorro
        uniqueSpecies.forEach(species => {
            speciesSelect.innerHTML += `<option value="${species}">${species}</option>`;
        });

        // Salva o mapa de espécies com o ID para uso posterior
        window.speciesData = data;

        // Adiciona event listener para atualizar raças quando a espécie mudar
        speciesSelect.addEventListener('change', updateBreedOptions);
    } catch (error) {
        console.error('Erro ao carregar as espécies:', error);
        alert('Não foi possível carregar as espécies. Tente novamente mais tarde.');
    }
}

// Função para atualizar as opções de raça com base na espécie selecionada
async function updateBreedOptions() {
    const speciesSelect = document.getElementById('species');
    const selectedSpecies = speciesSelect.value;
    const breedSelect = document.getElementById('breed');
    const breedGroup = document.getElementById('breed-group');

    // Limpa o select de raças
    breedSelect.innerHTML = `<option value="">Selecionar Raça</option>`;

    // Se houver uma espécie selecionada, carrega as raças correspondentes do banco
    if (selectedSpecies && window.speciesData) {
        // Filtra as raças baseado na espécie selecionada
        const filteredBreeds = window.speciesData
            .filter(item => item.tipo === selectedSpecies)
            .map(item => item.raca);

        // Remove duplicatas de raças
        const uniqueBreeds = [...new Set(filteredBreeds)];

        if (uniqueBreeds.length > 0) {
            breedGroup.style.display = 'block';
            
            // Preenche o select com as raças únicas da espécie selecionada
            uniqueBreeds.forEach(breed => {
                breedSelect.innerHTML += `<option value="${breed}">${breed}</option>`;
            });
        } else {
            breedGroup.style.display = 'none';
            alert(`Não há raças cadastradas para ${selectedSpecies}.`);
        }
    } else {
        breedGroup.style.display = 'none';
    }
}

// Função para buscar e preencher dados do animal para edição
async function fetchAnimalData() {
    if (!animalId) return;

    try {
        const response = await fetch(`${ANIMAL_API_URL}/${animalId}`);
        const animal = await response.json();

        if (!animal) {
            alert('Animal não encontrado.');
            return;
        }

        // Preenche o formulário com os dados do animal
        document.getElementById('nome').value = animal.nome;
        document.getElementById('sexo').value = animal.sexo;
        
        // Encontra o tipo (espécie) correspondente ao ID
        if (window.speciesData) {
            const tipo = window.speciesData.find(item => item.idtipo === animal.tipo_idtipo)?.tipo;
            const speciesSelect = document.getElementById('species');
            speciesSelect.value = tipo;

            // Dispara o evento de mudança para carregar as raças
            speciesSelect.dispatchEvent(new Event('change'));
        }
        
        document.getElementById('status').value = animal.status;

        // Define a raça após o carregamento das opções
        setTimeout(() => {
            document.getElementById('breed').value = animal.raca;
        }, 200);

        // Atualiza o título e o botão para edição
        document.getElementById('formTitle').innerText = 'Editar Informações do Animal';
        document.getElementById('submitButton').innerText = 'Salvar Alterações';
    } catch (error) {
        console.error('Erro ao buscar dados do animal:', error);
        alert('Não foi possível carregar os dados do animal. Tente novamente.');
    }
}

// Função para enviar o formulário (criar ou editar)
function setupFormSubmission() {
    const animalForm = document.getElementById('animalForm');
    animalForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value;
        const sexo = document.getElementById('sexo').value;
        const species = document.getElementById('species').value;
        const breed = document.getElementById('breed').value;
        const status = document.getElementById('status').value;

        // Encontrar o ID do tipo correspondente à espécie selecionada
        const tipoId = window.speciesData.find(item => item.tipo === species)?.idtipo;

        if (!tipoId) {
            alert('Erro: Não foi possível encontrar o ID da espécie.');
            return;
        }

        const animalData = {
            nome,
            sexo,
            status,
            tipo_idtipo: tipoId,
            raca: breed,
        };

        try {
            let response;
            if (animalId) {
                // Requisição de edição (PUT)
                response = await fetch(`${ANIMAL_API_URL}/${animalId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(animalData)
                });
            } else {
                // Requisição de criação (POST)
                response = await fetch(ANIMAL_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(animalData)
                });
            }

            if (response.ok) {
                alert(animalId ? 'Animal atualizado com sucesso!' : 'Animal criado com sucesso!');
                window.location.href = 'animais.html';
            } else {
                alert('Erro ao salvar os dados do animal.');
            }
        } catch (error) {
            console.error('Erro ao salvar animal:', error);
            alert('Erro ao salvar os dados do animal. Verifique sua conexão.');
        }
    });
}

// Inicialização das funções
async function initializeForm() {
    await fetchSpecies();
    if (animalId) {
        fetchAnimalData();
    }
    setupFormSubmission();
}

// Chama a função de inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeForm);