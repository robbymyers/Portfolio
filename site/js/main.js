// robbymyers.com — global interactions

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
