import express from 'express';
import {
  listarIntervencoesDemandas,
  buscarIntervencaoDemandaPorId,
  criarIntervencaoDemanda
} from '../controllers/intervencaoDemandaController.js';

const router = express.Router();

router.post('/intervencoesdemandas', criarIntervencaoDemanda); 
router.get('/intervencoesdemandas', listarIntervencoesDemandas); 
router.get('/intervencoesdemandas/:id', buscarIntervencaoDemandaPorId);


export default router;
