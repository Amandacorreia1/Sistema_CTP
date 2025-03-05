// app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import condicaoRoutes from './routes/condicoesRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', condicaoRoutes); 

export default app;