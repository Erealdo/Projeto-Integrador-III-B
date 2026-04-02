// ============================================================
// WoorkFlow — js/api.js
// Cliente da API — substitui o storage.js nas páginas internas
// ============================================================

const API = 'http://localhost:3001/api';

// ── Token ────────────────────────────────────────────────────
function getToken()          { return localStorage.getItem('wf_token'); }
function getUser()           { try { return JSON.parse(localStorage.getItem('wf_user')); } catch { return null; } }
function saveSession(t, u)   { localStorage.setItem('wf_token', t); localStorage.setItem('wf_user', JSON.stringify(u)); }
function clearSession()      { localStorage.removeItem('wf_token'); localStorage.removeItem('wf_user'); }
function isLoggedIn()        { return !!getToken(); }

// ── Guard ────────────────────────────────────────────────────
function requireAuth() {
  if (!isLoggedIn()) window.location.href = '../index.html';
}

// ── Headers ─────────────────────────────────────────────────
function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` };
}

// ── Fetch helper ─────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res  = await fetch(API + path, { headers: authHeaders(), ...options });
  const data = await res.json();
  if (res.status === 401) { clearSession(); window.location.href = '../index.html'; }
  return { ok: res.ok, status: res.status, data };
}

// ── Auth ─────────────────────────────────────────────────────
async function apiLogin(email, password) {
  const res  = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) saveSession(data.token, data.user);
  return { ok: res.ok, data };
}

async function apiRegister(payload) {
  const res  = await fetch(`${API}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (res.ok) saveSession(data.token, data.user);
  return { ok: res.ok, data };
}

function apiLogout() { clearSession(); window.location.href = '../index.html'; }

// ── Projects ─────────────────────────────────────────────────
async function getProjects()           { return apiFetch('/projects'); }
async function createProject(payload)  { return apiFetch('/projects', { method:'POST', body: JSON.stringify(payload) }); }
async function updateProject(id, data) { return apiFetch(`/projects/${id}`, { method:'PUT', body: JSON.stringify(data) }); }
async function deleteProject(id)       { return apiFetch(`/projects/${id}`, { method:'DELETE' }); }

// ── Tasks ────────────────────────────────────────────────────
async function getProjectTasks(projectId)  { return apiFetch(`/projects/${projectId}/tasks`); }
async function createTask(payload)         { return apiFetch('/tasks', { method:'POST', body: JSON.stringify(payload) }); }
async function updateTask(id, data)        { return apiFetch(`/tasks/${id}`, { method:'PUT', body: JSON.stringify(data) }); }
async function deleteTask(id)              { return apiFetch(`/tasks/${id}`, { method:'DELETE' }); }
async function getUserTasks()              { return apiFetch('/tasks/mine'); }
