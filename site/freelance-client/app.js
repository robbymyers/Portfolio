// Freelance Client Tool — shared shell, auth gate, and utilities.
import { supabase, getSession, signIn, signOut, onAuthChange, table } from './db.js';

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function money(n) {
  const v = Number(n || 0);
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Timezone-safe: parse a 'YYYY-MM-DD' column as LOCAL midnight, never UTC.
export function parseDate(d) {
  if (!d) return null;
  if (d instanceof Date) return d;
  const [y, m, day] = String(d).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, day);
}
export function todayISO() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
export function toISO(date) {
  const d = date instanceof Date ? date : parseDate(date);
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function fmtDate(d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  const dt = parseDate(d);
  return dt ? dt.toLocaleDateString('en-US', opts) : '';
}
export function fmtMonth(d) {
  const dt = parseDate(d);
  return dt ? dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
}
export function addMonths(d, n) {
  const dt = parseDate(d);
  return new Date(dt.getFullYear(), dt.getMonth() + n, 1);
}
export function firstOfMonth(d) {
  const dt = parseDate(d) || new Date();
  return new Date(dt.getFullYear(), dt.getMonth(), 1);
}
export function daysBetween(a, b) {
  return Math.round((parseDate(b) - parseDate(a)) / 86400000);
}

export function debounce(fn, ms = 250) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

export function toast(msg, kind = 'ok') {
  let box = $('#fc-toast');
  if (!box) { box = document.createElement('div'); box.id = 'fc-toast'; document.body.appendChild(box); }
  const t = document.createElement('div');
  t.className = `fc-toast fc-toast--${kind}`;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2600);
}

// Status badges — classes defined in styles.css (fills vs. outlines, no color-only).
export function invoiceBadge(inv) {
  const overdue = inv.status === 'sent' && inv.due_date && parseDate(inv.due_date) < parseDate(todayISO());
  const s = overdue ? 'overdue' : inv.status;
  const label = { draft: 'Draft', sent: 'Sent', paid: 'Paid', void: 'Void', overdue: 'Overdue' }[s] || s;
  return `<span class="fc-badge fc-badge--inv-${s}">${label}</span>`;
}
export function quoteBadge(q) {
  const label = { draft: 'Draft', sent: 'Sent', accepted: 'Accepted', declined: 'Declined', expired: 'Expired' }[q.status] || q.status;
  return `<span class="fc-badge fc-badge--q-${q.status}">${label}</span>`;
}

export async function confirmAction(message) {
  return window.confirm(message);
}

// ---------------------------------------------------------------------------
// App shell + auth gate
// ---------------------------------------------------------------------------
const ICON = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  clients: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  hopper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m3 6 1.4 1.4L7 5"/><path d="m3 12 1.4 1.4L7 11"/><path d="m3 18 1.4 1.4L7 17"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
};
const NAV = [
  { href: 'index.html', label: 'Dashboard', key: 'dashboard', icon: ICON.dashboard },
  { href: 'clients.html', label: 'Clients', key: 'clients', icon: ICON.clients },
  { href: 'hopper.html', label: 'The Hopper', key: 'hopper', icon: ICON.hopper },
  { href: 'social.html', label: 'Social Calendar', key: 'social', icon: ICON.social },
  { href: 'settings.html', label: 'Settings', key: 'settings', icon: ICON.settings },
];

function shellHTML(active, email) {
  const links = NAV.map((n) => `<a href="${n.href}" class="fc-navlink ${n.key === active ? 'is-active' : ''}">${n.icon}<span>${n.label}</span></a>`).join('');
  return `
  <div class="fc-layout">
    <aside class="fc-sidebar" id="fc-sidebar">
      <a class="fc-brand" href="index.html"><span class="fc-brand-mark">FS</span><span class="fc-brand-text">Freelance<b>Studio</b></span></a>
      <nav class="fc-nav">${links}</nav>
      <div class="fc-side-foot">
        <span class="fc-user-email">${esc(email)}</span>
        <button class="fc-btn fc-btn--ghost" id="fc-signout">Sign out</button>
      </div>
    </aside>
    <div class="fc-scrim" id="fc-scrim"></div>
    <div class="fc-shell">
      <header class="fc-mobilebar">
        <button class="fc-hamburger" id="fc-hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
        <a class="fc-brand-m" href="index.html">Freelance<span>·</span>Studio</a>
      </header>
      <main class="fc-main" id="fc-main"></main>
    </div>
  </div>`;
}

function loginHTML() {
  return `
  <div class="fc-login">
    <form class="fc-login-card" id="fc-login-form">
      <h1 class="fc-login-title">Freelance Studio</h1>
      <p class="fc-login-sub">Private tool. Please sign in.</p>
      <label class="fc-field"><span>Email</span><input type="email" id="fc-email" autocomplete="username" required /></label>
      <label class="fc-field"><span>Password</span><input type="password" id="fc-password" autocomplete="current-password" required /></label>
      <button class="fc-btn fc-btn--primary" type="submit" id="fc-login-btn">Sign in</button>
      <p class="fc-login-error" id="fc-login-error" hidden></p>
    </form>
  </div>`;
}

function noticeHTML(title, body) {
  return `<div class="fc-login"><div class="fc-login-card"><h1 class="fc-login-title">${esc(title)}</h1><p class="fc-login-sub">${body}</p><button class="fc-btn fc-btn--ghost" id="fc-signout-2">Sign out</button></div></div>`;
}

// Confirm the signed-in user is an owner (and the schema is reachable).
async function ownerStatus() {
  const { error } = await table('settings').select('id').limit(1);
  if (error) {
    // 42P01 = undefined table / schema not exposed; PGRST = not found
    return { ok: false, reason: 'db' };
  }
  // RLS hides everything from non-owners, so a reachable-but-empty settings
  // means "not on the allowlist".
  const { data } = await table('settings').select('id').limit(1);
  if (!data || data.length === 0) return { ok: false, reason: 'notowner' };
  return { ok: true };
}

/**
 * Mount a page. `render(main, ctx)` runs only when a signed-in owner is present.
 * Signed out → login form only, no data calls.
 */
export async function mountApp({ active, render }) {
  const root = document.getElementById('app') || document.body;
  let painting = false;

  function fatal(err) {
    console.error(err);
    root.innerHTML = noticeHTML('Something went wrong',
      `<span style="color:var(--fc-ink)">${esc((err && err.message) || err)}</span><br><br>Try reloading. If it persists, let Rob know what this says.`);
    const so = document.getElementById('fc-signout-2');
    if (so) so.addEventListener('click', async () => { await signOut(); location.reload(); });
  }

  // Never leave a blank page: surface uncaught errors + repaint on bf-cache restore.
  window.addEventListener('error', (e) => { if (!root.children.length) fatal(e.error || e.message); });
  window.addEventListener('unhandledrejection', (e) => { if (!root.children.length) fatal(e.reason); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) paint(); });

  async function paint() {
    if (painting) return;
    painting = true;
    try {
      await paintInner();
    } catch (err) {
      fatal(err);
    } finally {
      painting = false;
    }
  }

  async function paintInner() {
    const session = await getSession();
    if (!session) { root.innerHTML = loginHTML(); wireLogin(); return; }

    const status = await ownerStatus();
    if (!status.ok) {
      if (status.reason === 'db') {
        root.innerHTML = noticeHTML('Database not reachable',
          'The <code>freelance</code> schema may not be applied or exposed yet. Apply <code>supabase/freelance/01_schema.sql</code> and add the schema under Settings → API → Exposed schemas.');
      } else {
        root.innerHTML = noticeHTML('No access', 'This account isn’t on the owner allowlist.');
      }
      const so = document.getElementById('fc-signout-2');
      if (so) so.addEventListener('click', async () => { await signOut(); });
      return;
    }

    root.innerHTML = shellHTML(active, session.user.email);
    document.getElementById('fc-signout').addEventListener('click', async () => { await signOut(); });
    wireShell();
    try {
      await render(document.getElementById('fc-main'), { user: session.user });
    } catch (err) {
      console.error(err);
      document.getElementById('fc-main').innerHTML =
        `<div class="fc-empty">Something went wrong loading this page.<br><small>${esc(err.message || err)}</small></div>`;
    }
  }

  function wireShell() {
    const sb = document.getElementById('fc-sidebar');
    const scrim = document.getElementById('fc-scrim');
    const ham = document.getElementById('fc-hamburger');
    const close = () => { sb.classList.remove('is-open'); scrim.classList.remove('is-open'); };
    if (ham) ham.addEventListener('click', () => { sb.classList.add('is-open'); scrim.classList.add('is-open'); });
    if (scrim) scrim.addEventListener('click', close);
    sb.querySelectorAll('.fc-navlink').forEach((a) => a.addEventListener('click', close));
  }

  function wireLogin() {
    const form = document.getElementById('fc-login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('fc-login-btn');
      const errEl = document.getElementById('fc-login-error');
      errEl.hidden = true;
      btn.disabled = true; btn.textContent = 'Signing in…';
      const { error } = await signIn(document.getElementById('fc-email').value.trim(), document.getElementById('fc-password').value);
      if (error) { errEl.textContent = error.message; errEl.hidden = false; btn.disabled = false; btn.textContent = 'Sign in'; }
    });
  }

  // Re-paint on sign-in / sign-out.
  onAuthChange(() => paint());
  await paint();
}

export { supabase, table };
