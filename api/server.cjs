// Carrega as variáveis do arquivo .env para o processo
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001; // Porta em que a API vai rodar localmente

// --- Middlewares ---
// Habilita o CORS para permitir que o seu frontend acesse esta API
app.use(cors());
// Habilita o Express para entender requisições com corpo em formato JSON
app.use(express.json());

// --- Conexão com o Banco de Dados ---
// Cria um "pool" de conexões para otimizar o acesso ao banco
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
// Rota principal para salvar os dados do lead, acessível via POST
app.post('/api/save-lead', async (req, res) => {
  // Extrai os dados que o frontend enviou no corpo (body) da requisição
  const { name, email, phone, instagram, field, lgpdAccepted } = req.body;

  // Validação básica para garantir que os campos essenciais foram enviados
  if (!name || !email) {
    return res.status(400).json({ message: 'Nome e E-mail são obrigatórios.' });
  }

  try {
    // Comando SQL para inserir um novo registro na tabela 'leads'
    const sql = 'INSERT INTO leads (name, email, phone, instagram, field, lgpd_accepted) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, email, phone, instagram, field, lgpdAccepted];

    // Executa o comando SQL no banco de dados
    await dbPool.query(sql, values);

    console.log('Lead salvo com sucesso:', req.body);
    res.status(200).json({ message: 'Dados salvos com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar salvar os dados.' });
  }
});

// Inicia o servidor da API
app.listen(port, () => {
  console.log(`Servidor da API rodando em http://localhost:${port}`);
});