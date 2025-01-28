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
    const scriptURL = 'https://script.google.com/macros/s/AKfycby9GkUh50sOFEcvAwIm7ov3ubBcsQqwAgSQbM38gkETkjPB35YlyOkVYFZBhSXgP47-/exec';

    const payload = {
        stairType: req.body.stairType || 'Not provided',
        stairLocation: req.body.stairLocation || 'Not provided',
        railingType: req.body.railingType || 'Not provided',
        treadType: req.body.treadType || 'Not provided',
        name: req.body.name || 'Not provided',
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

        console.log('Resposta do Google Apps Script:', response);
        
        // Verifica se o status da resposta é 200 (OK)
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro ao acessar Google Apps Script:', errorText);
            res.status(response.status).send(`Erro ao acessar o script: ${response.statusText}`);
            return;
        }

        const text = await response.text();
        console.log('Texto da resposta:', text);

        // Verifique se a resposta é JSON antes de tentar fazer o JSON.parse()
        if (text && text.includes('{')) {
            try {
                const data = JSON.parse(text);
                res.json(data);
            } catch (error) {
                console.error('Erro ao processar dados JSON:', error.message);
                res.status(500).send('Erro ao processar dados recebidos do Google Apps Script.');
            }
        } else {
            res.status(500).send('Resposta do Google Apps Script não é válida ou inesperada.');
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
