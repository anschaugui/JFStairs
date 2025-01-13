import fetch from 'node-fetch';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3002; // Alterar a porta para 3002

// Middleware para adicionar cabeçalhos CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

// Servir arquivos estáticos
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '..', 'formulario-jf')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'formulario-jf', 'index.html'));
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

    console.log('Recebendo dados:', req.body); // Log dos dados recebidos
    console.log('Email:', req.body.email); // Log do email recebido
    console.log('Phone:', req.body.phone); // Log do telefone recebido

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Status da resposta:', response.status); // Log do status da resposta
        console.log('Cabeçalhos da resposta:', response.headers.raw()); // Log dos cabeçalhos da resposta

        const text = await response.text(); // Obtenha a resposta como texto
        console.log('Resposta do Google Apps Script:', text); // Log da resposta

        // Tente parsear a resposta como JSON
        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (error) {
            console.error('Erro ao parsear a resposta como JSON:', error);
            res.status(500).send('Erro ao enviar os dados.');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
        res.status(500).send('Erro ao enviar os dados.');
    }
});

app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
});