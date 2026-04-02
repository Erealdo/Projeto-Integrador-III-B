// ============================================================
// WoorkFlow — controllers/tasksController.js
// ============================================================

const db = require('../config/db');

// GET /api/projects/:projectId/tasks
async function listByProject(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC',
      [req.params.projectId]
    );
    res.json({ tasks: rows });
  } catch (err) {
    console.error('[tasks.listByProject]', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
}

// GET /api/tasks/mine
async function mine(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT t.*, p.name AS project_name, p.color AS project_color
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       WHERE t.created_by = ? OR t.assignee_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id, req.user.id]
    );
    res.json({ tasks: rows });
  } catch (err) {
    console.error('[tasks.mine]', err);
    res.status(500).json({ error: 'Erro ao buscar tarefas.' });
  }
}

// POST /api/tasks
async function create(req, res) {
  try {
    const { project_id, title, description, priority, deadline, status, assignee_id } = req.body;
    if (!title || !project_id) return res.status(400).json({ error: 'Título e projeto são obrigatórios.' });

    const [result] = await db.query(
      'INSERT INTO tasks (project_id, title, description, priority, deadline, status, assignee_id, created_by) VALUES (?,?,?,?,?,?,?,?)',
      [project_id, title, description || null, priority || 'media', deadline || null, status || 'todo', assignee_id || req.user.id, req.user.id]
    );

    const [[task]] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json({ task });
  } catch (err) {
    console.error('[tasks.create]', err);
    res.status(500).json({ error: 'Erro ao criar tarefa.' });
  }
}

// PUT /api/tasks/:id
async function update(req, res) {
  try {
    const { title, description, priority, deadline, status, assignee_id } = req.body;
    const { id } = req.params;

    await db.query(
      'UPDATE tasks SET title=?, description=?, priority=?, deadline=?, status=?, assignee_id=? WHERE id=?',
      [title, description || null, priority || 'media', deadline || null, status || 'todo', assignee_id || req.user.id, id]
    );

    const [[task]] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json({ task });
  } catch (err) {
    console.error('[tasks.update]', err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
  }
}

// DELETE /api/tasks/:id
async function remove(req, res) {
  try {
    await db.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json({ message: 'Tarefa excluída.' });
  } catch (err) {
    console.error('[tasks.remove]', err);
    res.status(500).json({ error: 'Erro ao excluir tarefa.' });
  }
}

module.exports = { listByProject, mine, create, update, remove };
