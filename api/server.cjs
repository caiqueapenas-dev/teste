// Carrega as variáveis do arquivo .env para o processo
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path'); // CORREÇÃO: Adicionada a importação do 'path'

const app = express();
// Usa a porta definida pelo ambiente (Hostinger) ou 3001 para testes locais
const port = process.env.PORT || 3001;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos da pasta 'dist' (seu site React 'buildado')
app.use(express.static(path.join(__dirname, '..', 'dist')));

// --- Conexão com o Banco de Dados ---
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Rotas da API ---

// Rota principal para salvar os dados do lead
app.post('/api/save-lead', async (req, res) => {
  const { name, email, phone, instagram, field, lgpdAccepted } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e E-mail são obrigatórios.' });
  }

  try {
    const sql = 'INSERT INTO leads (name, email, phone, instagram, field, lgpd_accepted) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, email, phone, instagram, field, lgpdAccepted];
    
    await dbPool.query(sql, values);
    
    console.log('Lead salvo com sucesso:', req.body);
    res.status(200).json({ message: 'Dados salvos com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar salvar os dados.' });
  }
});

// CORREÇÃO: A rota "catch-all" foi movida para o final.
// Ela deve ser a última rota para não interferir com a API.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Inicia o servidor da API
app.listen(port, () => {
  console.log(`Servidor da API rodando na porta ${port}`);
});