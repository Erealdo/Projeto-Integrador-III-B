// ============================================================
// WoorkFlow — routes/auth.js
// Rotas de autenticação
// ============================================================

const express    = require('express');
const router     = express.Router();
const auth       = require('../middleware/auth');
const controller = require('../controllers/authController');

// POST /api/auth/register — cria conta
router.post('/register', controller.register);

// POST /api/auth/login — faz login
router.post('/login', controller.login);

// GET /api/auth/me — retorna usuário logado (rota protegida)
router.get('/me', auth, controller.me);

module.exports = router;
