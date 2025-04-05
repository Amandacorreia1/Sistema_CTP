// app.js
import express from "express";
import authRoutes from "./routes/autenticacao/authRoutes.js";
import condicaoRoutes from "./routes/condicao/condicoesRoutes.js"
import amparolegalRoutes from "./routes/amparoLegal/amparoLegalRoutes.js";
import encaminhamentoRoutes from "./routes/encaminhamento/encaminhamentoRoutes.js";
import demandaRoutes from "./routes/demanda/demandaRoutes.js";
import intervencaoRoutes from "./routes/intervencao/intervencaoRoutes.js";
import usuarioRoutes from "./routes/usuario/usuarioRoutes.js";
import alunoRoutes from "./routes/aluno/alunoRoutes.js";
import intervencaoDemandaRoutes from "./routes/intervencaoDemanda/intervencaoDemandaRoutes.js";
import cargoRoutes from "./routes/cargo/cargoRoutes.js";
import cursoRoutes from "./routes/curso/cursoRoutes.js";
import passwordRoutes from "./routes/senha/passwordRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", condicaoRoutes);
app.use("/api", amparolegalRoutes);
app.use("/api", encaminhamentoRoutes);
app.use("/api", demandaRoutes);
app.use("/api", intervencaoRoutes);
app.use("/api", usuarioRoutes);
app.use("/api", alunoRoutes);
app.use("/api", intervencaoDemandaRoutes);
app.use("/api", cargoRoutes);
app.use("/api", cursoRoutes);
app.use("/api", passwordRoutes);
export default app;
