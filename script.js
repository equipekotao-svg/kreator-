/* ═══════════════════════════════════════════
   KOTAO ACADEMY — main script
   ═══════════════════════════════════════════ */

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal],[data-reveal-left],[data-reveal-right],[data-clip]')
  .forEach(el => revealObserver.observe(el));

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── NAV SCROLL EFFECT ─── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 60
    ? 'rgba(209,254,23,0.12)'
    : 'rgba(255,255,255,0.05)';
}, { passive: true });

/* ─── CATALOGUE TABS ─── */
document.querySelectorAll('[data-tabs]').forEach(container => {
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      container.querySelector(`.tab-panel[data-panel="${target}"]`).classList.add('active');
    });
  });
});
