import express from 'express';
import { criarDemandaAluno, listarDemandasAlunos, buscarDemandaAlunoPorId } from '../controllers/demandaalunoController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';

const router = express.Router();
router.post('/demandaaluno', autenticarToken, restringirAdmin(), criarDemandaAluno);
router.get('/demandaaluno', autenticarToken, restringirAdmin(), listarDemandasAlunos);
router.get('/demanda-aluno/:id', autenticarToken, restringirAdmin(), buscarDemandaAlunoPorId);

export default router;
