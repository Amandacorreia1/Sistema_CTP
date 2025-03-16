import express from 'express';
import {
    criarDemandaAluno,
    listarDemandasAlunos,
    buscarDemandaAlunoPorId
} from '../controllers/demandaalunoController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';

const router = express.Router();
router.post('/demandaaluno',autenticarToken, criarDemandaAluno);
router.get('/demandaaluno',autenticarToken, listarDemandasAlunos);
router.get('/demanda-aluno/:id',autenticarToken, buscarDemandaAlunoPorId);

export default router;
 