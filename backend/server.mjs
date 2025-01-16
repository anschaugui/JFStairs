import fetch from 'node-fetch';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3002;

// Middleware para adicionar cabeçalhos CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permite acesso de qualquer origem
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// Caminho para a raiz do projeto
const __dirname = path.resolve();

// Localiza a pasta 'public' e a pasta 'img'
const publicPath = path.join(__dirname, 'backend', 'public');
const imgPath = path.join(publicPath, 'img');

// Servir arquivos estáticos das pastas 'public' e 'img'
app.use(express.static(publicPath)); // Servir arquivos da pasta 'public'
app.use('/img', express.static(imgPath)); // Servir arquivos da pasta 'img' dentro de 'public'

// Rota para enviar o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html')); // Envia o index.html da pasta 'public'
});

// Rota para proxy (integrada com Google Apps Script)
app.post('/proxy', async (req, res) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby-3GwKqiHv9MT2KyLrNgyQ7qFeSpSM3MR0yA99yDOJ2A1TvOXoBQzAbAwis4M7GDVO/exec';

    // Captura os dados enviados pelo cliente
    const payload = {
        stairType: req.body.stairType || 'Not provided',
        stairLocation: req.body.stairLocation || 'Not provided',
        railingType: req.body.railingType || 'Not provided',
        treadType: req.body.treadType || 'Not provided',
        name: req.body.name || 'Not provided',
        email: req.body.email || 'Not provided',
        phone: req.body.phone || 'Not provided'
    };

    console.log('Payload enviado ao Google Apps Script:', payload);

    try {
        // Envia os dados para o Google Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        // Tenta processar a resposta do Google Apps Script
        try {
            const data = JSON.parse(text);
            res.json(data); // Envia a resposta processada ao cliente
        } catch (error) {
            console.error('Erro ao processar os dados recebidos:', error.message);
            res.status(500).send('Erro ao processar os dados recebidos do Google Apps Script.');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados para o Google Apps Script:', error.message);
        res.status(500).send('Erro ao enviar os dados para o Google Apps Script.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
    console.log(`Acesse em produção: https://jfstairs-6kyn.onrender.com`);
});
