import express from 'express';
import { criarDemanda, listarDemandas, listarNiveis, listarDemandasUsuario } from "../controllers/demandaController.js";
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';

const router = express.Router();

router.get('/demanda', autenticarToken, restringirAdmin(), listarDemandas);
router.post('/criar-demanda', autenticarToken, restringirAdmin(), criarDemanda);
router.get('/demandaniveis', autenticarToken, restringirAdmin(), listarNiveis);
router.get('/minhas-demandas', autenticarToken, listarDemandasUsuario);

export default router;
