// Dados de exemplo
let pedidos = [
    {
        id: 1,
        cliente: "João Silva",
        telefone: "(11) 99999-9999",
        endereco: "Rua A, 123",
        itens: [
            { nome: "X-Burger", quantidade: 2, preco: 15.00 },
            { nome: "Batata Frita", quantidade: 1, preco: 10.00 }
        ],
        total: 40.00,
        status: "aberto",
        data: "2024-03-13"
    },
    {
        id: 2,
        cliente: "Maria Santos",
        telefone: "(11) 98888-8888",
        endereco: "Rua B, 456",
        itens: [
            { nome: "Pizza Margherita", quantidade: 1, preco: 45.00 },
            { nome: "Refrigerante", quantidade: 2, preco: 8.00 }
        ],
        total: 61.00,
        status: "producao",
        data: "2024-03-13"
    }
];

// Função para formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para atualizar os resumos
function atualizarResumos() {
    const hoje = new Date().toISOString().split('T')[0];
    const pedidosHoje = pedidos.filter(p => p.data === hoje);
    
    const abertos = pedidosHoje.filter(p => p.status === 'aberto').length;
    const entregues = pedidosHoje.filter(p => p.status === 'finalizado').length;
    const ticketMedio = pedidosHoje.length > 0 
        ? pedidosHoje.reduce((acc, p) => acc + p.total, 0) / pedidosHoje.length 
        : 0;
    
    document.getElementById('resumoAbertos').textContent = abertos;
    document.getElementById('resumoEntregues').textContent = entregues;
    document.getElementById('resumoTicket').textContent = formatarMoeda(ticketMedio);
}

// Função para criar card de pedido
function criarCardPedido(pedido) {
    const card = document.createElement('div');
    card.className = `order-card status-${pedido.status}`;
    
    const data = new Date();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1" style="cursor: pointer;">
                <div class="order-header">
                    <span class="order-number">#${pedido.id}</span>
                    <span class="order-time">${hora}:${minutos}</span>
                </div>
                <div class="order-customer">${pedido.cliente}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">${pedido.itens.length} itens</small>
                    <span class="order-total">${formatarMoeda(pedido.total)}</span>
                </div>
            </div>
            ${pedido.status !== 'finalizado' ? `
                <button class="btn btn-sm btn-outline-primary ms-2" onclick="event.stopPropagation(); avancarStatus(${pedido.id})">
                    <i class="bi bi-arrow-right"></i>
                </button>
            ` : ''}
        </div>
    `;
    
    card.querySelector('.flex-grow-1').onclick = () => mostrarDetalhes(pedido);
    
    return card;
}

// Função para mostrar detalhes do pedido
function mostrarDetalhes(pedido) {
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhes'));
    const modalBody = document.getElementById('modalDetalhesBody');
    
    modalBody.innerHTML = `
        <div class="mb-3">
            <h6>Cliente</h6>
            <p class="mb-1">${pedido.cliente}</p>
            <p class="mb-1">${pedido.telefone}</p>
            <p class="mb-0">${pedido.endereco}</p>
        </div>
        <div class="mb-3">
            <h6>Itens</h6>
            <ul class="list-unstyled">
                ${pedido.itens.map(item => `
                    <li class="d-flex justify-content-between mb-2">
                        <span>${item.quantidade}x ${item.nome}</span>
                        <span>${formatarMoeda(item.preco * item.quantidade)}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="text-end">
            <h5>Total: ${formatarMoeda(pedido.total)}</h5>
        </div>
    `;
    
    modal.show();
}

// Função para avançar status do pedido
function avancarStatus(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    const statusOrder = ['aberto', 'producao', 'entrega', 'finalizado'];
    const currentIndex = statusOrder.indexOf(pedido.status);
    if (currentIndex < statusOrder.length - 1) {
        pedido.status = statusOrder[currentIndex + 1];
        atualizarListas();
        atualizarResumos();
    }
}

// Função para atualizar as listas de pedidos
function atualizarListas() {
    const listas = {
        'aberto': document.getElementById('listaAberto'),
        'producao': document.getElementById('listaProducao'),
        'entrega': document.getElementById('listaEntrega'),
        'finalizado': document.getElementById('listaFinalizado')
    };
    
    // Limpa todas as listas
    Object.values(listas).forEach(lista => lista.innerHTML = '');
    
    // Filtra pedidos por data
    const dataFiltro = document.getElementById('filtroData').value;
    const pedidosFiltrados = dataFiltro 
        ? pedidos.filter(p => p.data === dataFiltro)
        : pedidos;
    
    // Adiciona pedidos às listas
    pedidosFiltrados.forEach(pedido => {
        const card = criarCardPedido(pedido);
        listas[pedido.status].appendChild(card);
    });
}

// Função para adicionar novo pedido
function adicionarPedido() {
    const novoPedido = {
        id: pedidos.length + 1,
        cliente: "Novo Cliente",
        telefone: "(11) 99999-9999",
        endereco: "Rua Nova, 123",
        itens: [
            { nome: "X-Burger", quantidade: 1, preco: 15.00 }
        ],
        total: 15.00,
        status: "aberto",
        data: new Date().toISOString().split('T')[0]
    };
    
    pedidos.push(novoPedido);
    atualizarListas();
    atualizarResumos();
}

// Função para fazer login
function fazerLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('navbar').style.display = 'flex';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

// Função para fazer logout
function fazerLogout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configura data atual no filtro
    document.getElementById('filtroData').value = new Date().toISOString().split('T')[0];
    
    // Adiciona evento de mudança no filtro de data
    document.getElementById('filtroData').addEventListener('change', atualizarListas);
    
    // Adiciona evento de clique no botão de adicionar pedido
    document.getElementById('btnAdicionarPedido').addEventListener('click', adicionarPedido);
    
    // Adiciona evento de submit no formulário de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        fazerLogin();
    });
    
    // Adiciona evento de clique no botão de logout
    document.getElementById('btnLogout').addEventListener('click', fazerLogout);
    
    // Inicializa as listas e resumos
    atualizarListas();
    atualizarResumos();
}); 