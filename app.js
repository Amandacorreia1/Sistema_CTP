// app.js
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import condicaoRoutes from './routes/condicoesRoutes.js';
import amparolegalRoutes from './routes/amparoLegalRoutes.js';
import encaminhamentoRoutes from './routes/encaminhamentoRoutes.js';
import demandaRoutes from './routes/demandaRoutes.js';
import intervencaoRoutes from './routes/intervencaoRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import intervencaoDemandaRoutes from './routes/intervencaoDemandaRoutes.js';
import demandaAlunoRoutes from './routes/demandaalunoRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', condicaoRoutes); 
app.use('/api', amparolegalRoutes);
app.use('/api', encaminhamentoRoutes);
app.use('/api', demandaRoutes);
app.use('/api', intervencaoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', alunoRoutes);
app.search('/api', intervencaoDemandaRoutes);
app.use('/api', demandaAlunoRoutes);

export default app;