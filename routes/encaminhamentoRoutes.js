import express from 'express';
import { criarEncaminhamento,listarEncaminhamentosPorUsuario,listarEncaminhamentosPorDemanda,listarEncaminhamentos } from "../controllers/encaminhamentoController.js";

const router = express.Router();

router.get('/encaminhamento',listarEncaminhamentos);
router.get('/encaminhamento/usuario/:id',listarEncaminhamentosPorUsuario);
router.get('/encaminhamento/demanda/:id',listarEncaminhamentosPorDemanda);
router.post('/encaminhamento',criarEncaminhamento);


export default router;