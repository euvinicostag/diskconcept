/* ============================================================
   DISK CONCEPT — main.js
   1. Carrossel (drag + botões)
   2. Reveal on scroll
   ============================================================ */

// ── 1. CARROSSEL ──────────────────────────────────────────────
const carousel = document.getElementById('mainCarousel');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

// Drag / swipe
let isDown = false, startX = 0, scrollLeft = 0;

carousel.addEventListener('mousedown', e => {
  isDown = true;
  carousel.classList.add('active');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active'); });
carousel.addEventListener('mouseup',    () => { isDown = false; carousel.classList.remove('active'); });

carousel.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x    = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.8;
  carousel.scrollLeft = scrollLeft - walk;
});

// Touch
carousel.addEventListener('touchstart', e => {
  startX     = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
}, { passive: true });

carousel.addEventListener('touchmove', e => {
  const x    = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.8;
  carousel.scrollLeft = scrollLeft - walk;
}, { passive: true });

// Botões
const itemWidth = () => {
  const first = carousel.querySelector('.carousel-item');
  return first ? first.offsetWidth + 12 : 300; // 12 = gap
};

prevBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: -itemWidth(), behavior: 'smooth' });
});

nextBtn.addEventListener('click', () => {
  carousel.scrollBy({ left: itemWidth(), behavior: 'smooth' });
});

// ── 2. REVEAL ON SCROLL ───────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // pequeno delay em cascata para elementos irmãos
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));