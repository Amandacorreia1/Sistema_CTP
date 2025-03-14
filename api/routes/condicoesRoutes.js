import express from "express";

import { listarCondicoes, addCondicao, removeCondicao } from '../controllers/condicaoController.js';

const router = express.Router();

router.get('/condicoes', listarCondicoes);
router.post('/condicoes', addCondicao);
router.delete('/condicoes/:id', removeCondicao);

export default router;