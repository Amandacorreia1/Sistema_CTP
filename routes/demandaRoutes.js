import express from "express";
import {
  criarDemanda,
  listarDemandas,
  listarDemandasUsuario,
  listarDemandaPorId,
  fecharDemanda,
} from "../controllers/demandaController.js";
import { autenticarToken } from "../middlewares/authMiddlware.js";
import { restringirAdmin } from "../middlewares/restringirAdmin.js";

const router = express.Router();

router.get("/demanda", autenticarToken, restringirAdmin(), listarDemandas);
router.post("/criar-demanda", autenticarToken, restringirAdmin(), criarDemanda);
router.get(
  "/minhas-demandas",
  autenticarToken,
  restringirAdmin(),
  listarDemandasUsuario
);
router.get(
  "/demandas/:id",
  autenticarToken,
  restringirAdmin(),
  listarDemandaPorId
);
router.put("/:id/fechar", autenticarToken, restringirAdmin(), fecharDemanda);

export default router;
