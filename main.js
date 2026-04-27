/* ============================================================
   DISK CONCEPT — main.js
   1. Carrossel (drag + botões + touch)
   2. Reveal on scroll
   ============================================================ */

// ── 1. CARROSSEL ──────────────────────────────────────────────
const carousel = document.getElementById('mainCarousel');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

let drag = { active: false, startX: 0, scrollLeft: 0, moved: false };

function dragStart(x) {
  drag.active     = true;
  drag.moved      = false;
  drag.startX     = x;
  drag.scrollLeft = carousel.scrollLeft;
  carousel.classList.add('is-dragging');
}

function dragMove(x) {
  if (!drag.active) return;
  const diff = drag.startX - x;
  if (Math.abs(diff) > 5) drag.moved = true;
  carousel.scrollLeft = drag.scrollLeft + diff;
}

function dragEnd() {
  drag.active = false;
  carousel.classList.remove('is-dragging');
  // Snap manual ao item mais próximo
  const itemW = carousel.querySelector('.carousel-item')?.offsetWidth || 0;
  if (itemW) {
    const idx = Math.round(carousel.scrollLeft / itemW);
    carousel.scrollTo({ left: idx * itemW, behavior: 'smooth' });
  }
}

// Mouse
carousel.addEventListener('mousedown',  e => { dragStart(e.clientX); e.preventDefault(); });
window.addEventListener('mousemove',    e => dragMove(e.clientX));
window.addEventListener('mouseup',      () => dragEnd());

// Touch
carousel.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), { passive: true });
carousel.addEventListener('touchmove',  e => dragMove(e.touches[0].clientX),  { passive: true });
carousel.addEventListener('touchend',   () => dragEnd());

// Botões
const slideBy = dir => {
  const itemW = carousel.querySelector('.carousel-item')?.offsetWidth || 0;
  const cur   = Math.round(carousel.scrollLeft / itemW);
  carousel.scrollTo({ left: (cur + dir) * itemW, behavior: 'smooth' });
};

prevBtn.addEventListener('click', () => slideBy(-1));
nextBtn.addEventListener('click', () => slideBy(1));