import express from 'express';
import { listarAmparoLegal, addAmparoLegal, removeAmparoLegal } from '../controllers/amparolegalController.js';

const router = express.Router();

router.get('/amparos-legais', listarAmparoLegal);
router.post('/amparos-legais', addAmparoLegal);
router.delete('/amparos-legais/:id', removeAmparoLegal);

export default router;
