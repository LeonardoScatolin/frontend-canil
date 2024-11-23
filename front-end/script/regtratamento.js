// Função para carregar os animais e veterinários
async function loadAnimals() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/animal/");
        const animals = await response.json();

        const animalSelect = document.getElementById('animal-select');
        animals.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.idanimal;
            option.textContent = animal.nome;
            animalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar animais:', error);
    }
}

// Função para carregar veterinários
async function loadVeterinarios() {
    try {
        const response = await fetch("https://apicanil.duckdns.org/veterinario/");
        const veterinarios = await response.json();

        const veterinarioSelect = document.getElementById('veterinario-select');
        veterinarios.forEach(veterinario => {
            const option = document.createElement('option');
            option.value = veterinario.idveterinario;
            option.textContent = veterinario.nome;
            veterinarioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar veterinários:', error);
    }
}

// Função para exibir campos de animal após seleção
document.getElementById('animal-select').addEventListener('change', async function () {
    const animalId = this.value;
    if (animalId) {
        try {
            const response = await fetch(`https://apicanil.duckdns.org/animal/${animalId}`);
            const animal = await response.json();

            // Atualiza os campos de espécie, raça e sexo
            document.getElementById('especie').value = animal.tipo_animal;
            document.getElementById('raca').value = animal.raca_animal || 'Não informado';
            document.getElementById('sexo').value = animal.sexo;

            // Exibe os campos
            document.getElementById('especie-container').style.display = 'block';
            document.getElementById('raca-container').style.display = 'block';
            document.getElementById('sexo-container').style.display = 'block';
        } catch (error) {
            console.error('Erro ao carregar animal:', error);
        }
    } else {
        // Oculta os campos caso nenhum animal seja selecionado
        document.getElementById('especie-container').style.display = 'none';
        document.getElementById('raca-container').style.display = 'none';
        document.getElementById('sexo-container').style.display = 'none';
    }
});

// Função para registrar o tratamento
document.getElementById('form-tratamento').addEventListener('submit', async function (event) {
    event.preventDefault();

    const data = {
        dataconsulta: document.getElementById('data-tratamento').value,
        motivo: document.getElementById('motivo').value,
        prescricao: document.getElementById('descricao').value, // Descrição é o campo para prescrição
        animal_idanimal: document.getElementById('animal-select').value,
        veterinario_idveterinario: document.getElementById('veterinario-select').value,
    };

    try {
        const response = await fetch("https://apicanil.duckdns.org/consulta", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Tratamento registrado com sucesso!');
            window.location.href = 'tratamentos.html';
        } else {
            alert('Erro ao registrar tratamento.');
        }
    } catch (error) {
        console.error('Erro ao registrar tratamento:', error);
    }
});

// Carregar animais e veterinários ao carregar a página
loadAnimals();
loadVeterinarios();