import express from 'express';
import { buscarTodosUsuarios, buscarUsuariosPorId, buscarUsuarioPorNome, editarUsuario, excluirUsuario, usuariosPorCargo } from '../controllers/usuarioController.js';
import { autenticarToken, authorizeRole } from '../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/usuarios', autenticarToken, authorizeRole('Admin'), buscarTodosUsuarios);
router.get('/usuarios/cargo/:cargo', autenticarToken, authorizeRole('Admin'), usuariosPorCargo);
router.get('/usuarios/:nome', autenticarToken, authorizeRole('Admin'), buscarUsuarioPorNome);
router.get('/usuario/:id', autenticarToken, authorizeRole('Admin'), buscarUsuariosPorId);
router.put('/usuario/:id', autenticarToken, authorizeRole('Admin'), editarUsuario);
router.delete('/usuario/:id', autenticarToken, authorizeRole('Admin'), excluirUsuario);

export default router;

