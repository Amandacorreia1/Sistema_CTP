const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Servidor Express rodando! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
