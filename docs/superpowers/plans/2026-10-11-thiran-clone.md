# Thiran Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static multi-page learning clone of thiranacademy.com's layout and behavior, with placeholder content.

**Architecture:** Plain HTML pages sharing one stylesheet and two scripts. Session cards render from one JS array. Registration form validates in a pure function and saves to localStorage.

**Tech Stack:** HTML, CSS, vanilla JS. No build step, no dependencies. Tests run with `node`.

**Spec:** `docs/superpowers/specs/2026-10-11-thiran-clone-design.md`

## Global Constraints

- No backend, no payments, no build step, no npm dependencies.
- Placeholder text/logo/images/contact details only; no copied branding or copy.
- Nav (exact labels): Home, Upcoming Sessions, Sessions, Download, About Us, Contact Us.
- Footer legal links: Privacy Policy, Terms and Conditions, Disclaimer.
- 7 placeholder sessions; 3-column grid on desktop, 1 column on mobile.
- Header, top bar, footer repeated in every HTML file (shortcut: no includes, upgrade if edits get painful).

## Review Focus

- Phone with spaces/+91 prefix (`+91 98847 95009`) should be accepted.
- Whitespace-only name must be rejected.
- Non-image upload (e.g. `.pdf`) must be rejected; no file chosen must be rejected (photo required).
- Email without TLD (`a@b`) must be rejected.
- Corrupt/missing `localStorage` data must not break the page when saving a registration.

---

### Task 1: Validation logic (tested)

**Files:**
- Create: `js/validate.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Produces: `validateRegistration({name, email, phone, photoType}) -> string[]` (error messages; empty array = valid). Exported via `module.exports` when `module` exists, and as global `validateRegistration` in the browser.

- [ ] **Step 1: Write the failing test** — `tests/validate.test.js`

```js
const assert = require('assert');
const { validateRegistration: v } = require('../js/validate.js');
const ok = { name: 'Asha K', email: 'a@b.com', phone: '9884795009', photoType: 'image/png' };

assert.deepStrictEqual(v(ok), []);
assert.deepStrictEqual(v({ ...ok, phone: '+91 98847 95009' }), []);
assert.strictEqual(v({ ...ok, name: '   ' }).length, 1);
assert.strictEqual(v({ ...ok, email: 'a@b' }).length, 1);
assert.strictEqual(v({ ...ok, phone: '123' }).length, 1);
assert.strictEqual(v({ ...ok, photoType: 'application/pdf' }).length, 1);
assert.strictEqual(v({ ...ok, photoType: '' }).length, 1);
console.log('validate: all passed');
```

- [ ] **Step 2: Run to verify it fails** — `node tests/validate.test.js` → Expected: Cannot find module `../js/validate.js`.

- [ ] **Step 3: Implement** — `js/validate.js`

```js
function validateRegistration({ name, email, phone, photoType }) {
  const errors = [];
  if (!name || !name.trim()) errors.push('Full name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')) errors.push('Enter a valid email address.');
  const digits = (phone || '').replace(/[\s+-]/g, '').replace(/^91(?=\d{10}$)/, '');
  if (!/^\d{10}$/.test(digits)) errors.push('Enter a valid 10-digit phone number.');
  if (!/^image\//.test(photoType || '')) errors.push('Upload a passport-size photo (image file).');
  return errors;
}
if (typeof module !== 'undefined') module.exports = { validateRegistration };
```

- [ ] **Step 4: Run to verify it passes** — `node tests/validate.test.js` → Expected: `validate: all passed`.

---

### Task 2: Styles, shared layout, and the home page

**Files:**
- Create: `css/style.css`, `js/sessions.js`, `js/main.js`, `index.html`, `img/logo.svg`, `img/hero.svg`, `img/about.svg`, `img/city.svg`

**Interfaces:**
- Consumes: `validateRegistration` from Task 1 (loaded via `<script src="js/validate.js">` before `main.js`).
- Produces: `SESSIONS` array and `renderSessions(containerId, limit?)` in `sessions.js`; `openRegister(sessionId)` and the shared modal markup used by every page that shows cards; CSS classes `.container`, `.grid`, `.card`, `.btn`.

- [ ] **Step 1: `css/style.css`** — CSS variables on `:root` (`--primary:#1f3a8a; --accent:#f59e0b; --bg:#f8fafc; --text:#0f172a`); `.container{max-width:1140px;margin:auto;padding:0 16px}`; `.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}`; `@media(max-width:900px){.grid{grid-template-columns:1fr}}`; `.card`, `.btn`, top bar, header/nav (nav hidden under 900px unless `.open`), hero (full-width, gradient overlay), two-column `.about`, 3-column footer, modal (`.modal{position:fixed;inset:0;display:none}` `.modal.show{display:flex}`), `#toTop` fixed bottom-right.

- [ ] **Step 2: `js/sessions.js`**

```js
const CITIES = [
  ['Coimbatore', '2026-10-11'], ['Tiruppur', '2026-10-14'], ['Salem', '2026-10-18'],
  ['Pondy', '2026-10-21'], ['Salem', '2026-10-25'], ['Vellore', '2026-10-28'], ['Chennai', '2026-10-31'],
];
const SESSIONS = CITIES.map(([city, date], i) => ({
  id: i + 1, title: 'Future-Tech Insights', city, date, time: '10:00 AM – 4:00 PM',
  trainer: 'Sample Trainer', venue: `${city} Community Hall`, fee: 3000,
  blurb: 'A one-day introduction to modern skills. (placeholder text)',
}));

function renderSessions(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = SESSIONS.slice(0, limit || SESSIONS.length).map(s => `
    <article class="card">
      <img src="img/city.svg" alt="${s.city} ${s.date}" width="300" height="169">
      <h3>${s.title}</h3><p>${s.blurb}</p>
      <ul><li>Trainer: ${s.trainer}</li><li>Location: ${s.venue}</li>
          <li>Date: ${s.date}</li><li>Time: ${s.time}</li><li>Fees: ${s.fee}/-</li></ul>
      <button class="btn" onclick="openRegister(${s.id})">Register Now</button>
    </article>`).join('');
}
```

- [ ] **Step 3: `js/main.js`**

```js
const $ = (s) => document.querySelector(s);
const KEY = 'registrations';

$('#menuBtn')?.addEventListener('click', () => $('nav').classList.toggle('open'));
const toTop = $('#toTop');
window.addEventListener('scroll', () => toTop && (toTop.style.display = scrollY > 300 ? 'block' : 'none'));
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

let currentSession = null;
function openRegister(id) { currentSession = id; $('#regModal').classList.add('show'); }
function closeRegister() { $('#regModal').classList.remove('show'); $('#regMsg').textContent = ''; }

$('#regForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const errors = validateRegistration({
    name: f.name.value, email: f.email.value, phone: f.phone.value,
    photoType: f.photo.files[0]?.type || '',
  });
  const msg = $('#regMsg');
  if (errors.length) { msg.textContent = errors.join(' '); return; }
  let list = [];
  try { list = JSON.parse(localStorage.getItem(KEY)) || []; } catch { /* corrupt data: start fresh */ }
  if (!Array.isArray(list)) list = [];
  list.push({ session: currentSession, name: f.name.value.trim(), email: f.email.value,
              phone: f.phone.value, remarks: f.remarks.value, at: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(list));
  msg.textContent = 'Registered! (demo — no payment taken)';
  f.reset();
});
```

- [ ] **Step 4: `img/*.svg`** — simple placeholder SVGs: `logo.svg` (54×54 rounded square with "TA"), `hero.svg` (1600×500 gradient), `about.svg` (500×400 abstract shapes), `city.svg` (300×169 gradient with the word "Session").

- [ ] **Step 5: `index.html`** — in order: skip link; `.topbar` (placeholder phone `+91 00000 00000`, `hello@example.com`, "Sample Address, Chennai"); `<header>` with logo, site name "Thiran Academy Clone", `<button id="menuBtn">☰</button>`, `<nav>` with the 6 labels linking to `index.html`, `upcoming-sessions.html`, `sessions.html`, `download.html`, `about-us.html`, `contact-us.html`; hero (eyebrow "Brand Manifesto", h1, tagline, `.btn` → `upcoming-sessions.html`); `.about` two-column (text + `img/about.svg`); `<section><h2>Upcoming Sessions</h2><div id="sessionGrid" class="grid"></div></section>`; `<a class="btn" href="upcoming-sessions.html">Explore More Sessions</a>`; the modal (`#regModal` containing `#regForm` with `name`, `email`, `phone`, `remarks`, `photo` file input `accept="image/*"`, `#regMsg`, "Register and Pay" submit, "Cancel" button calling `closeRegister()`); footer (Useful Links, Legal Links, Contact Us columns + copyright bar); `<button id="toTop">↑</button>`; scripts in order `js/validate.js`, `js/sessions.js`, `js/main.js`, then `<script>renderSessions('sessionGrid', 7)</script>`.

- [ ] **Step 6: Verify in browser** — `open index.html`. Check: 7 cards render, 3 columns on wide window, 1 column when narrowed under 900px with working hamburger, "Register Now" opens modal, submitting empty form shows errors, valid submit shows success and `localStorage.registrations` has the entry, scroll-to-top appears after scrolling.

---

### Task 3: Remaining pages

**Files:**
- Create: `upcoming-sessions.html`, `sessions.html`, `download.html`, `about-us.html`, `contact-us.html`, `terms.html`, `privacy.html`, `disclaimer.html`

**Interfaces:**
- Consumes: shared top bar, header, footer, modal markup and script tags copied verbatim from `index.html` (Task 2). Pages without cards (`download`, `about-us`, `contact-us`, `terms`, `privacy`, `disclaimer`) may omit the modal and `sessions.js`.

- [ ] **Step 1:** Copy `index.html` as the base for each page; replace the `<main>` content.
  - `upcoming-sessions.html`: `<h1>Upcoming Sessions</h1>` + `<div id="sessionGrid" class="grid">`, call `renderSessions('sessionGrid')`.
  - `sessions.html`: same with `<h1>Sessions</h1>`.
  - `download.html`: `<h1>Download</h1>` + a `<ul>` of 3 placeholder links (`#`).
  - `about-us.html`: heading + 3 placeholder paragraphs + `img/about.svg`.
  - `contact-us.html`: heading, placeholder contact details, and a form (name, email, message) whose submit handler does `preventDefault()` and shows "Thanks, message not actually sent (demo)".
  - `terms.html`, `privacy.html`, `disclaimer.html`: heading + 2 paragraphs "Placeholder text for learning purposes."
- [ ] **Step 2: Verify** — open each page; all nav and footer links resolve with no 404s; active page is distinguishable in nav (add `class="active"` on its own link).
- [ ] **Step 3: Final check** — `node tests/validate.test.js` still prints `validate: all passed`; resize every page to ~375px and confirm no horizontal scroll.
