import fetch from 'node-fetch';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3002;

// Middleware para adicionar cabeçalhos CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// Caminho para a raiz do projeto
const __dirname = path.resolve();

// Ajuste para localizar a pasta 'public' e a pasta 'img' com base na estrutura fornecida
const publicPath = path.join(__dirname, 'backend', 'public'); // Corrigido para buscar dentro de 'backend'
const imgPath = path.join(publicPath, 'img'); // Pasta 'img' está dentro de 'public'

// Servir arquivos estáticos das pastas 'public' e 'img'
app.use(express.static(publicPath)); // Arquivos da pasta 'public'
app.use('/img', express.static(imgPath)); // Arquivos da pasta 'img' dentro de 'public'

// Rota para enviar o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html')); // Envia o index.html da pasta 'public'
});

// Rota para proxy (integrada com Google Apps Script)
app.post('/proxy', async (req, res) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby-3GwKqiHv9MT2KyLrNgyQ7qFeSpSM3MR0yA99yDOJ2A1TvOXoBQzAbAwis4M7GDVO/exec';
    const payload = {
        stairType: req.body.stairType,
        stairLocation: req.body.stairLocation,
        railingType: req.body.railingType,
        treadType: req.body.treadType,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (error) {
            res.status(500).send('Erro ao processar os dados recebidos.');
        }
    } catch (error) {
        res.status(500).send('Erro ao enviar os dados.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
    console.log(`Acesse em produção: https://jfstairs-6kyn.onrender.com`);
});
