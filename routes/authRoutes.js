import express from "express";
import { cadastrarUsuario, login } from "../controllers/authController.js";
import {
  autenticarToken,
  authorizeRole,
} from "../middlewares/authMiddlware.js";

const router = express.Router();

router.post(
  "/cadastro",
  autenticarToken,
  authorizeRole("Admin"),
  cadastrarUsuario
);
router.post("/login", login);
export default router;
