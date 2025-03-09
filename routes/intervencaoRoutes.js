import express from 'express';
import {
    criarIntervencao,
    listarIntervencaoPorDemanda,
    listarIntervencao
} from '../controllers/intervencaoController.js';

const router = express.Router();

router.post('/intervencao', criarIntervencao);
router.get('/intervencao/:demanda_id', listarIntervencaoPorDemanda);
router.get('/intervencao', listarIntervencao);

export default router;
