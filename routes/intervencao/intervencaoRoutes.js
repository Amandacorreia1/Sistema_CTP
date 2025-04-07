import express from 'express';
import { criarIntervencao, listarIntervencao } from '../../controllers/intervencao/intervencaoController.js';
import { autenticarToken } from '../../middlewares/authMiddlware.js';
import { restringirAdmin } from '../../middlewares/restringirAdmin.js';

const router = express.Router();

router.post('/intervencao', autenticarToken, restringirAdmin(), criarIntervencao);
router.get('/intervencao', autenticarToken, restringirAdmin(), listarIntervencao);

export default router;