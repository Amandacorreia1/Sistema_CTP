import express from 'express';
import { buscarAluno, listarAlunos } from '../controllers/alunoController.js';

const router = express.Router();

router.get('/alunos/:matricula', buscarAluno);
router.get('/alunos', listarAlunos);

export default router;
