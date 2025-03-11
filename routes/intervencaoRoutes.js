import express from 'express';
import {
    criarIntervencao,
    listarIntervencao
} from '../controllers/intervencaoController.js';

const router = express.Router();

router.post('/intervencao', criarIntervencao);
router.get('/intervencao', listarIntervencao);

export default router;
