// ============================================================
// WoorkFlow — controllers/authController.js
// Lógica de cadastro e login
// ============================================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

// ── Gera as iniciais do avatar ──────────────────────────────
function makeAvatar(name) {
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

// ── Gera um JWT ─────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── POST /api/auth/register ─────────────────────────────────
async function register(req, res) {
  try {
    const { name, lastName, email, password } = req.body;

    // Validações básicas
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    }

    // Verifica se e-mail já existe
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Hash da senha
    const fullName     = `${name} ${lastName}`;
    const passwordHash = await bcrypt.hash(password, 12);
    const avatar       = makeAvatar(fullName);

    // Insere usuário
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
      [fullName, email.toLowerCase(), passwordHash, avatar]
    );

    const newUser = { id: result.insertId, name: fullName, email: email.toLowerCase() };
    const token   = generateToken(newUser);

    return res.status(201).json({
      message: 'Conta criada com sucesso!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, avatar },
    });

  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
}

// ── POST /api/auth/login ────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    // Busca usuário
    const [rows] = await db.query(
      'SELECT id, name, email, password, avatar FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const user = rows[0];

    // Compara senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    });

  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }
}

// ── GET /api/auth/me ────────────────────────────────────────
async function me(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error('[me]', err);
    return res.status(500).json({ error: 'Erro interno.' });
  }
}

module.exports = { register, login, me };
