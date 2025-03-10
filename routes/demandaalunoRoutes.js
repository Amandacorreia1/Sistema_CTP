import express from 'express';
import {
    criarDemandaAluno,
} from '../controllers/demandaalunoController.js';

const router = express.Router();
router.post('/demandaaluno', criarDemandaAluno);

export default router;
