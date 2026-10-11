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
      <div class="card-body">
        <h3>${s.title}</h3><p class="desc">${s.blurb}</p>
        <div class="details">
          <div class="row"><i>👤</i><span><strong>Trainer:</strong> ${s.trainer}</span></div>
          <div class="row"><i>📍</i><span><strong>Location:</strong> ${s.venue}</span></div>
          <div class="row"><i>📅</i><span><strong>Date:</strong> ${s.date}</span></div>
          <div class="row"><i>🕙</i><span><strong>Time:</strong> ${s.time}</span></div>
          <div class="row"><i>💰</i><span><strong>Fees:</strong> ${s.fee}/-</span></div>
        </div>
        <button class="reg" onclick="openRegister(${s.id})">Register Now</button>
      </div>
    </article>`).join('');
}
