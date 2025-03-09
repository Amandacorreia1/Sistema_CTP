import express from 'express';
import { criarDemanda, listarDemandas } from "../controllers/demandaController";

const router = express.Router();

router.get('/demanda', listarDemandas);
router.post('/demanda', criarDemanda);

export default router;
