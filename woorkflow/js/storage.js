/* ============================================================
   WoorkFlow — storage.js
   Gerenciamento de dados no localStorage
   ============================================================ */

const WF = {

  /* ── Keys ── */
  KEYS: {
    users:    'wf_users',
    session:  'wf_session',
    projects: 'wf_projects',
    tasks:    'wf_tasks',
  },

  /* ── Generic ── */
  get(key)       { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } },
  set(key, val)  { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key)    { localStorage.removeItem(key); },

  /* ── Users ── */
  getUsers()          { return this.get(this.KEYS.users) || []; },
  saveUsers(users)    { this.set(this.KEYS.users, users); },
  findUserByEmail(email) { return this.getUsers().find(u => u.email === email); },
  findUserById(id)    { return this.getUsers().find(u => u.id === id); },

  registerUser({ name, lastName, email, password }) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return { error: 'E-mail já cadastrado.' };
    const user = {
      id: Date.now(),
      name: `${name} ${lastName}`,
      email,
      password: btoa(password),
      avatar: name[0].toUpperCase() + (lastName[0] || '').toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    this.saveUsers(users);
    return { user };
  },

  loginUser(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === btoa(password));
    if (!user) return { error: 'E-mail ou senha incorretos.' };
    const session = { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
    this.set(this.KEYS.session, session);
    return { user: session };
  },

  /* ── Session ── */
  getSession()  { return this.get(this.KEYS.session); },
  logout()      { this.remove(this.KEYS.session); },
  isLoggedIn()  { return !!this.getSession(); },

  /* ── Projects ── */
  getProjects()       { return this.get(this.KEYS.projects) || []; },
  saveProjects(list)  { this.set(this.KEYS.projects, list); },

  getUserProjects() {
    const session = this.getSession();
    if (!session) return [];
    return this.getProjects().filter(p =>
      p.ownerId === session.id || (p.members || []).includes(session.id)
    );
  },

  createProject({ name, description, deadline, color }) {
    const session = this.getSession();
    const projects = this.getProjects();
    const project = {
      id: Date.now(),
      name, description,
      deadline: deadline || null,
      color: color || '#2563eb',
      ownerId: session.id,
      members: [session.id],
      createdAt: new Date().toISOString(),
    };
    projects.push(project);
    this.saveProjects(projects);
    return project;
  },

  updateProject(id, data) {
    const projects = this.getProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return null;
    projects[idx] = { ...projects[idx], ...data };
    this.saveProjects(projects);
    return projects[idx];
  },

  deleteProject(id) {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveProjects(projects);
    // also delete tasks
    const tasks = this.getTasks().filter(t => t.projectId !== id);
    this.saveTasks(tasks);
  },

  /* ── Tasks ── */
  getTasks()      { return this.get(this.KEYS.tasks) || []; },
  saveTasks(list) { this.set(this.KEYS.tasks, list); },

  getProjectTasks(projectId) {
    return this.getTasks().filter(t => t.projectId === projectId);
  },

  getUserTasks() {
    const session = this.getSession();
    if (!session) return [];
    return this.getTasks().filter(t => t.assigneeId === session.id || t.createdBy === session.id);
  },

  createTask({ projectId, title, description, priority, deadline, status, assigneeId }) {
    const session = this.getSession();
    const tasks = this.getTasks();
    const task = {
      id: Date.now(),
      projectId,
      title,
      description: description || '',
      priority: priority || 'media',
      deadline: deadline || null,
      status: status || 'todo',
      assigneeId: assigneeId || session.id,
      createdBy: session.id,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    this.saveTasks(tasks);
    return task;
  },

  updateTask(id, data) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...data };
    this.saveTasks(tasks);
    return tasks[idx];
  },

  deleteTask(id) {
    this.saveTasks(this.getTasks().filter(t => t.id !== id));
  },

  /* ── Stats ── */
  getStats() {
    const projects = this.getUserProjects();
    const tasks    = this.getUserTasks();
    const now      = new Date();
    return {
      totalProjects:  projects.length,
      totalTasks:     tasks.length,
      doneTasks:      tasks.filter(t => t.status === 'done').length,
      doingTasks:     tasks.filter(t => t.status === 'doing').length,
      overdueTasks:   tasks.filter(t => t.deadline && new Date(t.deadline) < now && t.status !== 'done').length,
    };
  },
};
