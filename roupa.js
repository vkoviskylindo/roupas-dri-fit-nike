// === CARRINHO ===
let cart = JSON.parse(localStorage.getItem('nikeCart')) || [];

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelector('.cart-count').textContent = total;
}

// Adicionar ao carrinho
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const product = {
      id: Date.now() + Math.random(),
      name: card.dataset.name,
      price: parseFloat(card.dataset.price),
      qty: 1
    };

    const exists = cart.find(p => p.name === product.name);
    if (exists) exists.qty++;
    else cart.push(product);

    localStorage.setItem('nikeCart', JSON.stringify(cart));
    updateCartCount();

    btn.textContent = 'Adicionado!';
    btn.style.background = '#00ff88';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.textContent = 'Adicionar';
      btn.style.background = '#000';
      btn.style.color = 'white';
    }, 1000);
  });
});

// === MODAL ===
function openCheckout() {
  document.getElementById('checkout-modal').style.display = 'flex';
  renderCart();
}
function closeCheckout() {
  document.getElementById('checkout-modal').style.display = 'none';
}

function renderCart() {
  const items = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    items.innerHTML = '<p style="text-align:center">Carrinho vazio</p>';
    totalEl.textContent = '0,00';
    return;
  }

  items.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.qty} × R$ ${item.price.toFixed(2)}</small>
      </div>
      <button onclick="removeItem(${item.id})" style="background:none;border:none;color:red;font-weight:bold;">✖</button>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = total.toFixed(2).replace('.', ',');
}

window.removeItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  localStorage.setItem('nikeCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
};

// === PAGSEGURO ===
document.getElementById('pay-btn').addEventListener('click', async () => {
  if (cart.length === 0) return alert('Adicione itens ao carrinho!');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  try {
    const hash = await PagSeguro.directPayment.getSenderHash();
    
    PagSeguro.directPayment.checkout({
      sender: {
        email: 'seuemail@exemplo.com', // <<<<< MUDE AQUI <<<<<
        hash: hash
      },
      transaction: {
        amount: total.toFixed(2),
        items: cart.map(i => ({
          id: i.id,
          description: i.name,
          quantity: i.qty,
          amount: i.price.toFixed(2)
        })),
        shipping: { cost: '0.00' },
        reference: 'PEDIDO_' + Date.now()
      },
      onSuccess: function(res) {
        alert('Pagamento aprovado! Código: ' + res.transactionCode);
        const msg = encodeURIComponent(
          `*Novo Pedido!*\n\n` +
          cart.map(i => `${i.qty}x ${i.name} - R$${(i.price*i.qty).toFixed(2)}`).join('\n') +
          `\n\n*Total:* R$${total.toFixed(2)}\nCódigo: ${res.transactionCode}`
        );
        window.open(`https://wa.me/5511999999999?text=${msg}`);
        cart = [];
        localStorage.removeItem('nikeCart');
        updateCartCount();
        closeCheckout();
      },
      onError: function(err) {
        alert('Erro no pagamento. Tente novamente.');
        console.error(err);
      }
    });
  } catch (err) {
    alert('Erro ao iniciar pagamento.');
  }
});

// === OUTROS ===
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav ul');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navUl.classList.toggle('active');
});

document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  document.querySelector('.form-message').innerHTML = '<p style="color:#00ff88">Enviado!</p>';
  e.target.reset();
});

updateCartCount();
