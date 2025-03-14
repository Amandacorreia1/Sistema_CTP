import express from 'express';
import {
  listarIntervencoesDemandas,
  buscarIntervencaoDemandaPorId,
  criarIntervencaoDemanda
} from '../controllers/intervencaoDemandaController.js';

const router = express.Router();

router.post('/intervencoesdemandas', criarIntervencaoDemanda); 
router.get('/intervencoesdemandas', listarIntervencoesDemandas); 
router.get('/intervdemandas/:id', buscarIntervencaoDemandaPorId);


export default router;
