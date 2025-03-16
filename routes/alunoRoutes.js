import express from 'express';
import { buscarAluno, listarAlunos } from '../controllers/alunoController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';

const router = express.Router();

router.get('/alunos/:matricula', autenticarToken, restringirAdmin(), buscarAluno);
router.get('/alunos', autenticarToken, restringirAdmin(), listarAlunos);

export default router;
