// URL da API para obter as espécies, raças e criar/editar o animal
const API_URL = "https://apicanil.duckdns.org/tipo"; // URL para buscar espécies
const ANIMAL_API_URL = "https://apicanil.duckdns.org/animal"; // URL para registrar ou editar o animal
const URL_PARAMS = new URLSearchParams(window.location.search);
const animalId = URL_PARAMS.get('id'); // Obtém o ID do animal pela URL

// Função para carregar as espécies e raças do banco de dados
async function fetchSpecies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const speciesSelect = document.getElementById('species');

        // Limpa as opções de espécies
        speciesSelect.innerHTML = `<option value="">Selecionar</option>`;

        // Preenche o select de espécies com base nos dados da API
        data.forEach(item => {
            speciesSelect.innerHTML += `<option value="${item.idtipo}">${item.tipo}</option>`;
        });

        // Salva o mapa de espécies com o ID para uso posterior
        window.speciesData = data;
    } catch (error) {
        console.error('Erro ao carregar as espécies e raças:', error);
    }
}

// Função para carregar os dados do animal que será editado
async function fetchAnimalData() {
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
        document.getElementById('species').value = animal.tipo_idtipo;
        document.getElementById('status').value = animal.status;

        // Carrega as raças dependendo da espécie
        updateBreedOptions();
        setTimeout(() => {
            document.getElementById('breed').value = animal.raca;
        }, 200); // Delay para garantir que as opções de raça sejam carregadas

        // Atualiza a visibilidade do campo de disponibilidade
        updateStatusOptions();
        document.getElementById('formTitle').innerText = 'Editar Informações do Animal'; // Modifica o título do formulário
        document.getElementById('submitButton').innerText = 'Salvar Alterações'; // Muda o texto do botão
    } catch (error) {
        console.error('Erro ao buscar dados do animal:', error);
    }
}

// Função para atualizar as opções de raça com base na espécie selecionada
function updateBreedOptions() {
    const speciesId = document.getElementById('species').value;
    const breedSelect = document.getElementById('breed');
    const breedGroup = document.getElementById('breed-group');

    // Limpa o select de raças
    breedSelect.innerHTML = `<option value="">Selecionar Raça</option>`;

    // Se houver uma espécie selecionada, carrega as raças correspondentes
    if (speciesId && window.speciesData) {
        const selectedSpecies = window.speciesData.find(species => species.idtipo == speciesId);

        if (selectedSpecies && selectedSpecies.raca) {
            breedGroup.style.display = 'block';
            // Preenche o select com as raças da espécie selecionada
            breedSelect.innerHTML += `<option value="${selectedSpecies.raca}">${selectedSpecies.raca}</option>`;
        }
    } else {
        breedGroup.style.display = 'none';
    }
}



// Função para enviar o formulário (criar ou editar)
document.getElementById('animalForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const sexo = document.getElementById('sexo').value;
    const speciesId = document.getElementById('species').value;
    const breed = document.getElementById('breed').value;
    const status = document.getElementById('status').value;

    const animalData = {
        nome,
        sexo,
        status,
        tipo_idtipo: speciesId, // Envia o ID do tipo como chave estrangeira
        raca: breed, // Raça (opcional)
    };

    try {
        let response;
        if (animalId) {
            // Se o ID do animal estiver presente, faz a requisição de edição (PUT)
            response = await fetch(`${ANIMAL_API_URL}/${animalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(animalData)
            });
        } else {
            // Caso contrário, faz a requisição de criação (POST)
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
            window.location.href = 'animais.html'; // Redireciona para a página de lista de animais
        } else {
            alert('Erro ao salvar os dados do animal.');
        }
    } catch (error) {
        console.error('Erro ao salvar animal:', error);
        alert('Erro ao salvar os dados do animal.');
    }
});

// Inicializa as funções
fetchSpecies(); // Carrega as espécies ao iniciar
if (animalId) {
    fetchAnimalData(); // Se for edição, preenche o formulário com os dados
}