document.addEventListener("DOMContentLoaded", () => {
    console.log("📅 Página Minha Agenda carregada!");
    
    // Elementos da página
    const agendamentosList = document.getElementById('agendamentos-list');
    const noAgendamentos = document.getElementById('no-agendamentos');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Estatísticas
    const totalAgendamentos = document.getElementById('total-agendamentos');
    const proximosAgendamentos = document.getElementById('proximos-agendamentos');
    const realizadosAgendamentos = document.getElementById('realizados-agendamentos');

    let todosAgendamentos = [];
    let filtroAtual = 'all';

    // Carregar agendamentos
    carregarAgendamentos();

    // Configurar filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona active no clicado
            btn.classList.add('active');
            
            filtroAtual = btn.dataset.filter;
            filtrarAgendamentos();
        });
    });

    async function carregarAgendamentos() {
        try {
            console.log('🔄 Carregando agendamentos...');
            
            // Simulação de dados - depois substitua pela API real
            const agendamentosMock = [
                {
                    id: 1,
                    servico: "Corte e Escova",
                    profissional: "Ana Silva",
                    data: "2024-11-20",
                    hora: "14:00",
                    valor: 80.00,
                    status: "pending",
                    duracao: "1h30min"
                },
                {
                    id: 2,
                    servico: "Coloração Completa",
                    profissional: "Maria Santos",
                    data: "2024-11-15",
                    hora: "10:00",
                    valor: 120.00,
                    status: "completed",
                    duracao: "2h30min"
                },
                {
                    id: 3,
                    servico: "Manicure e Pedicure",
                    profissional: "Carla Oliveira",
                    data: "2024-11-10",
                    hora: "16:00",
                    valor: 60.00,
                    status: "completed",
                    duracao: "1h"
                }
            ];

            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            todosAgendamentos = agendamentosMock;
            atualizarEstatisticas();
            filtrarAgendamentos();
            
        } catch (error) {
            console.error('❌ Erro ao carregar agendamentos:', error);
            agendamentosList.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Erro ao carregar agendamentos</h3>
                    <p>Tente recarregar a página</p>
                    <button onclick="carregarAgendamentos()" class="btn-primary">🔄 Tentar Novamente</button>
                </div>
            `;
        }
    }

    function atualizarEstatisticas() {
        const total = todosAgendamentos.length;
        const proximos = todosAgendamentos.filter(a => a.status === 'pending').length;
        const realizados = todosAgendamentos.filter(a => a.status === 'completed').length;

        totalAgendamentos.textContent = total;
        proximosAgendamentos.textContent = proximos;
        realizadosAgendamentos.textContent = realizados;
    }

    function filtrarAgendamentos() {
        let agendamentosFiltrados = todosAgendamentos;

        if (filtroAtual !== 'all') {
            agendamentosFiltrados = todosAgendamentos.filter(a => a.status === filtroAtual);
        }

        exibirAgendamentos(agendamentosFiltrados);
    }

    function exibirAgendamentos(agendamentos) {
        if (agendamentos.length === 0) {
            agendamentosList.style.display = 'none';
            noAgendamentos.style.display = 'block';
            return;
        }

        noAgendamentos.style.display = 'none';
        agendamentosList.style.display = 'block';

        agendamentosList.innerHTML = agendamentos.map(agendamento => `
            <div class="agendamento-card" data-status="${agendamento.status}">
                <div class="agendamento-header">
                    <div class="agendamento-servico">${agendamento.servico}</div>
                    <div class="agendamento-status status-${agendamento.status}">
                        ${getStatusText(agendamento.status)}
                    </div>
                </div>
                
                <div class="agendamento-details">
                    <div class="detail-item">
                        <span class="detail-label">👩‍💼 Profissional</span>
                        <span class="detail-value">${agendamento.profissional}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">📅 Data</span>
                        <span class="detail-value">${formatarData(agendamento.data)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">⏰ Horário</span>
                        <span class="detail-value">${agendamento.hora}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">⏱️ Duração</span>
                        <span class="detail-value">${agendamento.duracao}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">💰 Valor</span>
                        <span class="detail-value">R$ ${agendamento.valor.toFixed(2)}</span>
                    </div>
                </div>

                ${agendamento.status === 'pending' ? `
                <div class="agendamento-actions">
                    <button class="btn btn-cancel" onclick="cancelarAgendamento(${agendamento.id})">
                        ❌ Cancelar
                    </button>
                    <button class="btn btn-reschedule" onclick="reagendar(${agendamento.id})">
                        🔄 Reagendar
                    </button>
                </div>
                ` : ''}
            </div>
        `).join('');
    }

    function getStatusText(status) {
        const statusMap = {
            'pending': 'Agendado',
            'completed': 'Realizado',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    function formatarData(dataString) {
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR');
    }

    // Funções globais para os botões
    window.cancelarAgendamento = function(id) {
        if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
            console.log(`Cancelando agendamento ${id}`);
            alert('Agendamento cancelado com sucesso!');
            carregarAgendamentos(); // Recarrega a lista
        }
    };

    window.reagendar = function(id) {
        console.log(`Reagendando ${id}`);
        window.location.href = '/agenda';
    };
});