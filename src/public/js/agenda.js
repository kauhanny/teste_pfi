document.addEventListener("DOMContentLoaded", () => {
  const servicoInput = document.getElementById("servico");
  const valorServico = document.getElementById("valorServico");
  const pixContainer = document.getElementById("pixContainer");
  const msgPagamento = document.getElementById("msgPagamento");
  const btnAgendar = document.getElementById("btnAgendar");
  const btnPix = document.getElementById("btnPix");
  const pixModal = document.getElementById("pixModal");
  const btnConfirmarPix = document.getElementById("btnConfirmarPix");
  const profissionalSelect = document.getElementById("profissional");
  const dataInput = document.getElementById("data");
  const horaInput = document.getElementById("hora");

  // Lista de serviços e valores
  const servicosValores = {
    "Corte": 80.00,
    "Pintura": 150.00,
    "Manicure": 50.00,
    "Pedicure": 45.00
  };

  // Mapeamento de profissionais
  const profissionaisMap = {
    "Maria Silva": 1,
    "Maria Souza": 2, 
    "Ana Costa": 3,
    "Joana Lima": 4
  };

  // Atualiza valor conforme o serviço
  servicoInput.addEventListener("input", () => {
    const nome = servicoInput.value.trim();
    const valor = servicosValores[nome];
    if (valor) {
      valorServico.innerHTML = `<strong>Valor:</strong> R$ ${valor.toFixed(2)}`;
      pixContainer.style.display = "block";
    } else {
      valorServico.innerHTML = `<strong>Valor:</strong> R$ 0,00`;
      pixContainer.style.display = "none";
      msgPagamento.style.display = "none";
      btnAgendar.disabled = true;
    }
  });

  // Abrir modal PIX
  btnPix.addEventListener("click", () => {
    pixModal.style.display = "flex";
  });

  // Confirmar pagamento PIX
  btnConfirmarPix.addEventListener("click", () => {
    pixModal.style.display = "none";
    msgPagamento.style.display = "block";
    btnAgendar.disabled = false;
  });

  // Fechar modal clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === pixModal) {
      pixModal.style.display = "none";
    }
  });

  // AGENDAMENTO - VERSÃO CORRIGIDA
  document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
    e.preventDefault();

    const profissional = profissionalSelect.value;
    const servico = servicoInput.value.trim();
    const data = dataInput.value;
    const hora = horaInput.value;
    const valor = servicosValores[servico];

    // Validações básicas
    if (!profissional || !servico || !data || !hora) {
      alert('❌ Preencha todos os campos!');
      return;
    }

    if (!valor) {
      alert('❌ Selecione um serviço válido!');
      return;
    }

    try {
      // Loading
      btnAgendar.innerHTML = 'Agendando...';
      btnAgendar.disabled = true;

      const profissional_id = profissionaisMap[profissional];

      // Faz o agendamento DIRETO - o servidor vai buscar o usuário automaticamente
      const resposta = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          profissional_id, 
          servico: servico,
          data: data,
          hora: hora,
          valor: valor
          // Não envia usuario_id - o servidor busca automaticamente
        })
      });

      const dados = await resposta.json();

      if (dados.success) {
        alert('✅ Agendamento salvo no banco com sucesso! ID: ' + dados.agendamentoId);
        
        // Limpa o formulário
        document.getElementById("formAgendamento").reset();
        valorServico.innerHTML = `<strong>Valor:</strong> R$ 0,00`;
        pixContainer.style.display = "none";
        msgPagamento.style.display = "none";
        
        console.log('📅 Agendamento salvo no banco:', dados);
      } else {
        alert('❌ Erro: ' + dados.message);
      }

    } catch (erro) {
      console.error("Erro completo:", erro);
      alert("🔴 Erro ao conectar com o servidor! Verifique o console.");
    } finally {
      // Restaura botão
      btnAgendar.innerHTML = 'Agendar';
      btnAgendar.disabled = false;
    }
  });
});




