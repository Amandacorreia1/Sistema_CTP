import express from "express";
import { cadastrarUsuario, login, recuperarSenha, redefinirSenha } from '../controllers/authController.js';
import { autenticarToken, authorizeRole } from '../middlewares/authMiddlware.js'; 

const router = express.Router();

router.post('/cadastro', autenticarToken, authorizeRole('Admin'), cadastrarUsuario);
router.post('/login', login);
router.post('/recuperar-senha', recuperarSenha);
router.post('/redefinir-senha', redefinirSenha)

export default router;