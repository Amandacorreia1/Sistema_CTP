import express from 'express';
import {listarCargos, listarCargoPorId,cadastrarCargo} from '../controllers/cargoController.js';

const router = express.Router();

router.get('/cargos',listarCargos);
router.get('/cargos/:id',listarCargoPorId);
router.post('/cargos',cadastrarCargo);

export default router;