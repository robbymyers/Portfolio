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

// Next Route in-dash embed — scale the native 1560×660 prototype to fit its container
const nrScale = document.querySelector('.nr-scale');
if (nrScale) {
  const screen = nrScale.parentElement;
  const NR_W = 1560, NR_H = 660;
  const fitDash = () => {
    const s = screen.clientWidth / NR_W;
    nrScale.style.transform = `scale(${s})`;
    screen.style.height = `${NR_H * s}px`;
  };
  fitDash();
  window.addEventListener('resize', fitDash, { passive: true });
  const nrFrame = nrScale.querySelector('iframe');
  if (nrFrame) nrFrame.addEventListener('load', fitDash);
}

// Image lightbox — click a case-study image to view it full size
(() => {
  const imgs = document.querySelectorAll('.cs-image .frame img');
  if (!imgs.length) return;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lightbox-close" aria-label="Close image">&times;</button><img alt="" />';
  const full = box.querySelector('img');
  const closeBtn = box.querySelector('.lightbox-close');
  document.body.appendChild(box);
  const open = (src, alt) => {
    full.src = src;
    full.alt = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    box.classList.remove('open');
    document.body.style.overflow = '';
  };
  imgs.forEach((img) => {
    img.addEventListener('click', () => open(img.currentSrc || img.src, img.alt));
  });
  box.addEventListener('click', (e) => { if (e.target === box || e.target === closeBtn) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('open')) close();
  });
})();

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
