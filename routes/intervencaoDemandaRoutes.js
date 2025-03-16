import express from 'express';
import {
  listarIntervencoesDemandas,
  buscarIntervencaoDemandaPorId,
  criarIntervencaoDemanda
} from '../controllers/intervencaoDemandaController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';


const router = express.Router();

router.post('/intervencoesdemandas', autenticarToken,  restringirAdmin(), criarIntervencaoDemanda); 
router.get('/intervencoesdemandas', autenticarToken,  restringirAdmin(), listarIntervencoesDemandas); 
router.get('/intervdemandas/:id', autenticarToken,  restringirAdmin(), buscarIntervencaoDemandaPorId);


export default router;
