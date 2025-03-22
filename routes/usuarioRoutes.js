import express from 'express';
import { buscarTodosUsuarios, buscarUsuariosPorId, buscarUsuarioPorNome, editarUsuario, excluirUsuario, usuariosPorCargo, UsuariosPorNomeOuCargo } from '../controllers/usuarioController.js';
import { autenticarToken, authorizeRole } from '../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/usuarios', autenticarToken, buscarTodosUsuarios);
router.get('/usuarios/cargo/:cargo', autenticarToken, authorizeRole('Admin'), usuariosPorCargo);
router.get('/usuarios/:nome', autenticarToken, authorizeRole('Admin'), buscarUsuarioPorNome);
router.get('/usuario/:id', autenticarToken, authorizeRole('Admin'), buscarUsuariosPorId);
router.put('/usuario/:id', autenticarToken, authorizeRole('Admin'), editarUsuario);
router.delete('/usuario/:id', autenticarToken, authorizeRole('Admin'), excluirUsuario);
router.get('/usuarios/busca/:termo', autenticarToken, authorizeRole('Admin'), UsuariosPorNomeOuCargo);

export default router;

