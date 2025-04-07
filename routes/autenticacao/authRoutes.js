import express from "express";
import { cadastrarUsuario, login } from "../../controllers/autenticacao/authController.js";
import {
  autenticarToken,
  authorizeRole,
} from "../../middlewares/authMiddlware.js";

const router = express.Router();

router.post(
  "/cadastro",
  autenticarToken,
  authorizeRole("Admin"),
  cadastrarUsuario
);
router.post("/login", login);

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Servidor está online" });
});

export default router;
