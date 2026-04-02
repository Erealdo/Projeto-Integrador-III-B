// ============================================================
// WoorkFlow — server.js
// ============================================================

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rotas ────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks',    require('./routes/tasks'));

app.get('/', (req, res) => res.json({ message: '✅ WoorkFlow API rodando!' }));

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
