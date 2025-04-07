import express from "express";

import { listarCursos, listarCursoPorId } from '../../controllers/curso/cursoController.js';
import { restringirAdmin } from '../../middlewares/restringirAdmin.js';
import { autenticarToken } from '../../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/cursos', autenticarToken, restringirAdmin(), listarCursos);
router.get('/cursos/:id', autenticarToken, restringirAdmin(), listarCursoPorId);

export default router;