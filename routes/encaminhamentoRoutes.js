import express from 'express';
import { criarEncaminhamento,listarEncaminhamentosPorUsuario,listarEncaminhamentosPorDemanda,listarEncaminhamentos } from "../controllers/encaminhamentoController.js";
import { autenticarToken } from '../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/encaminhamento',autenticarToken,listarEncaminhamentos);
router.get('/encaminhamento/usuario/:id',autenticarToken,listarEncaminhamentosPorUsuario);
router.get('/encaminhamento/demanda/:id',autenticarToken,listarEncaminhamentosPorDemanda);
router.post('/encaminhamento',autenticarToken,criarEncaminhamento);


export default router;