const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// CORS configurado para aceitar todas as origens
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos estáticos da pasta src/public
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Conexão MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ================== TESTE DE CONEXÃO DETALHADO ==================
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERRO ao conectar ao MySQL:', err.message);
        console.error('🔍 Detalhes:', err);
    } else {
        console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
        
        // Verificar tabelas
        connection.query('SHOW TABLES', (err, results) => {
            if (err) {
                console.error('❌ Erro ao verificar tabelas:', err);
            } else {
                console.log('📊 Tabelas disponíveis:', results.map(r => Object.values(r)[0]));
            }
        });
        
        connection.release();
    }
});

// ================== ROTAS DAS PÁGINAS ==================

// Tela Inicial (Index)
app.get('/', (req, res) => {
  console.log('🏠 Página INICIAL solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'index.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    const altPath = path.join(__dirname, 'public', 'html', 'index.html');
    if (fs.existsSync(altPath)) {
      res.sendFile(altPath);
    } else {
      console.log('❌ index.html não encontrado em:', filePath);
      res.status(404).send('Página não encontrada');
    }
  }
});

// Menu (Pós-login)
app.get('/menu', (req, res) => {
  console.log('📱 Página MENU solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'menu.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ menu.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Login
app.get('/login', (req, res) => {
  console.log('🔐 Página de login solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'login.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ login.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Cadastro
app.get('/cadastro', (req, res) => {
  console.log('📝 Página de cadastro solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'cadastro.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ cadastro.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Serviços
app.get('/servicos', (req, res) => {
  console.log('💼 Página de serviços solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'servicos.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ servicos.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Agenda
app.get('/agenda', (req, res) => {
  console.log('📅 Página de agenda solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'agenda.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ agenda.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Avaliação
app.get('/avaliacao', (req, res) => {
  console.log('⭐ Página de avaliação solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'avaliacao.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ avaliacao.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Calendário
app.get('/calendario', (req, res) => {
  console.log('📅 Página de calendário solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'calendario.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ calendario.html não encontrado em:', filePath);
    res.status(404).send('Página não encontrada');
  }
});

// Minha Agenda
app.get('/minhaagenda', (req, res) => {
  console.log('📅 Página Minha Agenda solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'minhaagenda.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ minhaagenda.html não encontrado');
    res.status(404).send('Página não encontrada');
  }
});

// Perfil Profissional
app.get('/perfilprofissional', (req, res) => {
  console.log('👩‍💼 Página Perfil Profissional solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'perfilprofissional.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ perfilprofissional.html não encontrado');
    res.status(404).send('Página não encontrada');
  }
});

// Agenda Profissional
app.get('/agendaprofissional', (req, res) => {
  console.log('📊 Página Agenda Profissional solicitada');
  const filePath = path.join(__dirname, 'src', 'public', 'html', 'agendaprofissional.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log('❌ agendaprofissional.html não encontrado');
    res.status(404).send('Página não encontrada');
  }
});

// ================== ROTAS DA API ==================

// CADASTRO DE USUÁRIO - VERSÃO SIMPLIFICADA
app.post('/api/cadastrar', async (req, res) => {
  console.log('📝 Tentativa de cadastro recebida');
  const { nome, idade, telefone, endereco, email, senha, tipo_usuario } = req.body;

  if (!nome || !idade || !telefone || !endereco || !email || !senha) {
    return res.status(400).json({ 
      success: false,
      message: 'Preencha todos os campos!' 
    });
  }

  try {
    const hash = await bcrypt.hash(senha, 10);
    
    // Tenta cadastrar com tipo_usuario
    const sql = 'INSERT INTO usuarios (nome_completo, idade, telefone, endereco, email, senha, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const valores = [nome, idade, telefone, endereco, email, hash, tipo_usuario || 'cliente'];

    console.log('🔍 Executando SQL:', sql);
    console.log('📦 Valores:', valores);

    pool.query(sql, valores, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ 
            success: false,
            message: 'Email já cadastrado! Tente fazer login.' 
          });
        }
        
        // Se deu erro por causa da coluna tipo_usuario, tenta sem ela
        if (err.code === 'ER_BAD_FIELD_ERROR') {
          console.log('⚠️ Coluna tipo_usuario não existe, tentando cadastro sem ela...');
          const sqlSemTipo = 'INSERT INTO usuarios (nome_completo, idade, telefone, endereco, email, senha) VALUES (?, ?, ?, ?, ?, ?)';
          pool.query(sqlSemTipo, [nome, idade, telefone, endereco, email, hash], (err2, result2) => {
            if (err2) {
              console.error('❌ Erro definitivo no cadastro:', err2);
              return res.status(500).json({ 
                success: false,
                message: 'Erro ao cadastrar usuário: ' + err2.message 
              });
            }
            
            finalizarCadastro(result2, tipo_usuario, res);
          });
        } else {
          console.error('❌ Erro no cadastro:', err);
          return res.status(500).json({ 
            success: false,
            message: 'Erro ao cadastrar usuário: ' + err.message 
          });
        }
      } else {
        // SUCESSO no cadastro
        finalizarCadastro(result, tipo_usuario, res);
      }
    });
    
  } catch (erro) {
    console.error('❌ Erro no servidor:', erro);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno no servidor.' 
    });
  }
});

// Função auxiliar para finalizar o cadastro
function finalizarCadastro(result, tipo_usuario, res) {
  console.log('✅ Usuário cadastrado com ID:', result.insertId);
  
  // Se é profissional, cria registro na tabela profissionais
  if (tipo_usuario === 'profissional') {
    const sqlProfissional = 'INSERT INTO profissionais (usuario_id, especialidades) VALUES (?, ?)';
    pool.query(sqlProfissional, [result.insertId, 'Profissional de beleza'], (profErr) => {
      if (profErr) {
        console.error('❌ Erro ao criar perfil profissional:', profErr);
        // Continua mesmo com erro na tabela profissionais
      } else {
        console.log('✅ Perfil profissional criado para usuário:', result.insertId);
      }
    });
  }
  
  res.json({ 
    success: true,
    message: 'Usuário cadastrado com sucesso!',
    userId: result.insertId,
    isProfissional: tipo_usuario === 'profissional'
  });
}

// LOGIN
app.post('/api/login', (req, res) => {
  console.log('🔐 Tentativa de login recebida');
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ 
      success: false,
      message: 'Preencha todos os campos!' 
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  pool.query(sql, [email], async (err, resultados) => {
    if (err) {
      console.error('❌ Erro no login:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro no servidor.' 
      });
    }
    
    if (resultados.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuário não encontrado!' 
      });
    }

    const usuario = resultados[0];
    try {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (!senhaCorreta) {
        return res.status(401).json({ 
          success: false,
          message: 'Senha incorreta!' 
        });
      }

      console.log('✅ Login realizado com sucesso para:', usuario.email);
      res.json({ 
        success: true,
        message: `Bem-vindo(a), ${usuario.nome_completo}!`,
        usuario: {
          id: usuario.id,
          nome: usuario.nome_completo,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario || 'cliente'
        }
      });
    } catch (erro) {
      console.error('❌ Erro ao comparar senhas:', erro);
      res.status(500).json({ 
        success: false,
        message: 'Erro interno no servidor.' 
      });
    }
  });
});

// API - Cadastrar profissional completo (VERSÃO CORRIGIDA)
app.post('/api/profissionais/completo', (req, res) => {
  console.log('👩‍💼 Cadastrando profissional completo');
  console.log('📦 Dados recebidos:', req.body);

  const { usuario_id, especialidades, descricao, chave_pix, tipo_chave_pix } = req.body;

  // Validações básicas
  if (!usuario_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'ID do usuário não informado' 
    });
  }

  if (!especialidades) {
    return res.status(400).json({ 
      success: false, 
      message: 'Informe suas especialidades!' 
    });
  }

  // SQL CORRETO - usando apenas as colunas que sabemos que existem
  const sql = `
    INSERT INTO profissionais (usuario_id, especialidades, descricao, chave_pix, tipo_chave_pix) 
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      especialidades = VALUES(especialidades),
      descricao = VALUES(descricao),
      chave_pix = VALUES(chave_pix),
      tipo_chave_pix = VALUES(tipo_chave_pix)
  `;
  
  const valores = [
    usuario_id, 
    especialidades, 
    descricao || 'Profissional de beleza', 
    chave_pix || '11999999999', 
    tipo_chave_pix || 'cpf'
  ];

  console.log('🔍 Executando SQL para profissional');
  console.log('📦 Valores:', valores);

  pool.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Erro ao salvar profissional:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro no banco de dados: ' + err.message 
      });
    }
    
    console.log('✅ Perfil profissional salvo com sucesso!');
    console.log('📊 Resultado:', result);
    
    res.json({ 
      success: true,
      message: 'Perfil profissional salvo com sucesso!',
      profissionalId: result.insertId || result.affectedRows
    });
  });
});

// API - Salvar serviço do profissional
app.post('/api/servicos-profissional', (req, res) => {
  console.log('💅 Salvando serviço profissional no banco');
  const { profissional_id, nome_servico, descricao, preco, duracao_minutos, categoria } = req.body;

  if (!profissional_id || !nome_servico || !preco || !duracao_minutos) {
    return res.status(400).json({ 
      success: false, 
      message: 'Preencha todos os campos obrigatórios!' 
    });
  }

  const sql = `INSERT INTO servicos_profissionais 
              (profissional_id, nome_servico, descricao, preco, duracao_minutos, categoria) 
              VALUES (?, ?, ?, ?, ?, ?)`;
  
  pool.query(sql, [profissional_id, nome_servico, descricao, preco, duracao_minutos, categoria], (err, result) => {
    if (err) {
      console.error('❌ Erro ao salvar serviço:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao salvar serviço: ' + err.message 
      });
    }
    
    console.log('✅ Serviço salvo com ID:', result.insertId);
    res.json({ 
      success: true,
      message: 'Serviço cadastrado com sucesso!',
      servicoId: result.insertId
    });
  });
});

// API - Buscar serviços do profissional
app.get('/api/servicos-profissional/:profissional_id', (req, res) => {
  const { profissional_id } = req.params;
  console.log(`💼 Buscando serviços do profissional ${profissional_id}`);
  
  const sql = 'SELECT * FROM servicos_profissionais WHERE profissional_id = ? ORDER BY nome_servico';
  
  pool.query(sql, [profissional_id], (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar serviços:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar serviços' 
      });
    }
    
    console.log(`✅ ${resultados.length} serviços encontrados`);
    res.json({ 
      success: true,
      servicos: resultados 
    });
  });
});

// API - Buscar profissional por usuário
app.get('/api/profissionais/usuario/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  console.log(`👩‍💼 Buscando profissional do usuário ${usuario_id}`);
  
  const sql = `
    SELECT p.*, u.nome_completo, u.email, u.telefone, u.endereco
    FROM profissionais p
    JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.usuario_id = ?
  `;
  
  pool.query(sql, [usuario_id], (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar profissional:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar profissional' 
      });
    }
    
    if (resultados.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profissional não encontrado' 
      });
    }
    
    console.log('✅ Profissional encontrado:', resultados[0].nome_completo);
    res.json({ 
      success: true,
      profissional: resultados[0] 
    });
  });
});

// AGENDAMENTO
app.post('/api/agendar', (req, res) => {
  console.log('📅 Tentativa de agendamento recebida');
  const { usuario_id, profissional_id, servico, data, hora, valor } = req.body;

  if (!usuario_id) {
    const sqlBuscarUsuario = 'SELECT id FROM usuarios ORDER BY id LIMIT 1';
    pool.query(sqlBuscarUsuario, (err, resultados) => {
      if (err || resultados.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Nenhum usuário cadastrado! Faça um cadastro primeiro.' 
        });
      }
      
      const usuario_id_correto = resultados[0].id;
      salvarAgendamento(usuario_id_correto, profissional_id, servico, data, hora, valor, res);
    });
  } else {
    salvarAgendamento(usuario_id, profissional_id, servico, data, hora, valor, res);
  }
});

// Função auxiliar para salvar agendamento
function salvarAgendamento(usuario_id, profissional_id, servico, data, hora, valor, res) {
  if (!usuario_id || !profissional_id || !servico || !data || !hora || !valor) {
    return res.status(400).json({ 
      success: false,
      message: 'Preencha todos os campos do agendamento!' 
    });
  }

  const sql = `INSERT INTO agendamentos 
              (usuario_id, profissional_id, servico, data, hora, valor) 
              VALUES (?, ?, ?, ?, ?, ?)`;
  
  const valores = [usuario_id, profissional_id, servico, data, hora, valor];

  pool.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Erro no agendamento:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao realizar agendamento: ' + err.message 
      });
    }
    console.log('✅ Agendamento realizado com ID:', result.insertId);
    res.json({ 
      success: true,
      message: 'Agendamento realizado com sucesso!',
      agendamentoId: result.insertId
    });
  });
}

// HORÁRIOS OCUPADOS
app.get('/api/horarios-ocupados', (req, res) => {
  console.log('📅 Buscando horários ocupados para o calendário');
  
  const sql = `
    SELECT 
      CASE DAYOFWEEK(data)
        WHEN 2 THEN 'Segunda-feira'
        WHEN 3 THEN 'Terça-feira' 
        WHEN 4 THEN 'Quarta-feira'
        WHEN 5 THEN 'Quinta-feira'
        WHEN 6 THEN 'Sexta-feira'
        WHEN 7 THEN 'Sábado'
        ELSE 'Domingo'
      END as dia_semana,
      TIME_FORMAT(hora, '%H:%i') as hora
    FROM agendamentos 
    WHERE data >= CURDATE()
    AND data < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
  `;
  
  pool.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar horários ocupados:', err);
      return res.status(500).json({ success: false, message: 'Erro ao buscar horários' });
    }
    
    console.log(`✅ ${resultados.length} horários ocupados encontrados para a semana`);
    res.json({ 
      success: true,
      horariosOcupados: resultados
    });
  });
});

// PRIMEIRO USUÁRIO
app.get('/api/primeiro-usuario', (req, res) => {
  console.log('👤 Buscando primeiro usuário');
  const sql = 'SELECT id, nome_completo, email FROM usuarios ORDER BY id LIMIT 1';
  pool.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar usuário:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar usuário' 
      });
    }
    if (resultados.length === 0) {
      console.log('❌ Nenhum usuário cadastrado');
      return res.status(404).json({ 
        success: false, 
        message: 'Nenhum usuário cadastrado' 
      });
    }
    console.log('✅ Usuário encontrado:', resultados[0].nome_completo);
    res.json({ 
      success: true, 
      usuario: resultados[0] 
    });
  });
});

// SALVAR AVALIAÇÃO
app.post('/api/avaliacoes', (req, res) => {
  console.log('⭐ Tentativa de salvar avaliação recebida');
  const { nome, profissional, servico, data, nota, comentario } = req.body;

  if (!nome || !profissional || !servico || !data || !nota) {
    return res.status(400).json({ 
      success: false,
      message: 'Preencha todos os campos obrigatórios!' 
    });
  }

  const sql = `INSERT INTO avaliacoes 
              (nome_cliente, profissional, servico, data_atendimento, nota, comentario) 
              VALUES (?, ?, ?, ?, ?, ?)`;
  
  const valores = [nome, profissional, servico, data, parseInt(nota), comentario];

  pool.query(sql, valores, (err, result) => {
    if (err) {
      console.error('❌ Erro ao salvar avaliação:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao salvar avaliação: ' + err.message 
      });
    }
    console.log('✅ Avaliação salva com ID:', result.insertId);
    res.json({ 
      success: true,
      message: 'Avaliação salva com sucesso!',
      avaliacaoId: result.insertId
    });
  });
});

// VERIFICAR AGENDAMENTOS
app.get('/api/agendamentos', (req, res) => {
  console.log('📋 Listando agendamentos');
  const sql = `
    SELECT a.*, u.nome_completo as usuario_nome, p.nome as profissional_nome
    FROM agendamentos a
    LEFT JOIN usuarios u ON a.usuario_id = u.id
    LEFT JOIN profissionais p ON a.profissional_id = p.id
    ORDER BY a.data_criacao DESC
  `;
  pool.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar agendamentos:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar agendamentos' 
      });
    }
    res.json({ 
      success: true,
      agendamentos: resultados 
    });
  });
});

// BUSCAR AVALIAÇÕES
app.get('/api/avaliacoes', (req, res) => {
  console.log('⭐ Buscando avaliações');
  const sql = 'SELECT * FROM avaliacoes ORDER BY data_criacao DESC';
  pool.query(sql, (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar avaliações:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Erro ao buscar avaliações' 
      });
    }
    res.json({ 
      success: true,
      avaliacoes: resultados 
    });
  });
});

// API - Estatísticas do profissional
app.get('/api/estatisticas-profissional/:profissional_id', (req, res) => {
  const { profissional_id } = req.params;
  console.log(`📈 Buscando estatísticas do profissional ${profissional_id}`);
  
  const sqlAgendamentos = `
    SELECT COUNT(*) as total_agendamentos,
           SUM(CASE WHEN DATE(data) = CURDATE() THEN 1 ELSE 0 END) as agendamentos_hoje,
           SUM(valor) as total_receber
    FROM agendamentos 
    WHERE profissional_id = ? AND status = 'confirmado'
  `;
  
  pool.query(sqlAgendamentos, [profissional_id], (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar estatísticas:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar estatísticas' 
      });
    }
    
    const stats = resultados[0] || {};
    res.json({
      success: true,
      totalReceber: stats.total_receber || '0.00',
      totalRecebido: '0.00',
      agendamentosHoje: stats.agendamentos_hoje || 0,
      totalAgendamentos: stats.total_agendamentos || 0
    });
  });
});

// API - Agendamentos do profissional
app.get('/api/agendamentos-profissional/:profissional_id', (req, res) => {
  const { profissional_id } = req.params;
  console.log(`📅 Buscando agendamentos do profissional ${profissional_id}`);
  
  const sql = `
    SELECT a.*, u.nome_completo as cliente_nome, u.telefone as cliente_telefone
    FROM agendamentos a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.profissional_id = ?
    ORDER BY a.data, a.hora
  `;
  
  pool.query(sql, [profissional_id], (err, resultados) => {
    if (err) {
      console.error('❌ Erro ao buscar agendamentos:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar agendamentos' 
      });
    }
    
    console.log(`✅ ${resultados.length} agendamentos encontrados`);
    res.json({
      success: true,
      agendamentos: resultados
    });
  });
});

// Log de requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  next();
});

// Rota de fallback para páginas não encontradas
app.use((req, res) => {
  console.log('❌ Rota não encontrada:', req.path);
  res.status(404).send('Página não encontrada');
});

// ================== INICIALIZAÇÃO DO SERVIDOR ==================

// Função para obter o IP local automaticamente
function getLocalIP() {
    const interfaces = require('os').networkInterfaces();
    
    for (const interfaceName in interfaces) {
        for (const interface of interfaces[interfaceName]) {
            if (interface.family === 'IPv4' && 
                !interface.internal && 
                interface.address.startsWith('192.168.')) {
                return interface.address;
            }
        }
    }
    
    for (const interfaceName in interfaces) {
        for (const interface of interfaces[interfaceName]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    
    return 'localhost';
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    const localIP = getLocalIP();
    
    console.log('='.repeat(60));
    console.log('🚀 Servidor INICIADO com sucesso!');
    console.log('='.repeat(60));
    console.log(`📍 Acesse LOCALMENTE:  http://localhost:${PORT}`);
    console.log(`📍 Acesse pela REDE:   http://${localIP}:${PORT}`);
    console.log('='.repeat(60));
    console.log('💡 DICA: Use o IP acima para acessar de outros dispositivos');
    console.log('⏰ Iniciado em:', new Date().toLocaleString());
    console.log('='.repeat(60));
});