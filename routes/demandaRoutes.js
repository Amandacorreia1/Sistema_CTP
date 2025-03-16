import express from 'express';
import { criarDemanda, listarDemandas } from "../controllers/demandaController.js";

const router = express.Router();

import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';


router.get('/demanda', autenticarToken,  restringirAdmin(), listarDemandas);
router.post('/demanda', autenticarToken,  restringirAdmin(), criarDemanda);

export default router;
