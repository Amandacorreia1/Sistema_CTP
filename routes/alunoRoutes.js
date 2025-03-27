import express from 'express';
import { cadastrarAluno, buscarAluno, listarAlunos, adicionarCondicao, atualizarAluno} from '../controllers/alunoController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';

const router = express.Router();

router.post('/cadastrar-aluno', autenticarToken, restringirAdmin(), cadastrarAluno);
router.get('/alunos/:matricula', autenticarToken, restringirAdmin(), buscarAluno);
router.get('/alunos', autenticarToken, restringirAdmin(), listarAlunos);
router.post('/alunos/adicionar-condicao', autenticarToken, restringirAdmin(), adicionarCondicao);
router.put('/editar-aluno/:matricula',  autenticarToken, restringirAdmin(), atualizarAluno);

export default router;
