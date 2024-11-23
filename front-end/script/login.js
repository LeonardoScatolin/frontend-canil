// Quando o formulário for enviado
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o envio normal do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envia uma requisição POST para a rota /users do servidor
    try {
        const response = await fetch('https://apicanil.duckdns.org/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha: password }) // Enviando 'senha' corretamente
        });

        const data = await response.json();

        // Verifica a resposta da API
        if (data.success) {
            // Se o login for bem-sucedido, redireciona para a página home.html
            window.location.href = 'home.html';
        } else {
            // Caso o login falhe, exibe a mensagem de erro
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao tentar autenticar:', error);
        document.getElementById('error-message').style.display = 'block';
    }
});
