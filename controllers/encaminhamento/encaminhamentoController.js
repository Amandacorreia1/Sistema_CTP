import dotenv from "dotenv";
import CriarDemanda from "./CriarDemanda.js";
import CriarEncaminhamento from "./CriarEncaminhamento.js";
import ListarEncaminhamentosPorUsuario from "./ListarEncaminhamentosPorUsuario.js";
import ListarEncaminhamentosPorDemanda from "./ListarEncaminhamentosPorDemanda.js";
import ListarEncaminhamentos from "./ListarEncaminhamentos.js";

dotenv.config();

export const criarDemanda = async (req, res) => {
  try {
    const novaDemanda = await CriarDemanda.execute(req.body);
    return res.status(201).json({
      demanda: novaDemanda,
      mensagem: "Demanda criada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar demanda:", error);
    return res
      .status(
        error.message.includes("obrigatório") ||
          error.message.includes("obrigatória")
          ? 400
          : 500
      )
      .json({ error: error.message });
  }
};

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

export const listarEncaminhamentosPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const encaminhamentos = await ListarEncaminhamentosPorUsuario.execute({
      id,
    });
    return res.status(200).json({
      encaminhamentos,
      mensagem: "Encaminhamentos do usuário carregados com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao listar encaminhamentos do usuário:", error);
    return res
      .status(error.message.includes("não encontrado") ? 404 : 500)
      .json({ error: error.message });
  }
};

export const listarEncaminhamentosPorDemanda = async (req, res) => {
  try {
    const { id } = req.params;
    const encaminhamentos = await ListarEncaminhamentosPorDemanda.execute({
      id,
    });
    return res.status(200).json({
      encaminhamentos,
      mensagem: "Encaminhamentos da demanda carregados com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao listar encaminhamentos da demanda:", error);
    return res
      .status(error.message.includes("não encontrada") ? 404 : 500)
      .json({ error: error.message });
  }
};

export const listarEncaminhamentos = async (req, res) => {
  try {
    const encaminhamentos = await ListarEncaminhamentos.execute();
    return res.status(200).json({
      encaminhamentos,
      mensagem: "Encaminhamentos carregados com sucesso",
    });
  } catch (error) {
    console.error("Erro ao listar encaminhamentos:", error);
    return res.status(500).json({ error: error.message });
  }
};
