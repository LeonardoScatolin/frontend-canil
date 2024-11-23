document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        // Primeiro, busca todos os usuários
        const response = await fetch('https://apicanil.duckdns.org/users');
        const users = await response.json();

        // Procura um usuário que corresponda ao email e senha fornecidos
        const user = users.find(user =>
            user.email === email && user.senha === password
        );

        if (user) {
            // Salva os dados do usuário no localStorage
            localStorage.setItem('userData', JSON.stringify({
                id: user.idusuario,
                nome: user.nome,
                email: user.email,
                role: user.role
            }));

            // Login bem-sucedido - redireciona para a página home
            window.location.href = 'home.html';
        } else {
            // Usuário não encontrado ou credenciais incorretas
            errorMessage.textContent = 'Email ou senha incorretos';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao tentar fazer login:', error);
        errorMessage.textContent = 'Erro ao tentar fazer login. Tente novamente.';
        errorMessage.style.display = 'block';
    }
});

// Função para verificar se o usuário já está logado
function checkLoggedIn() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        // Se já estiver logado, redireciona para a home
        window.location.href = 'home.html';
    }
}

// Verifica quando a página carrega
checkLoggedIn();