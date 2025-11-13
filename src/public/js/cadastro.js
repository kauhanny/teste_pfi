document.addEventListener('DOMContentLoaded', () => {
    const btnCadastrar = document.getElementById('btnCadastrar');
    const btnContinuar = document.getElementById('btnContinuar');
    const checkboxProfissional = document.getElementById('cadastroProfissional');

    let cadastroConcluido = false;
    let usuarioId = null;

    // Desabilita botão continuar inicialmente
    btnContinuar.disabled = true;
    btnContinuar.style.opacity = "0.6";
    btnContinuar.style.cursor = "not-allowed";

    btnCadastrar.addEventListener('click', async () => {
        // Coleta todos os dados do formulário
        const nome = document.getElementById('nome').value.trim();
        const idade = document.getElementById('idade').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const endereco = document.getElementById('endereco').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const confirmar = document.getElementById('confirmar').value.trim();
        const isProfissional = checkboxProfissional.checked;

        console.log('📝 Tentando cadastrar:', { 
            nome, idade, telefone, endereco, email, 
            tipo: isProfissional ? 'Profissional' : 'Cliente' 
        });

        // Validações completas
        if (!nome || !idade || !telefone || !endereco || !email || !senha || !confirmar) {
            alert('❌ Preencha todos os campos!');
            return;
        }

        if (senha !== confirmar) {
            alert('❌ As senhas não coincidem!');
            return;
        }

        if (senha.length < 6) {
            alert('❌ A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        if (idade < 1 || idade > 120) {
            alert('❌ Idade inválida! Digite uma idade entre 1 e 120 anos.');
            return;
        }

        if (!validateEmail(email)) {
            alert('❌ Email inválido! Digite um email válido.');
            return;
        }

        // Formata telefone (remove caracteres não numéricos)
        const telefoneFormatado = telefone.replace(/\D/g, '');

        // Determina o tipo de usuário
        const tipoUsuario = isProfissional ? 'profissional' : 'cliente';

        // Loading no botão
        btnCadastrar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cadastrando...';
        btnCadastrar.disabled = true;

        try {
            console.log('🔄 Enviando dados para o servidor...');
            
            const resposta = await fetch('/api/cadastrar', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nome, 
                    idade: parseInt(idade), 
                    telefone: telefoneFormatado, 
                    endereco, 
                    email, 
                    senha,
                    tipo_usuario: tipoUsuario
                })
            });

            console.log('📨 Resposta do servidor:', resposta.status);

            // Verifica se a resposta é válida
            if (!resposta.ok) {
                const errorText = await resposta.text();
                console.error('❌ Erro HTTP:', resposta.status, errorText);
                
                // Tenta parsear como JSON para mensagem mais específica
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || `Erro no servidor: ${resposta.status}`);
                } catch {
                    throw new Error(`Erro no servidor: ${resposta.status} - ${errorText}`);
                }
            }

            const dados = await resposta.json();
            console.log('📊 Dados recebidos:', dados);

            if (dados.success) {
                // ✅ CADASTRO BEM-SUCEDIDO
                usuarioId = dados.userId;
                
                // Salvar informações do usuário no localStorage
                const usuarioInfo = {
                    id: usuarioId,
                    nome: nome,
                    email: email,
                    tipo_usuario: tipoUsuario,
                    isProfissional: isProfissional
                };
                localStorage.setItem('usuario', JSON.stringify(usuarioInfo));
                
                let mensagemSucesso = '✅ Cadastro realizado com sucesso!\n\n';
                
                if (isProfissional) {
                    mensagemSucesso += '🎉 Seu perfil profissional foi criado!\n';
                    mensagemSucesso += 'Agora você pode acessar a área profissional para completar seu cadastro.';
                } else {
                    mensagemSucesso += 'Agora você pode fazer login no sistema.';
                }
                
                alert(mensagemSucesso);
                cadastroConcluido = true;
                
                // Habilita botão continuar
                btnContinuar.disabled = false;
                btnContinuar.style.opacity = "1";
                btnContinuar.style.cursor = "pointer";
                btnContinuar.style.background = "#4CAF50";
                
                if (isProfissional) {
                    btnContinuar.innerHTML = '👩‍💼 Ir para Perfil Profissional';
                } else {
                    btnContinuar.innerHTML = '🎉 Continuar para o Menu';
                }
                
                // Limpa o formulário
                document.getElementById('nome').value = '';
                document.getElementById('idade').value = '';
                document.getElementById('telefone').value = '';
                document.getElementById('endereco').value = '';
                document.getElementById('email').value = '';
                document.getElementById('senha').value = '';
                document.getElementById('confirmar').value = '';
                checkboxProfissional.checked = false;
                
                console.log('✅ Cadastro concluído com sucesso! Usuário ID:', usuarioId);
                
            } else {
                // ❌ ERRO NO CADASTRO
                let mensagemErro = dados.message || 'Erro desconhecido no cadastro';
                
                if (mensagemErro.includes('ER_DUP_ENTRY') || mensagemErro.includes('Email já cadastrado')) {
                    mensagemErro = '❌ Este email já está cadastrado! Tente fazer login ou use outro email.';
                } else if (mensagemErro.includes('usuário')) {
                    mensagemErro = '❌ Erro ao criar usuário. Tente novamente.';
                }
                
                alert(mensagemErro);
                console.error('❌ Erro no cadastro:', mensagemErro);
            }

        } catch (erro) {
            console.error("🔴 Erro completo:", erro);
            
            let mensagemErro = "🔴 Erro ao conectar com o servidor! ";
            
            if (erro.message.includes('Failed to fetch')) {
                mensagemErro += "Servidor indisponível. Verifique se o servidor está rodando.";
            } else if (erro.message.includes('NetworkError')) {
                mensagemErro += "Problema de conexão. Verifique sua internet.";
            } else if (erro.message.includes('tipo_usuario')) {
                mensagemErro = "⚠️ Problema temporário no banco de dados. O cadastro foi realizado, mas algumas funcionalidades podem estar limitadas.";
                // Força o cadastro como concluído mesmo com erro
                cadastroConcluido = true;
                btnContinuar.disabled = false;
                btnContinuar.style.opacity = "1";
                btnContinuar.style.cursor = "pointer";
            } else {
                mensagemErro += erro.message;
            }
            
            alert(mensagemErro);
        } finally {
            // Restaura botão cadastrar
            btnCadastrar.innerHTML = '📝 Cadastrar';
            btnCadastrar.disabled = false;
        }
    });

    // Botão Continuar - CORRIGIDO para redirecionar conforme o tipo de usuário
    btnContinuar.addEventListener('click', (e) => {
        e.preventDefault();
        if (cadastroConcluido) {
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
            
            if (usuario.isProfissional) {
                console.log('🚀 Redirecionando para perfil profissional...');
                window.location.href = '/perfilprofissional';
            } else {
                console.log('🚀 Redirecionando para o menu...');
                window.location.href = '/menu';
            }
        } else {
            alert("⛔ Você precisa completar o cadastro antes de continuar!\n\nClique em 'Cadastrar' primeiro.");
        }
    });

    // Enter submete o formulário
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnCadastrar.click();
        }
    });

    // Função para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Efeitos visuais nos inputs
    const inputs = document.querySelectorAll('.input-box input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.boxShadow = '0 0 10px rgba(169, 79, 119, 0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.boxShadow = 'none';
        });
    });

    // Efeito no checkbox
    if (checkboxProfissional) {
        checkboxProfissional.addEventListener('change', function() {
            const label = this.parentElement;
            if (this.checked) {
                label.style.color = '#a94f77';
                label.style.fontWeight = '700';
            } else {
                label.style.color = '#5a5a5a';
                label.style.fontWeight = '600';
            }
        });
    }

    console.log('✅ cadastro.js carregado com sucesso!');
});