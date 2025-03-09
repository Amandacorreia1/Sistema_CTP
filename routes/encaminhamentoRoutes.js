import express from 'express';
import { criarEncaminhamento,listarEncaminhamentosPorUsuario,listarEncaminhamentosPorDemanda,listarEncaminhamentos,editarEncaminhamento,excluirEncaminhamento } from "../controllers/encaminhamentoController.js";

const router = express.Router();

router.get('/encaminhamento',listarEncaminhamentos);
router.get('/encaminhamento/usuario/:id',listarEncaminhamentosPorUsuario);
router.get('/encaminhamento/demanda/:id',listarEncaminhamentosPorDemanda);
router.post('/encaminhamento',criarEncaminhamento);
router.put('/encaminhamento/:id',editarEncaminhamento);
router.delete('/encaminhamento/:id',excluirEncaminhamento);

export default router;