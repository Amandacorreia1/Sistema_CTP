import express from 'express';
import { listarCargos, listarCargoPorId, cadastrarCargo } from '../controllers/cargoController.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';

const router = express.Router();

router.get('/cargos', autenticarToken, listarCargos);
router.get('/cargos/:id', autenticarToken, listarCargoPorId);
router.post('/cargos', autenticarToken, cadastrarCargo);

export default router;