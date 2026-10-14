const $ = (s) => document.querySelector(s);
const KEY = 'registrations';

$('#menuBtn')?.addEventListener('click', () => $('nav').classList.toggle('open'));
const toTop = $('#toTop');
window.addEventListener('scroll', () => toTop && (toTop.style.display = scrollY > 300 ? 'block' : 'none'));
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

let currentSession = null;
function openRegister(id) { currentSession = id; $('#regModal').classList.add('show'); }
function closeRegister() { $('#regModal').classList.remove('show'); $('#regMsg').textContent = ''; window.resetPassportPhoto?.(); }

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
              phone: f.phone.value, remarks: f.remarks.value, photo: window.getPassportPhoto?.() || '',
              at: new Date().toISOString() });
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch { msg.textContent = 'Could not save (browser storage is full or blocked).'; return; }
  msg.textContent = 'Registered! (demo — no payment taken)';
  f.reset();
  window.resetPassportPhoto?.();
});

$('#contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  $('#contactMsg').textContent = 'Thanks! Message not actually sent (demo).';
  e.target.reset();
});
