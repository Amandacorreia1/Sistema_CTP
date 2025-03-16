import express from 'express';
import { criarDemanda, listarDemandas } from "../controllers/demandaController.js";
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';

const router = express.Router();

router.get('/demanda', autenticarToken, restringirAdmin(), listarDemandas);
router.post('/demanda', autenticarToken, restringirAdmin(), criarDemanda);

export default router;
