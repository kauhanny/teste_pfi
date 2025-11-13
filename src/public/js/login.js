document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();

        if (!email || !senha) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const resposta = await fetch('/api/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            });

            const dados = await resposta.json();

            if (dados.success) {
                alert(dados.message);
                window.location.href = '/menu'; // Muda para '/menu'
            } else {
                alert('❌ ' + dados.message);
            }

        } catch (erro) {
            console.error("Erro:", erro);
            alert("🔴 Erro ao conectar com o servidor!");
        }
    });
});

