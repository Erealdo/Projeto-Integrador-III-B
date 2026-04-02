/* ============================================================
   WoorkFlow — ui.js
   Helpers de interface compartilhados entre páginas
   ============================================================ */

/* ── Toast notifications ── */
function showToast(msg, type = 'default', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Modal ── */
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('hidden');
}
function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('hidden');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

/* ── Alert inside form ── */
function showAlert(alertId, msg, type = 'error') {
  const el = document.getElementById(alertId);
  if (!el) return;
  el.className = `alert ${type} show`;
  el.querySelector('span:last-child').textContent = msg;
}
function hideAlert(alertId) {
  const el = document.getElementById(alertId);
  if (el) el.classList.remove('show');
}

/* ── Loading button ── */
function setLoading(btnId, state) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.classList.toggle('loading', state);
  btn.disabled = state;
}

/* ── Format date ── */
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function fmtDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function isOverdue(iso) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

/* ── Sidebar toggle (mobile) ── */
function initSidebarToggle() {
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.querySelector('.sidebar-overlay');
  const btnMenu  = document.querySelector('.btn-menu');
  if (!sidebar) return;
  btnMenu && btnMenu.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('show');
  });
  overlay && overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

/* ── Active nav item ── */
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

/* ── Navigate ── */
function navigateTo(page) {
  window.location.href = page;
}

/* ── User avatar initials ── */
function makeAvatar(name) {
  const parts = (name || '').trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

/* ── Guard: redirect if not logged in ── */
function requireAuth() {
  if (!WF.isLoggedIn()) {
    window.location.href = '../index.html';
  }
}

/* ── Init sidebar user info ── */
function initUserPanel() {
  const session = WF.getSession();
  if (!session) return;
  const nameEl   = document.getElementById('sidebar-user-name');
  const emailEl  = document.getElementById('sidebar-user-email');
  const avatarEl = document.getElementById('sidebar-user-avatar');
  if (nameEl)   nameEl.textContent  = session.name;
  if (emailEl)  emailEl.textContent = session.email;
  if (avatarEl) avatarEl.textContent = makeAvatar(session.name);
}

/* ── Logout ── */
function logout() {
  WF.logout();
  window.location.href = '../index.html';
}

/* ── Priority label ── */
function priorityLabel(p) {
  return { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[p] || p;
}
function priorityClass(p) {
  return { alta: 'priority-alta', media: 'priority-media', baixa: 'priority-baixa' }[p] || '';
}

/* ── Status label ── */
function statusLabel(s) {
  return { todo: 'A fazer', doing: 'Em andamento', done: 'Concluído' }[s] || s;
}

/* ── Empty state ── */
function emptyState(msg, icon = '📭') {
  return `<div style="text-align:center;padding:40px 20px;color:var(--muted);">
    <div style="font-size:2rem;margin-bottom:8px">${icon}</div>
    <div style="font-size:.875rem">${msg}</div>
  </div>`;
}
