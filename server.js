const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Disponibiliza os arquivos do site
app.use(express.static(path.join(__dirname, "public")));

// Rota inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicia o servidor
const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Lumina funcionando na porta ${PORTA}`);
});