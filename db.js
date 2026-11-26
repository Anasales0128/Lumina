const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Cria ou abre o banco de dados
const db = new sqlite3.Database(
    path.join(__dirname, "..", "lumina.db"),
    (erro) => {
        if (erro) {
            console.error("Erro ao conectar ao banco:", erro.message);
        } else {
            console.log("Banco de dados Lumina conectado!");
        }
    }
);

// Cria as tabelas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS publicacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            conteudo TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS comentarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publicacao_id INTEGER,
            usuario_id INTEGER,
            conteudo TEXT NOT NULL,
            FOREIGN KEY (publicacao_id) REFERENCES publicacoes(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);
});

module.exports = db;