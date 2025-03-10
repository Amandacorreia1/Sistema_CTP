import express from 'express';
import {
    criarDemandaAluno,
    listarDemandasAluno
} from '../controllers/demandaalunoController.js';

const router = express.Router();
router.post('/demandaaluno', criarDemandaAluno);
router.get('/demandasaluno', listarDemandasAluno);

export default router;
