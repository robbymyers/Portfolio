/* ── Hero entrance ── */
window.addEventListener("load", () => {
  document.querySelector(".hero")?.classList.add("loaded");
});
// Fallback in case load fires before script (cached assets)
requestAnimationFrame(() => {
  setTimeout(() => document.querySelector(".hero")?.classList.add("loaded"), 60);
});

/* ── Scroll reveals ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ── Custom cursor ── */
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let cx = x, cy = y;

  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

  const render = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  };
  render();

  document.addEventListener("mouseleave", () => cursor.classList.add("hidden"));
  document.addEventListener("mouseenter", () => cursor.classList.remove("hidden"));

  const interactive = "a, button, [data-cursor]";
  document.querySelectorAll(interactive).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("ring"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("ring"));
  });
}

/* ── Subtle parallax on hero portrait ── */
const portrait = document.querySelector(".hero-portrait");
if (portrait && window.matchMedia("(min-width: 880px)").matches) {
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.12;
    portrait.style.translate = `0 ${offset}px`;
  }, { passive: true });
}
