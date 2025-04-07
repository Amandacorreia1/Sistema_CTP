import express from "express";
import {
  recuperarSenha,
  redefinirSenha,
} from "../../controllers/senha/passwordController.js";

const router = express.Router();

router.post("/recuperar-senha", recuperarSenha);
router.post("/redefinir-senha/:token", redefinirSenha);

export default router;
