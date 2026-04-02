// ============================================================
// WoorkFlow — controllers/projectsController.js
// ============================================================

const db = require('../config/db');

// GET /api/projects
async function list(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS task_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') AS done_count
       FROM projects p
       INNER JOIN project_members pm ON pm.project_id = p.id
       WHERE pm.user_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ projects: rows });
  } catch (err) {
    console.error('[projects.list]', err);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
}

// POST /api/projects
async function create(req, res) {
  try {
    const { name, description, color, deadline } = req.body;
    if (!name) return res.status(400).json({ error: 'Informe o nome do projeto.' });

    const [result] = await db.query(
      'INSERT INTO projects (name, description, color, deadline, owner_id) VALUES (?,?,?,?,?)',
      [name, description || null, color || '#2563eb', deadline || null, req.user.id]
    );
    const projectId = result.insertId;

    // Adiciona criador como membro owner
    await db.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?,?,?)',
      [projectId, req.user.id, 'owner']
    );

    const [[project]] = await db.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.status(201).json({ project });
  } catch (err) {
    console.error('[projects.create]', err);
    res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
}

// PUT /api/projects/:id
async function update(req, res) {
  try {
    const { name, description, color, deadline } = req.body;
    const { id } = req.params;

    await db.query(
      'UPDATE projects SET name=?, description=?, color=?, deadline=? WHERE id=? AND owner_id=?',
      [name, description || null, color || '#2563eb', deadline || null, id, req.user.id]
    );

    const [[project]] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    res.json({ project });
  } catch (err) {
    console.error('[projects.update]', err);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
}

// DELETE /api/projects/:id
async function remove(req, res) {
  try {
    await db.query('DELETE FROM projects WHERE id=? AND owner_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Projeto excluído.' });
  } catch (err) {
    console.error('[projects.remove]', err);
    res.status(500).json({ error: 'Erro ao excluir projeto.' });
  }
}

module.exports = { list, create, update, remove };
