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
const sectionIds = ['formations', 'programme', 'formateurs', 'sessions', 'tarifs', 'faq'];
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

/* ─── SEARCH BAR ─── */
(function () {
  const keyword  = document.getElementById('searchKeyword');
  const filterT  = document.getElementById('filterThematique');
  const filterF  = document.getElementById('filterFormat');
  const filterB  = document.getElementById('filterBudget');
  const resetBtn = document.getElementById('searchReset');
  const countEl  = document.getElementById('searchCount');
  if (!keyword) return;

  // Données des formations pour le filtre Format/Budget
  const formationMeta = {
    mobile:  { format: 'studio',  budget: 'fixe' },
    creator: { format: 'terrain', budget: 'devis' },
  };

  function switchTab(value) {
    if (!value) return;
    const btn = document.querySelector(`.tab-btn[data-tab="${value}"]`);
    if (btn) btn.click();
  }

  function filterCatCards() {
    const kw = keyword.value.toLowerCase().trim();
    const panels = document.querySelectorAll('.tab-panel.active .cat-card');
    let visible = 0;
    panels.forEach(card => {
      const title = card.querySelector('.cat-card__title')?.textContent.toLowerCase() || '';
      const desc  = card.querySelector('.cat-card__desc')?.textContent.toLowerCase()  || '';
      const match = !kw || title.includes(kw) || desc.includes(kw);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    return visible;
  }

  function filterFormationCards() {
    const fmt    = filterF.value;
    const budget = filterB.value;
    let visible  = 0;
    document.querySelectorAll('#formations .card').forEach(card => {
      const anchor = card.querySelector('a[href*="formation="]');
      if (!anchor) return;
      const id   = new URL(anchor.href, location.href).searchParams.get('formation') || '';
      const meta = formationMeta[id] || {};
      const matchFmt    = !fmt    || meta.format === fmt;
      const matchBudget = !budget || meta.budget === budget;
      card.style.display = (matchFmt && matchBudget) ? '' : 'none';
      if (matchFmt && matchBudget) visible++;
    });
    return visible;
  }

  function updateCount() {
    const thematique = filterT.value;
    let total = 0;

    // Si on filtre par thématique → on est dans le catalogue
    if (thematique) {
      const panels = document.querySelectorAll(`.tab-panel[data-panel="${thematique}"] .cat-card`);
      total = panels.length;
      countEl.innerHTML = `<span>${total}</span> module${total > 1 ? 's' : ''}`;
    } else if (filterF.value || filterB.value) {
      // Filtre format/budget sur les formations
      total = filterFormationCards();
      countEl.innerHTML = `<span>${total}</span> formation${total > 1 ? 's' : ''}`;
    } else {
      // Recherche par mots-clés dans l'onglet actif
      total = filterCatCards();
      const kw = keyword.value.trim();
      countEl.innerHTML = kw
        ? `<span>${total}</span> résultat${total > 1 ? 's' : ''}`
        : '<span>2</span> formations disponibles';
    }

    // Highlight les selects actifs
    [filterT, filterF, filterB].forEach(sel => {
      sel.classList.toggle('active', !!sel.value);
    });
  }

  // Thématique → switche l'onglet du catalogue et scroll vers lui
  filterT.addEventListener('change', () => {
    const val = filterT.value;
    if (val) {
      document.getElementById('catalogues')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => switchTab(val), 400);
    }
    updateCount();
  });

  // Format / Budget → filtre les cartes de formation
  filterF.addEventListener('change', () => {
    if (filterF.value || filterB.value) {
      document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      filterFormationCards();
    } else {
      document.querySelectorAll('#formations .card').forEach(c => c.style.display = '');
    }
    updateCount();
  });

  filterB.addEventListener('change', () => {
    if (filterF.value || filterB.value) {
      document.getElementById('formations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      filterFormationCards();
    } else {
      document.querySelectorAll('#formations .card').forEach(c => c.style.display = '');
    }
    updateCount();
  });

  // Recherche par mots-clés → filtre les cat-cards de l'onglet actif
  keyword.addEventListener('input', () => {
    filterCatCards();
    updateCount();
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    keyword.value  = '';
    filterT.value  = '';
    filterF.value  = '';
    filterB.value  = '';
    document.querySelectorAll('#formations .card').forEach(c => c.style.display = '');
    document.querySelectorAll('.cat-card').forEach(c => c.style.display = '');
    [filterT, filterF, filterB].forEach(sel => sel.classList.remove('active'));
    countEl.innerHTML = '<span>2</span> formations disponibles';
  });
})();
