document.addEventListener("DOMContentLoaded", () => {
    console.log("📊 Agenda Profissional carregada!");
    
    // Verificar se é profissional
    verificarAcessoProfissional();
    
    // Carregar dados
    carregarEstatisticas();
    carregarCalendarioSemanal();
    carregarAgendamentos();
    carregarProximosAgendamentos();
});

// Verificar acesso profissional
function verificarAcessoProfissional() {
    const profissional = JSON.parse(localStorage.getItem('profissional') || 'null');
    
    if (!profissional || !profissional.cadastroCompleto) {
        alert('❌ Acesso restrito a profissionais cadastrados!');
        window.location.href = '/perfilprofissional';
        return;
    }
}

// Carregar estatísticas
async function carregarEstatisticas() {
    try {
        // Buscar dados do banco
        const response = await fetch('/api/estatisticas-profissional');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalReceber').textContent = `R$ ${data.totalReceber}`;
            document.getElementById('totalRecebido').textContent = `R$ ${data.totalRecebido}`;
            document.getElementById('agendamentosHoje').textContent = data.agendamentosHoje;
        } else {
            // Dados de demonstração
            document.getElementById('totalReceber').textContent = 'R$ 850,00';
            document.getElementById('totalRecebido').textContent = 'R$ 320,00';
            document.getElementById('agendamentosHoje').textContent = '3';
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        // Dados de fallback
        document.getElementById('totalReceber').textContent = 'R$ 0,00';
        document.getElementById('totalRecebido').textContent = 'R$ 0,00';
        document.getElementById('agendamentosHoje').textContent = '0';
    }
}

// Carregar calendário semanal
function carregarCalendarioSemanal() {
    const calendario = document.getElementById('calendarioSemanal');
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    const hoje = new Date();
    const semana = [];
    
    // Gerar próxima semana
    for (let i = 0; i < 7; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        semana.push(data);
    }
    
    const html = semana.map((data, index) => {
        const diaNome = diasSemana[data.getDay()];
        const diaNumero = data.getDate();
        const isHoje = index === 0;
        
        // Simular horários ocupados (em produção viria do banco)
        const horariosOcupados = Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0;
        const isOcupado = horariosOcupados > 0;
        
        return `
            <div class="dia-semana ${isHoje ? 'hoje' : ''} ${isOcupado ? 'ocupado' : 'disponivel'}">
                <div class="dia-nome">${diaNome}</div>
                <div class="dia-numero">${diaNumero}</div>
                <div class="dia-status">
                    ${isOcupado ? '🔴 ' + horariosOcupados + ' ocupado(s)' : '🟢 Disponível'}
                </div>
            </div>
        `;
    }).join('');
    
    calendario.innerHTML = html;
}

// Carregar agendamentos
async function carregarAgendamentos() {
    try {
        const response = await fetch('/api/agendamentos-profissional');
        const data = await response.json();
        
        const lista = document.getElementById('agendamentosLista');
        
        if (data.success && data.agendamentos.length > 0) {
            const html = data.agendamentos.map(agendamento => `
                <div class="agendamento-item">
                    <div class="agendamento-info">
                        <h4>${agendamento.servico}</h4>
                        <p><strong>Cliente:</strong> ${agendamento.cliente}</p>
                        <p><strong>Data:</strong> ${formatarData(agendamento.data)} às ${agendamento.hora}</p>
                        <p><strong>Duração:</strong> ${agendamento.duracao}min</p>
                    </div>
                    <div class="agendamento-direita">
                        <div class="agendamento-valor">R$ ${agendamento.valor}</div>
                        <div class="agendamento-status status-${agendamento.status}">
                            ${agendamento.status === 'confirmado' ? '✅ Confirmado' : 
                              agendamento.status === 'pendente' ? '⏳ Pendente' : '❌ Cancelado'}
                        </div>
                    </div>
                </div>
            `).join('');
            
            lista.innerHTML = html;
        } else {
            // Dados de demonstração
            lista.innerHTML = `
                <div class="agendamento-item">
                    <div class="agendamento-info">
                        <h4>Corte e Escova</h4>
                        <p><strong>Cliente:</strong> Maria Silva</p>
                        <p><strong>Data:</strong> ${formatarData(new Date())} às 14:00</p>
                        <p><strong>Duração:</strong> 60min</p>
                    </div>
                    <div class="agendamento-direita">
                        <div class="agendamento-valor">R$ 80,00</div>
                        <div class="agendamento-status status-confirmado">
                            ✅ Confirmado
                        </div>
                    </div>
                </div>
                <div class="agendamento-item">
                    <div class="agendamento-info">
                        <h4>Manicure Completa</h4>
                        <p><strong>Cliente:</strong> Ana Santos</p>
                        <p><strong>Data:</strong> ${formatarData(new Date())} às 16:30</p>
                        <p><strong>Duração:</strong> 45min</p>
                    </div>
                    <div class="agendamento-direita">
                        <div class="agendamento-valor">R$ 45,00</div>
                        <div class="agendamento-status status-confirmado">
                            ✅ Confirmado
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Carregar próximos agendamentos
function carregarProximosAgendamentos() {
    const container = document.getElementById('proximosAgendamentos');
    
    // Dados de demonstração
    const proximos = [
        { servico: 'Coloração', cliente: 'Carla Oliveira', hora: '10:00', valor: '120,00' },
        { servico: 'Pedicure', cliente: 'Juliana Costa', hora: '11:30', valor: '35,00' },
        { servico: 'Corte Masculino', cliente: 'Roberto Silva', hora: '15:00', valor: '40,00' }
    ];
    
    const html = proximos.map(agendamento => `
        <div class="proximo-agendamento">
            <div class="proximo-info">
                <h4>${agendamento.servico}</h4>
                <p>${agendamento.cliente}</p>
                <p>R$ ${agendamento.valor}</p>
            </div>
            <div class="proximo-horario">${agendamento.hora}</div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Função auxiliar para formatar data
function formatarData(data) {
    return data.toLocaleDateString('pt-BR');
}