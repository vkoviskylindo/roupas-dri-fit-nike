// Menu Mobile
const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('.nav ul');

hamburger.addEventListener('click', () => {
  navUl.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Carrossel de Produtos
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.product-card');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;
const cardWidth = cards[0].offsetWidth + 20; // largura + margem

nextBtn.addEventListener('click', () => {
  if (index < cards.length - 3) {
    index++;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});

prevBtn.addEventListener('click', () => {
  if (index > 0) {
    index--;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }
});

// Formulário de Contato (Simulação)
const form = document.getElementById('contact-form');
const message = document.querySelector('.form-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  message.textContent = 'Mensagem enviada com sucesso!';
  message.style.color = '#28a745';
  form.reset();
  setTimeout(() => {
    message.textContent = '';
  }, 3000);
});

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});