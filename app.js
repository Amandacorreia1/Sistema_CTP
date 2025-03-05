// app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import condicaoRoutes from './routes/condicoesRoutes.js';
import amparolegalRoutes from './routes/amparoLegalRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', condicaoRoutes); 
app.use('/api', amparolegalRoutes)

export default app;