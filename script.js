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

/* ─── NAV SCROLL EFFECT + ACTIVE STATE ─── */
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 60
    ? 'rgba(209,254,23,0.12)'
    : 'rgba(255,255,255,0.05)';
}, { passive: true });

// Surligne le lien nav correspondant à la section visible
const sectionIds = ['formations', 'catalogues', 'intervenants', 'about', 'tarifs'];
const navLinkMap = {};
sectionIds.forEach(id => {
  const link = document.querySelector(`.nav__links a[href="#${id}"]`);
  if (link) navLinkMap[id] = link;
});

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Object.values(navLinkMap).forEach(l => l.classList.remove('active'));
      const id = entry.target.id;
      if (navLinkMap[id]) navLinkMap[id].classList.add('active');
    }
  });
}, { threshold: 0.35 });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) activeSectionObserver.observe(el);
});

/* ─── MOBILE CTA — masqué quand menu ouvert ─── */
const mobileCta = document.getElementById('mobileCta');

/* ─── MOBILE NAV ─── */
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (mobileCta) mobileCta.style.display = isOpen ? 'none' : '';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (mobileCta) mobileCta.style.display = '';
    });
  });
}

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
