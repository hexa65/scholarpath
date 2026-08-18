/* ─────────────────────────────────────────────────────────
   app.js — Shared utilities for ScholarPath frontend
───────────────────────────────────────────────────────── */

const API = window.SP_API_BASE || 'https://scholarpath-yq96.onrender.com/api';

// ── Auth helpers ────────────────────────────────────────
const Auth = {
  getToken: ()  => localStorage.getItem('sp_token'),
  getUser:  ()  => { try { return JSON.parse(localStorage.getItem('sp_user')); } catch { return null; } },
  setSession: (token, user) => { localStorage.setItem('sp_token', token); localStorage.setItem('sp_user', JSON.stringify(user)); },
  clear:    ()  => { localStorage.removeItem('sp_token'); localStorage.removeItem('sp_user'); },
  isLoggedIn:() => !!Auth.getToken(),
  role:     ()  => Auth.getUser()?.role || null,
};

// ── API fetch wrapper ───────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Toast ───────────────────────────────────────────────
const Toast = {
  _container() {
    let el = document.getElementById('toast-container');
    if (!el) { el = document.createElement('div'); el.id = 'toast-container'; document.body.appendChild(el); }
    return el;
  },
  show(msg, type = 'info', duration = 3200) {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const el = document.createElement('div');
    el.className = 'toast-msg';
    el.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${msg}</span>`;
    this._container().appendChild(el);
    setTimeout(() => el.remove(), duration);
  },
  success: (m) => Toast.show(m, 'success'),
  error:   (m) => Toast.show(m, 'error'),
  warn:    (m) => Toast.show(m, 'warning'),
};

// ── Theme toggle ────────────────────────────────────────
const Theme = {
  init() {
    const saved = localStorage.getItem('sp_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this.updateBtn(saved);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sp_theme', next);
    this.updateBtn(next);
  },
  updateBtn(theme) {
    const btn = document.querySelector('.theme-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },
};

// ── Deadline helpers ────────────────────────────────────
function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}
function deadlineClass(days) {
  return days <= 7 ? 'deadline-red' : days <= 14 ? 'deadline-yellow' : 'deadline-green';
}
function deadlineLabel(days) {
  if (days < 0)  return '🔴 Closed';
  if (days === 0) return '🔴 Today!';
  if (days <= 7)  return `🔴 ${days}d left`;
  if (days <= 14) return `🟡 ${days}d left`;
  return `🟢 ${days}d left`;
}

// ── Scholarship card HTML ───────────────────────────────
function renderScholarshipCard(s, showMatch = false) {
  const days = daysUntil(s.deadline);
  const saved = (Auth.getUser()?.bookmarks || []).includes(s._id);
  return `
  <div class="card sch-card" onclick="window.location='/pages/scholarship.html?id=${s._id}'" data-id="${s._id}">
    <div class="card-banner" style="background:${s.orgColor || '#123E63'}"></div>
    <div class="card-body">
      <div class="card-org-row">
        <div style="display:flex;align-items:center;gap:10px">
          <div class="org-logo" style="background:${s.orgColor || '#123E63'}">${(s.orgName||'ORG').substring(0,2).toUpperCase()}</div>
          <div class="org-info">
            <div class="org-name">${s.orgName || '—'}</div>
            <div class="org-country">${s.country}</div>
          </div>
        </div>
        <span class="deadline-badge ${deadlineClass(days)}">${deadlineLabel(days)}</span>
      </div>
      <h3 class="card-title">${s.title}</h3>
      <p class="card-desc">${(s.description || '').substring(0, 88)}…</p>
      <div class="card-tags">
        <span class="tag tag-blue">${s.level}</span>
        <span class="tag tag-teal">${s.field}</span>
        <span class="tag tag-orange">${s.fundingType}</span>
      </div>
      ${showMatch && s.match ? `<div class="match-badge">⚡ ${s.match}% Match</div>` : ''}
    </div>
    <div class="card-footer-row">
      <div>
        <div class="award-amount">${s.amount}</div>
        <div class="award-label">Award value</div>
      </div>
      <button class="save-btn ${saved ? 'saved' : ''}" onclick="toggleBookmark(event,'${s._id}',this)">
        ${saved ? '✓ Saved' : '🔖 Save'}
      </button>
    </div>
  </div>`;
}

// ── Bookmark toggle ─────────────────────────────────────
async function toggleBookmark(e, id, btn) {
  e.stopPropagation();
  if (!Auth.isLoggedIn()) { Toast.warn('Please log in to save scholarships'); return; }
  try {
    const data = await apiFetch(`/scholarships/${id}/bookmark`, { method: 'POST' });
    const saved = data.bookmarks.includes(id);
    btn.className = `save-btn ${saved ? 'saved' : ''}`;
    btn.textContent = saved ? '✓ Saved' : '🔖 Save';
    Toast.success(saved ? 'Saved to your dashboard!' : 'Removed from saved');
    // update local user cache
    const user = Auth.getUser();
    if (user) { user.bookmarks = data.bookmarks; localStorage.setItem('sp_user', JSON.stringify(user)); }
  } catch (err) { Toast.error(err.message); }
}

// ── Navbar active link ──────────────────────────────────
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('active', path.includes(l.dataset.page));
  });
}

// ── Navbar user state ───────────────────────────────────
function updateNavAuth() {
  const user = Auth.getUser();
  const actions = document.getElementById('nav-actions');
  if (!actions) return;
  if (user) {
    actions.innerHTML = `
      <button class="theme-btn" onclick="Theme.toggle()" title="Toggle theme">🌙</button>
      <a href="/pages/${user.role === 'organization' ? 'org-dashboard' : 'dashboard'}.html" class="nav-login">Dashboard</a>
      <button class="nav-signup" onclick="logout()">Logout</button>`;
  } else {
    actions.innerHTML = `
      <button class="theme-btn" onclick="Theme.toggle()" title="Toggle theme">🌙</button>
      <a href="/pages/login.html" class="nav-login">Log In</a>
      <a href="/pages/register.html" class="nav-signup">Get Started Free</a>`;
  }
}

function logout() {
  Auth.clear();
  Toast.success('Logged out');
  setTimeout(() => window.location = '/', 800);
}

// ── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  setActiveNav();
  updateNavAuth();
});

// ── Export for use in other scripts ─────────────────────
window.SP = { Auth, apiFetch, Toast, daysUntil, deadlineClass, deadlineLabel, renderScholarshipCard, toggleBookmark };
