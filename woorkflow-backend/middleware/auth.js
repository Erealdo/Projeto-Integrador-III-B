// ============================================================
// WoorkFlow — middleware/auth.js
// Valida o token JWT em rotas protegidas
// ============================================================

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Aceita token no header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido. Faça login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;
