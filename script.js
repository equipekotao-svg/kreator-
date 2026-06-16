/* ═══════════════════════════════════════════
   KREATORPLAY — main script
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
const sectionIds = ['formations', 'sessions', 'programme', 'formateurs', 'catalogues', 'tarifs', 'faq'];
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

/* ─── CATALOGUE TABS + SEARCH (système unifié) ─── */
(function () {
  const tabsContainer = document.querySelector('[data-tabs]');
  const keyword       = document.getElementById('searchKeyword');
  const filterT       = document.getElementById('filterThematique');
  const resetBtn      = document.getElementById('searchReset');
  const countEl       = document.getElementById('searchCount');
  if (!tabsContainer) return;

  const allCards  = [...tabsContainer.querySelectorAll('.cat-card')];
  const allPanels = [...tabsContainer.querySelectorAll('.tab-panel')];
  const allTabs   = [...tabsContainer.querySelectorAll('.tab-btn')];
  const total     = allCards.length;
  if (countEl) countEl.textContent = `${total} modules disponibles`;

  // Unique source de vérité pour l'onglet actif
  function activateTab(domain) {
    allTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === domain));
    allPanels.forEach(p => {
      p.classList.toggle('active', p.dataset.panel === domain);
      p.style.display = '';
    });
    if (filterT) filterT.value = domain || '';
  }

  function applyFilters() {
    const kw     = keyword ? keyword.value.toLowerCase().trim() : '';
    const domain = filterT ? filterT.value : '';

    if (!kw) {
      // Sans mot-clé : vue par onglet normal
      allPanels.forEach(p => p.style.display = '');
      allCards.forEach(c => c.style.display = '');
      // Re-sync visuel de l'onglet actif (peut avoir été effacé par une recherche)
      if (domain) {
        allTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === domain));
        allPanels.forEach(p => p.classList.toggle('active', p.dataset.panel === domain));
      }
      const count = domain
        ? allCards.filter(c => c.closest('.tab-panel')?.dataset.panel === domain).length
        : total;
      if (countEl) countEl.textContent = domain
        ? `${count} module${count > 1 ? 's' : ''}`
        : `${total} modules disponibles`;
      if (filterT) filterT.classList.toggle('active', !!domain);
      return;
    }

    // Avec mot-clé : mode recherche cross-domaine (ou restreint au domaine actif)
    allPanels.forEach(p => p.style.display = 'block');
    if (!domain) allTabs.forEach(b => b.classList.remove('active'));

    let visible = 0;
    allCards.forEach(card => {
      const cardDomain   = card.closest('.tab-panel')?.dataset.panel;
      const title        = card.querySelector('.cat-card__title')?.textContent.toLowerCase() || '';
      const desc         = card.querySelector('.cat-card__desc')?.textContent.toLowerCase()  || '';
      const matchesKw    = title.includes(kw) || desc.includes(kw);
      const matchesDomain = !domain || cardDomain === domain;
      const show = matchesKw && matchesDomain;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Masquer les panneaux sans résultats
    allPanels.forEach(panel => {
      const hasVisible = [...panel.querySelectorAll('.cat-card')].some(c => c.style.display !== 'none');
      panel.style.display = hasVisible ? 'block' : 'none';
    });

    if (countEl) countEl.textContent = `${visible} module${visible > 1 ? 's' : ''}`;
    if (filterT) filterT.classList.toggle('active', !!domain);
  }

  // Clic sur un onglet → sync dropdown + re-filtrage si recherche active
  allTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
      if (keyword && keyword.value.trim()) applyFilters();
    });
  });

  // Changement dropdown → sync onglet + re-filtrage
  if (filterT) {
    filterT.addEventListener('change', () => {
      if (filterT.value) activateTab(filterT.value);
      applyFilters();
    });
  }

  if (keyword) keyword.addEventListener('input', applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (keyword) keyword.value = '';
      if (filterT)  { filterT.value = ''; filterT.classList.remove('active'); }
      allPanels.forEach(p => p.style.display = '');
      allCards.forEach(c => c.style.display = '');
      // Restaurer l'onglet par défaut si aucun n'est actif
      if (!tabsContainer.querySelector('.tab-btn.active')) activateTab('video');
      if (countEl) countEl.textContent = `${total} modules disponibles`;
    });
  }
})();
