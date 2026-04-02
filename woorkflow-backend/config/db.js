// ============================================================
// WoorkFlow — config/db.js
// Conexão com o banco MySQL usando pool de conexões
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'woorkflow',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            'utf8mb4',
});

// Testa a conexão ao iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado com sucesso!');
    conn.release();
  } catch (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;
