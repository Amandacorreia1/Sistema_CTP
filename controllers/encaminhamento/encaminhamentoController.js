import dotenv from "dotenv";
import CriarEncaminhamento from "./CriarEncaminhamento.js";

dotenv.config();

export const criarEncaminhamento = async (req, res) => {
  try {
    const result = await CriarEncaminhamento.execute(req);
    return res.status(201).json({
      ...result,
      mensagem: "Encaminhamento realizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao processar encaminhamento:", error);
    return res
      .status(
        error.message.includes("não encontrada") ||
          error.message.includes("não encontrado")
          ? 404
          : error.message.includes("permissão")
          ? 403
          : error.message.includes("obrigatório") ||
            error.message.includes("válida") ||
            error.message.includes("única pessoa")
          ? 400
          : 500
      )
      .json({ error: error.message });
  }
};
