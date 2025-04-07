import express from "express";
import { criarEncaminhamento } from "../../controllers/encaminhamento/encaminhamentoController.js";
import { autenticarToken } from "../../middlewares/authMiddlware.js";
import { restringirAdmin } from "../../middlewares/restringirAdmin.js";

const router = express.Router();

router.post(
  "/encaminhamento",
  autenticarToken,
  restringirAdmin(),
  criarEncaminhamento
);

export default router;
