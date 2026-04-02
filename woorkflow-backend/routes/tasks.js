// ============================================================
// WoorkFlow — routes/tasks.js
// ============================================================

const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const ctrl    = require('../controllers/tasksController');

router.use(auth);

router.get('/mine', ctrl.mine);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
