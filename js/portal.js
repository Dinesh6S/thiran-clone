// Demo certificate portal: no backend. Searches registrations saved in this browser's localStorage.
(function () {
  const $ = (s) => document.querySelector(s);
  const DEMO_OTP = '123456';
  const digits = (p) => (p || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const flash = (el, text, kind) => { el.textContent = text; el.className = 'tp-alert ' + (kind || 'tp-alert-error'); el.style.display = 'block'; };

  $('#tp-search-btn').addEventListener('click', () => {
    const phone = digits($('#tp-phone-input').value);
    const email = $('#tp-email-input').value.trim().toLowerCase();
    const err = $('#tp-error-msg');
    err.style.display = 'none';
    if (!phone && !email) return flash(err, 'Please enter a mobile number or an email address.');
    if (phone && phone.length !== 10) return flash(err, 'Enter a valid 10-digit mobile number.');

    let list = [];
    try { list = JSON.parse(localStorage.getItem('registrations')) || []; } catch { /* corrupt data: no records */ }
    if (!Array.isArray(list)) list = [];
    const found = list.filter((r) => (!phone || digits(r.phone) === phone) && (!email || (r.email || '').toLowerCase() === email));
    if (!found.length) return flash(err, 'No records found. (Demo: only registrations made in this browser are searchable.)');

    $('#tp-results-list').innerHTML = found.map((r) => {
      const s = (window.SESSIONS || []).find((x) => x.id === r.session);
      return `<div class="tp-card tp-record">${/^data:image\//.test(r.photo || '') ? `<img class="tp-photo" src="${r.photo}" alt="" width="52" height="67">` : ''}<div><strong>${esc(r.name)}</strong>
        <div class="tp-sub">${s ? esc(s.title + ' · ' + s.city + ' · ' + s.date) : 'Session'}</div></div>
        <div class="tp-actions"><button class="tp-btn tp-btn-secondary" data-act="id">Download ID Card</button>
        <button class="tp-btn tp-btn-primary" data-act="cert">Download Certificate</button></div></div>`;
    }).join('');
    $('#tp-results').style.display = 'block';
  });

  $('#tp-results-list').addEventListener('click', (e) => {
    const act = e.target.dataset.act;
    if (act === 'id') flash($('#tp-error-msg'), 'Demo: no ID card file is generated.', 'tp-alert-ok');
    if (act === 'cert') openOtp();
  });

  const modal = $('#tp-otp-modal');
  function openOtp() {
    $('#tp-otp-step-send').style.display = 'block';
    $('#tp-otp-step-verify').style.display = 'none';
    $('#tp-otp-msg').style.display = 'none';
    $('#tp-otp-input').value = '';
    modal.style.display = 'flex';
  }
  const closeOtp = () => { modal.style.display = 'none'; };
  $('#tp-otp-close').addEventListener('click', closeOtp);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeOtp(); });

  const sendOtp = () => {
    $('#tp-otp-step-send').style.display = 'none';
    $('#tp-otp-step-verify').style.display = 'block';
    flash($('#tp-otp-msg'), `Demo: no email is sent. Use OTP ${DEMO_OTP}.`, 'tp-alert-ok');
  };
  $('#tp-otp-send-btn').addEventListener('click', sendOtp);
  $('#tp-otp-resend-btn').addEventListener('click', sendOtp);
  $('#tp-otp-verify-btn').addEventListener('click', () => {
    const ok = $('#tp-otp-input').value.trim() === DEMO_OTP;
    flash($('#tp-otp-msg'), ok ? 'Verified! (Demo: no certificate file exists.)' : 'Incorrect OTP. Please try again.', ok ? 'tp-alert-ok' : 'tp-alert-error');
  });
})();
