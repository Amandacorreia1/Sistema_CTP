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
import cargoRoutes from './routes/cargoRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true 
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', condicaoRoutes); 
app.use('/api', amparolegalRoutes);
app.use('/api', encaminhamentoRoutes);
app.use('/api', demandaRoutes);
app.use('/api', intervencaoRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', alunoRoutes);
app.use('/api', intervencaoDemandaRoutes);
app.use('/api', demandaAlunoRoutes);
app.use('/api', cargoRoutes);
app.use('/api', cursoRoutes);
export default app;