import express from 'express';
import {
  buscarTodosUsuarios,
  buscarUsuariosPorId,
  buscarUsuarioPorNome,
  editarUsuario,
  excluirUsuario,
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/usuarios', buscarTodosUsuarios); 
router.get('/usuarios/:nome', buscarUsuarioPorNome); 
router.get('/usuarios/:id', buscarUsuariosPorId); 
router.put('/usuarios/:id', editarUsuario);
router.delete('/usuarios/:id', excluirUsuario);

export default router;
