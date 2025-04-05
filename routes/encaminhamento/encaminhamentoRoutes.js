import express from "express";
import {
  criarEncaminhamento,
  listarEncaminhamentosPorUsuario,
  listarEncaminhamentosPorDemanda,
  listarEncaminhamentos,
} from "../../controllers/encaminhamento/encaminhamentoController.js";
import { autenticarToken } from "../../middlewares/authMiddlware.js";
import { restringirAdmin } from "../../middlewares/restringirAdmin.js";

const router = express.Router();

router.get(
  "/encaminhamento",
  autenticarToken,
  restringirAdmin(),
  listarEncaminhamentos
);
router.get(
  "/encaminhamento/usuario/:id",
  autenticarToken,
  restringirAdmin(),
  listarEncaminhamentosPorUsuario
);
router.get(
  "/encaminhamento/demanda/:id",
  autenticarToken,
  restringirAdmin(),
  listarEncaminhamentosPorDemanda
);
router.post(
  "/encaminhamento",
  autenticarToken,
  restringirAdmin(),
  criarEncaminhamento
);

export default router;
