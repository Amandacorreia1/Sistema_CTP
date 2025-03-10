import express from 'express';
import {
    criarDemandaAluno,
    listarDemandasAlunos,
    buscarDemandaAlunoPorId
} from '../controllers/demandaalunoController.js';

const router = express.Router();
router.post('/demandaaluno', criarDemandaAluno);
router.get('/demandaaluno', listarDemandasAlunos);
router.get('/demanda-aluno/:id', buscarDemandaAlunoPorId);

export default router;
 