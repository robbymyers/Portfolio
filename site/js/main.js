// robbymyers.com — global interactions

// About headshot rollover — hover handled by CSS; tap toggles on touch devices
const aboutPortrait = document.getElementById('aboutPortrait');
if (aboutPortrait) {
  aboutPortrait.addEventListener('touchstart', (e) => {
    e.preventDefault();
    aboutPortrait.classList.toggle('touched');
  }, { passive: false });
}

// Sticky nav: add shadow once scrolled past top
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Mobile menu toggle
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// All Work category filters — default shows a 6-shot preview; each pill reveals
// only its category; clicking the active pill again restores the preview.
const filterBar = document.querySelector('.aw-filters');
if (filterBar) {
  const cards = [...document.querySelectorAll('.aw-grid .aw-card')];
  const showPreview = () =>
    cards.forEach((c) => c.classList.toggle('is-hidden', c.classList.contains('aw-preview-hidden')));
  filterBar.querySelectorAll('.aw-filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      const wasActive = btn.classList.contains('is-active');
      filterBar.querySelectorAll('.aw-filter').forEach((b) => b.classList.remove('is-active'));
      if (wasActive) { showPreview(); return; }
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      cards.forEach((c) => c.classList.toggle('is-hidden', c.dataset.cat !== cat));
    });
  });
}

// Scroll-enter reveal (fade-in / slide-up)
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}
