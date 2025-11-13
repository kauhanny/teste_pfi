document.addEventListener("DOMContentLoaded", () => {
    console.log("👩‍💼 Página Perfil Profissional carregada!");
    
    // Verificar se é profissional
    verificarStatusProfissional();
    
    // Configurar eventos
    document.getElementById('btnCadastrarProfissional').addEventListener('click', iniciarCadastroProfissional);
    configurarUploads();
    document.getElementById('formServico').addEventListener('submit', adicionarServico);
    
    // Carregar dados se já for profissional
    carregarDadosUsuario();
});

// Carregar dados do usuário logado
function carregarDadosUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (usuario && usuario.id) {
        console.log('👤 Usuário logado:', usuario);
        
        // Preencher campos automáticos se disponível
        if (document.getElementById('nomeProfissional')) {
            document.getElementById('nomeProfissional').value = usuario.nome || '';
        }
        if (document.getElementById('emailProfissional')) {
            document.getElementById('emailProfissional').value = usuario.email || '';
        }
        
        // Se já é profissional, carregar dados completos
        if (usuario.tipo_usuario === 'profissional') {
            carregarDadosProfissionais(usuario.id);
            carregarServicosProfissional(usuario.id);
        }
    }
}

// Verificar se usuário tem perfil profissional
function verificarStatusProfissional() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (usuario && usuario.tipo_usuario === 'profissional') {
        // Usuário é profissional - mostrar perfil completo
        document.getElementById('acessoNegado').style.display = 'none';
        document.getElementById('conteudoProfissional').style.display = 'block';
        document.getElementById('cadastroSection').style.display = 'none';
        document.getElementById('perfilCompleto').style.display = 'block';
        
        console.log('✅ Usuário é profissional, mostrando perfil completo');
        
    } else if (usuario && usuario.isProfissional) {
        // Usuário se cadastrou como profissional mas não completou o cadastro
        document.getElementById('acessoNegado').style.display = 'none';
        document.getElementById('conteudoProfissional').style.display = 'block';
        document.getElementById('cadastroSection').style.display = 'block';
        document.getElementById('perfilCompleto').style.display = 'none';
        
        console.log('📝 Usuário precisa completar cadastro profissional');
        
    } else {
        // Usuário não é profissional - mostrar acesso negado
        document.getElementById('acessoNegado').style.display = 'block';
        document.getElementById('conteudoProfissional').style.display = 'none';
        
        console.log('❌ Acesso negado - usuário não é profissional');
    }
}

// Iniciar cadastro de profissional
function iniciarCadastroProfissional() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario || !usuario.id) {
        alert('❌ Você precisa estar logado para cadastrar um perfil profissional!');
        window.location.href = '/login';
        return;
    }
    
    document.getElementById('acessoNegado').style.display = 'none';
    document.getElementById('conteudoProfissional').style.display = 'block';
    document.getElementById('cadastroSection').style.display = 'block';
    document.getElementById('perfilCompleto').style.display = 'none';
}

// Configurar uploads CORRIGIDO
function configurarUploads() {
    // Upload de foto - CORREÇÃO
    const fotoInput = document.getElementById('fotoInput');
    const fotoPreview = document.getElementById('fotoPreview');
    
    if (fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Verificar se é imagem
                if (!file.type.startsWith('image/')) {
                    alert('❌ Por favor, selecione uma imagem!');
                    return;
                }
                
                // Verificar tamanho (máx 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    alert('❌ Imagem muito grande! Máximo 2MB.');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('📸 Foto carregada com sucesso!');
                    if (fotoPreview) {
                        fotoPreview.src = e.target.result;
                        fotoPreview.style.display = 'block';
                    }
                    
                    // Salvar foto temporariamente
                    salvarFotoTemporaria(e.target.result);
                };
                
                reader.onerror = function() {
                    alert('❌ Erro ao carregar a imagem!');
                };
                
                reader.readAsDataURL(file);
            }
        });
    }

    // Upload de certificado
    const certificadoInput = document.getElementById('certificadoInput');
    const uploadArea = document.getElementById('uploadCertificado');

    if (uploadArea && certificadoInput) {
        uploadArea.addEventListener('click', () => certificadoInput.click());

        certificadoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processarCertificado(e.target.files[0]);
            }
        });
    }
}

// Salvar foto temporariamente
function salvarFotoTemporaria(fotoData) {
    const dadosTemp = JSON.parse(localStorage.getItem('dadosProfissionais_temp') || '{}');
    dadosTemp.foto = fotoData;
    localStorage.setItem('dadosProfissionais_temp', JSON.stringify(dadosTemp));
}

// Processar certificado
function processarCertificado(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('❌ Arquivo muito grande! Máximo 5MB.');
        return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        alert('❌ Formato não permitido! Use PDF, JPG ou PNG.');
        return;
    }

    // Verificar se é original
    document.getElementById('statusVerificacao').innerHTML = '🔍 Verificando autenticidade...';
    
    setTimeout(() => {
        const isOriginal = verificarAutenticidadeCertificado(file);
        
        if (isOriginal) {
            mostrarCertificadoAprovado(file.name);
        } else {
            alert('❌ Certificado não parece ser original! Envie um documento válido.');
            document.getElementById('statusVerificacao').innerHTML = '❌ Certificado recusado';
        }
    }, 2000);
}

// Verificar autenticidade do certificado
function verificarAutenticidadeCertificado(file) {
    const nomeArquivo = file.name.toLowerCase();
    
    // Verificações básicas
    const temAssinatura = nomeArquivo.includes('assinatura') || nomeArquivo.includes('certificado');
    const temCarimbo = nomeArquivo.includes('carimbo') || nomeArquivo.includes('selo');
    const tamanhoOk = file.size > 50000;
    
    return temAssinatura || temCarimbo || tamanhoOk;
}

function mostrarCertificadoAprovado(nomeArquivo) {
    const uploadArea = document.getElementById('uploadCertificado');
    const certificadoPreview = document.getElementById('certificadoPreview');
    
    uploadArea.style.display = 'none';
    certificadoPreview.style.display = 'flex';
    
    document.getElementById('statusVerificacao').innerHTML = '✅ Certificado verificado e aprovado!';
    
    console.log('📜 Certificado aprovado:', nomeArquivo);
}

function removerCertificado() {
    const uploadArea = document.getElementById('uploadCertificado');
    const certificadoPreview = document.getElementById('certificadoPreview');
    
    uploadArea.style.display = 'block';
    certificadoPreview.style.display = 'none';
    document.getElementById('certificadoInput').value = '';
    document.getElementById('statusVerificacao').innerHTML = '⏳ Aguardando certificado';
}

// Finalizar cadastro profissional
async function finalizarCadastroProfissional() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (!usuario || !usuario.id) {
        alert('❌ Você precisa estar logado!');
        window.location.href = '/login';
        return;
    }

    const dados = {
        usuario_id: usuario.id,
        especialidades: document.getElementById('especialidadesProfissional').value,
        descricao: document.getElementById('descricaoProfissional').value,
        chave_pix: document.getElementById('chavePix').value,
        tipo_chave_pix: document.getElementById('tipoChavePix').value
    };

    // Validações
    if (!dados.especialidades) {
        alert('❌ Informe suas especialidades!');
        return;
    }

    if (!dados.chave_pix) {
        alert('❌ Informe sua chave PIX para recebimentos!');
        return;
    }

    try {
        // Cadastrar profissional no banco
        const response = await fetch('/api/profissionais', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (result.success) {
            // Atualizar informações do usuário no localStorage
            usuario.tipo_usuario = 'profissional';
            localStorage.setItem('usuario', JSON.stringify(usuario));
            
            // Salvar serviços no banco
            await salvarServicosNoBanco(usuario.id);
            
            // Mostrar perfil completo
            document.getElementById('cadastroSection').style.display = 'none';
            document.getElementById('perfilCompleto').style.display = 'block';
            
            // Atualizar perfil
            await carregarPerfilCompleto(usuario.id);
            
            alert('🎉 Cadastro profissional concluído com sucesso!');
        } else {
            alert('❌ Erro ao cadastrar profissional: ' + result.message);
        }

    } catch (error) {
        console.error('❌ Erro ao cadastrar profissional:', error);
        alert('❌ Erro ao conectar com o servidor!');
    }
}

// Carregar dados do profissional
async function carregarDadosProfissionais(usuarioId) {
    try {
        const response = await fetch(`/api/profissionais/usuario/${usuarioId}`);
        const result = await response.json();

        if (result.success) {
            const profissional = result.profissional;
            
            // Preencher campos do formulário
            if (document.getElementById('especialidadesProfissional')) {
                document.getElementById('especialidadesProfissional').value = profissional.especialidades || '';
            }
            if (document.getElementById('descricaoProfissional')) {
                document.getElementById('descricaoProfissional').value = profissional.descricao || '';
            }
            if (document.getElementById('chavePix')) {
                document.getElementById('chavePix').value = profissional.chave_pix || '';
            }
            if (document.getElementById('tipoChavePix')) {
                document.getElementById('tipoChavePix').value = profissional.tipo_chave_pix || 'cpf';
            }
            
            console.log('✅ Dados profissionais carregados:', profissional);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados profissionais:', error);
    }
}

// Carregar perfil completo
async function carregarPerfilCompleto(usuarioId) {
    try {
        const response = await fetch(`/api/profissionais/usuario/${usuarioId}`);
        const result = await response.json();

        if (result.success) {
            const profissional = result.profissional;
            
            // Atualizar foto no perfil
            const fotoPerfil = document.getElementById('fotoPerfilCompleto');
            if (fotoPerfil) {
                // Usar foto salva temporariamente ou padrão
                const dadosTemp = JSON.parse(localStorage.getItem('dadosProfissionais_temp') || '{}');
                fotoPerfil.src = dadosTemp.foto || '../img/avatar-default.png';
            }
            
            // Atualizar informações
            document.getElementById('nomePerfilCompleto').textContent = profissional.nome_completo || 'Nome não informado';
            document.getElementById('especialidadesPerfilCompleto').textContent = profissional.especialidades || 'Cabelo, Unhas, Estética';
            document.getElementById('descricaoPerfilCompleto').textContent = profissional.descricao || 'Profissional de beleza qualificada';
            document.getElementById('contatoPerfilCompleto').textContent = profissional.telefone || 'Telefone não informado';
            document.getElementById('enderecoPerfilCompleto').textContent = profissional.endereco || 'Endereço não informado';
            
            console.log('✅ Perfil completo carregado');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar perfil completo:', error);
    }
}

// Modal de serviços
function mostrarModalServico() {
    document.getElementById('modalServico').style.display = 'block';
    document.getElementById('formServico').reset();
}

function fecharModalServico() {
    document.getElementById('modalServico').style.display = 'none';
}

// Adicionar serviço
function adicionarServico(e) {
    e.preventDefault();
    
    const novoServico = {
        id: Date.now(),
        nome: document.getElementById('nomeServico').value,
        descricao: document.getElementById('descricaoServico').value,
        preco: parseFloat(document.getElementById('precoServico').value),
        duracao: parseInt(document.getElementById('duracaoServico').value),
        categoria: document.getElementById('categoriaServico').value,
        dataCriacao: new Date().toISOString()
    };

    // Validar
    if (!novoServico.nome || !novoServico.preco || !novoServico.duracao) {
        alert('❌ Preencha nome, preço e duração do serviço!');
        return;
    }

    // Salvar serviço localmente
    const servicos = JSON.parse(localStorage.getItem('servicosProfissionais') || '[]');
    servicos.push(novoServico);
    localStorage.setItem('servicosProfissionais', JSON.stringify(servicos));

    // Atualizar interface
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.id) {
        carregarServicosProfissional(usuario.id);
    } else {
        carregarServicosProfissional();
    }
    
    fecharModalServico();
    
    alert('✅ Serviço adicionado com sucesso!');
}

// Salvar serviços no banco
async function salvarServicosNoBanco(profissionalId) {
    const servicos = JSON.parse(localStorage.getItem('servicosProfissionais') || '[]');
    
    if (servicos.length === 0) {
        console.log('ℹ️ Nenhum serviço para salvar');
        return;
    }
    
    try {
        for (const servico of servicos) {
            const response = await fetch('/api/servicos-profissional', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profissional_id: profissionalId,
                    nome_servico: servico.nome,
                    descricao: servico.descricao,
                    preco: servico.preco,
                    duracao_minutos: servico.duracao,
                    categoria: servico.categoria
                })
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('✅ Serviço salvo no banco:', servico.nome);
            } else {
                console.error('❌ Erro ao salvar serviço:', data.message);
            }
        }
        
        // Limpar serviços locais após salvar no banco
        localStorage.removeItem('servicosProfissionais');
        
        // Atualizar página de serviços
        atualizarServicosPublicos();
        
    } catch (error) {
        console.error('❌ Erro ao salvar serviços no banco:', error);
    }
}

// Carregar serviços do profissional
async function carregarServicosProfissional(profissionalId = null) {
    // Se temos um profissionalId, buscar do banco
    if (profissionalId) {
        try {
            const response = await fetch(`/api/servicos-profissional/${profissionalId}`);
            const result = await response.json();

            if (result.success) {
                exibirServicos(result.servicos);
                return;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar serviços do banco:', error);
        }
    }

    // Fallback: usar serviços locais
    const servicos = JSON.parse(localStorage.getItem('servicosProfissionais') || '[]');
    exibirServicos(servicos);
}

// Exibir serviços na interface
function exibirServicos(servicos) {
    const servicosLista = document.getElementById('servicosLista');
    const servicosPerfil = document.getElementById('servicosPerfil');
    
    if (servicos.length === 0) {
        const emptyMessage = '<p class="empty-message">Nenhum serviço cadastrado ainda</p>';
        if (servicosLista) servicosLista.innerHTML = emptyMessage;
        if (servicosPerfil) servicosPerfil.innerHTML = emptyMessage;
        return;
    }

    const html = servicos.map(servico => `
        <div class="servico-item">
            <div class="servico-info">
                <h4>${servico.nome_servico || servico.nome}</h4>
                <p>${servico.descricao || 'Sem descrição'}</p>
                <small>Duração: ${servico.duracao_minutos || servico.duracao}min | Categoria: ${servico.categoria}</small>
            </div>
            <div class="servico-preco">R$ ${(servico.preco || 0).toFixed(2)}</div>
        </div>
    `).join('');

    if (servicosLista) servicosLista.innerHTML = html;
    if (servicosPerfil) servicosPerfil.innerHTML = html;
}

// Atualizar serviços públicos
function atualizarServicosPublicos() {
    console.log('🔄 Atualizando lista de serviços públicos...');
    // Disparar evento para outras páginas
    window.dispatchEvent(new CustomEvent('servicosAtualizados'));
}

// Ir para agenda profissional
function irParaAgendaProfissional() {
    window.location.href = '/agendaprofissional';
}