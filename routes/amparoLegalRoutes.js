import express from 'express';
import { listarAmparoLegal, addAmparoLegal, removeAmparoLegal } from '../controllers/amparolegalController.js';
import { restringirAdmin } from '../middlewares/restringirAdmin.js';
import { autenticarToken } from '../middlewares/authMiddlware.js';


const router = express.Router();

router.get('/amparos-legais', autenticarToken, restringirAdmin(), listarAmparoLegal);
router.post('/amparos-legais', autenticarToken, restringirAdmin(), addAmparoLegal);
router.delete('/amparos-legais/:id', autenticarToken, restringirAdmin(), removeAmparoLegal);

export default router;
