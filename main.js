/* ============================================================
   DISK CONCEPT — main.js
   1. Carrossel (drag + botões + touch)
   2. Reveal on scroll
   ============================================================ */

// ── 1. CARROSSEL ──────────────────────────────────────────────
const carousel = document.getElementById('mainCarousel');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

let isDown   = false;
let startX   = 0;
let scrollLeft = 0;
let moved    = false; // distingue drag de clique

// Mouse
carousel.addEventListener('mousedown', e => {
  isDown = true;
  moved  = false;
  carousel.classList.add('active');
  startX     = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
  e.preventDefault();
});

window.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('active');
});

window.addEventListener('mousemove', e => {
  if (!isDown) return;
  const x    = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.8;
  if (Math.abs(walk) > 4) moved = true;
  carousel.scrollLeft = scrollLeft - walk;
});

// Impede clique em links/imagens após drag
carousel.addEventListener('click', e => {
  if (moved) e.preventDefault();
}, true);

// Touch
let touchStartX = 0, touchScrollLeft = 0;

carousel.addEventListener('touchstart', e => {
  touchStartX    = e.touches[0].pageX;
  touchScrollLeft = carousel.scrollLeft;
}, { passive: true });

carousel.addEventListener('touchmove', e => {
  const dx = touchStartX - e.touches[0].pageX;
  carousel.scrollLeft = touchScrollLeft + dx;
}, { passive: true });

// Botões
const itemWidth = () => {
  const first = carousel.querySelector('.carousel-item');
  return first ? first.offsetWidth + 12 : 300;
};

prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -itemWidth(), behavior: 'smooth' }));
nextBtn.addEventListener('click', () => carousel.scrollBy({ left:  itemWidth(), behavior: 'smooth' }));

// ── 2. REVEAL ON SCROLL ───────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

// O wrapper do slider de marcas NÃO deve ter reveal interferindo —
// ele já tem opacity/transform forçados no CSS, mas removemos a classe aqui também.
const brandsWrapper = document.querySelector('.brands-track-wrapper');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Se for o wrapper das marcas, apenas torna visível sem transform
    if (el === brandsWrapper) {
      el.style.opacity  = '1';
      el.style.transform = 'none';
      observer.unobserve(el);
      return;
    }

    const siblings = [...el.parentElement.querySelectorAll('.reveal:not(.visible)')];
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 80);
    observer.unobserve(el);
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));