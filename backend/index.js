const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
    host: 'benserverplex.ddns.net',
    port: 3306,
    user: 'alunos',
    password: 'senhaAlunos',
    database: 'alunos_backend_03MC'
});

// O nome da sua tabela (substitua se necessário)
const TABELA = 'musicas_pedrootavio';

// Listar todas as músicas
app.get('/musicas', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${TABELA}`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Buscar uma música por ID
app.get('/musicas/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM ${TABELA} WHERE id = ?`, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ erro: 'Música não encontrada' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Cadastrar nova música
app.post('/musicas', async (req, res) => {
    const { titulo, artista, genero, ano, duracao } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO ${TABELA} (titulo, artista, genero, ano, duracao) VALUES (?, ?, ?, ?, ?)`,
            [titulo, artista, genero, ano, duracao]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar música
app.put('/musicas/:id', async (req, res) => {
    const { titulo, artista, genero, ano, duracao } = req.body;
    try {
        await pool.query(
            `UPDATE ${TABELA} SET titulo=?, artista=?, genero=?, ano=?, duracao=? WHERE id=?`,
            [titulo, artista, genero, ano, duracao, req.params.id]
        );
        res.json({ mensagem: 'Música atualizada' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Apagar música
app.delete('/musicas/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM ${TABELA} WHERE id=?`, [req.params.id]);
        res.json({ mensagem: 'Música apagada' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});