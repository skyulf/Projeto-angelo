// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Camisa Regata Preto",
        price: 65.99,
        image: "/static/img/camisa1.png",
        description: "Camisa premium regata"
    },
    {
        id: 2,
        name: "Camisa Roxa Premium",
        price: 79.99,
        image: "/static/img/bg_roxo.png",
        description: "Camisa roxa em tecido de alta qualidade"
    },
    {
        id: 3,
        name: "Camisa Astronomical",
        price: 110.00,
        image: "/static/img/camisa2.png",
        description: "Camisa astronomical para looks modernos"
    },
    {
        id: 4,
        name: "Camisa Cool",
        price: 75.00,
        image: "/static/img/camisa3.png",
        description: "Camisa casual para o dia a dia"
    }
];

// Carrinho de compras
let cart = [];
let cartTotal = 0;

// Elementos DOM
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');
const checkoutForm = document.getElementById('checkoutForm');
const paymentSuccess = document.getElementById('paymentSuccess');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentForm = document.getElementById('paymentForm');
const orderSummary = document.getElementById('orderSummary');
const continueBtn = document.getElementById('continueBtn');

// Inicializar produtos
function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Atualizar quantidade
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Atualizar carrinho
function updateCart() {
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar itens do carrinho
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Seu carrinho está vazio</p></div>';
        cartTotal = 0;
    } else {
        cartTotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Atualizar total
    cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2)}`;
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(to right, #ffd700, #ffed4e);
        color: #1a0b2e;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1001;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: fadeInOut 3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Adicione itens ao carrinho antes de finalizar!');
        return;
    }
    cartSidebar.classList.remove('active');
    checkoutForm.classList.add('active');
    window.scrollTo({ top: document.getElementById('checkoutForm').offsetTop, behavior: 'smooth' });
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simular processamento do pagamento
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Gerar resumo do pedido
    let summaryHTML = `
        <div class="summary-item">
            <span>Cliente:</span>
            <span>${name}</span>
        </div>
        <div class="summary-item">
            <span>Endereço:</span>
            <span>${address}</span>
        </div>
        <div class="summary-item">
            <span>Telefone:</span>
            <span>${phone}</span>
        </div>
        <div class="summary-item">
            <span>Forma de Pagamento:</span>
            <span>${getPaymentMethodName(paymentMethod)}</span>
        </div>
        <hr style="margin: 15px 0; border-color: rgba(255,255,255,0.1)">
    `;
    
    cart.forEach(item => {
        summaryHTML += `
            <div class="summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    summaryHTML += `
        <div class="summary-item total">
            <span>Total:</span>
            <span>R$ ${cartTotal.toFixed(2)}</span>
        </div>
    `;
    
    orderSummary.innerHTML = summaryHTML;
    
    // Mostrar tela de sucesso
    checkoutForm.classList.remove('active');
    paymentSuccess.classList.add('active');
    
    // Simular tempo de processamento
    setTimeout(() => {
        cart = [];
        updateCart();
    }, 3000);
});

continueBtn.addEventListener('click', () => {
    paymentSuccess.classList.remove('active');
    checkoutForm.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Função auxiliar
function getPaymentMethodName(method) {
    switch(method) {
        case 'credit': return 'Cartão de Crédito';
        case 'debit': return 'Cartão de Débito';
        case 'pix': return 'PIX';
        default: return 'Não especificado';
    }
}

// Fechar carrinho ao clicar fora
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
        cartSidebar.classList.remove('active');
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCart();
});