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

// Middleware para servir arquivos estáticos
const __dirname = path.resolve();

// Caminho para a pasta 'public' dentro de 'backend'
const publicPath = path.join(__dirname, 'backend', 'public'); // Caminho para a pasta 'public'
const imgPath = path.join(__dirname, 'backend', 'public', 'img'); // Caminho para as imagens dentro de 'public'

// Servindo arquivos estáticos das pastas 'public' e 'img'
app.use(express.static(publicPath)); // Arquivos da pasta 'public'
app.use('/img', express.static(imgPath)); // Arquivos da pasta 'img'

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html')); // Envia o index.html da pasta 'public'
});

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
            res.status(500).send('Erro ao processar os dados recebidos do Google Script.');
        }
    } catch (error) {
        res.status(500).send('Erro ao enviar os dados para o Google Script.');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
