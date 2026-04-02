// ============================================================
// WoorkFlow — routes/projects.js
// ============================================================

const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/projectsController');
const tasks   = require('../controllers/tasksController');

router.use(auth); // todas as rotas exigem login

router.get('/',           ctrl.list);
router.post('/',          ctrl.create);
router.put('/:id',        ctrl.update);
router.delete('/:id',     ctrl.remove);

// Tarefas por projeto
router.get('/:projectId/tasks', tasks.listByProject);

module.exports = router;
