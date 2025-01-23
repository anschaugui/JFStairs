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


const __dirname = path.resolve();


const publicPath = path.join(__dirname, 'backend', 'public');
const imgPath = path.join(publicPath, 'img');


app.use(express.static(publicPath)); 
app.use('/img', express.static(imgPath)); 


app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html')); 
});


app.post('/proxy', async (req, res) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby-3GwKqiHv9MT2KyLrNgyQ7qFeSpSM3MR0yA99yDOJ2A1TvOXoBQzAbAwis4M7GDVO/exec';

    const payload = {
        stairType: req.body.stairType || 'Not provided',
        stairLocation: req.body.stairLocation || 'Not provided',
        railingType: req.body.railingType || 'Not provided',
        treadType: req.body.treadType || 'Not provided',
        name: req.body.name || 'Not provided',
        lastName: req.body.lastName || 'Not provided',
        email: req.body.email || 'Not provided',
        phone: req.body.phone || 'Not provided',
        description: req.body.description || 'Not provided'
    };

    console.log('Payload enviado ao Google Apps Script:', payload);

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
            console.error('Erro ao processar os dados recebidos:', error.message);
            res.status(500).send('Erro ao processar os dados recebidos do Google Apps Script.');
        }
    } catch (error) {
        console.error('Erro ao enviar os dados para o Google Apps Script:', error.message);
        res.status(500).send('Erro ao enviar os dados para o Google Apps Script.');
    }
});


app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
    console.log(`Acesse em produção: https://jfstairs-6kyn.onrender.com`);
});
