import express from "express";

import { listarCondicoes, addCondicao, removeCondicao } from '../../controllers/condicao/condicaoController.js';
import { restringirAdmin } from '../../middlewares/restringirAdmin.js';
import { autenticarToken } from '../../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/condicoes', autenticarToken, restringirAdmin(), listarCondicoes);
router.post('/condicoes', autenticarToken, restringirAdmin(), addCondicao);
router.delete('/condicoes/:id', autenticarToken, restringirAdmin(), removeCondicao);

export default router;