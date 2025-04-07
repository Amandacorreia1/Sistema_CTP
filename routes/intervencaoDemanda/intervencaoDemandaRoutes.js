import express from 'express';
import { listarIntervencoesDemandas, buscarIntervencaoDemandaPorId, criarIntervencaoDemanda } from '../../controllers/intervencaoDemanda/intervencaoDemandaController.js';
import { autenticarToken } from '../../middlewares/authMiddlware.js';
import { restringirAdmin } from '../../middlewares/restringirAdmin.js';

const router = express.Router();

router.post('/intervencoes-demandas', autenticarToken, restringirAdmin(), criarIntervencaoDemanda);
router.get('/intervencoes-demandas', autenticarToken, restringirAdmin(), listarIntervencoesDemandas);
router.get('/intervdemandas/:id', autenticarToken, restringirAdmin(), buscarIntervencaoDemandaPorId);

export default router;