import express from "express";
import {
  criarDemanda,
  listarDemandas,
  listarDemandasUsuario,
  listarDemandaPorId,
  fecharDemanda,
} from "../../controllers/demanda/demandaController.js";
import { autenticarToken } from "../../middlewares/authMiddlware.js";
import { restringirAdmin } from "../../middlewares/restringirAdmin.js";

const router = express.Router();

router.get("/demandas", autenticarToken, restringirAdmin(), listarDemandas);
router.post("/demandas", autenticarToken, restringirAdmin(), criarDemanda);
router.post("/minhas-demandas", autenticarToken, restringirAdmin(), listarDemandasUsuario);
router.get("/demandas/:id", autenticarToken, restringirAdmin(), listarDemandaPorId);
router.put("/demandas/:id/fechar", autenticarToken, restringirAdmin(), fecharDemanda);

export default router;
