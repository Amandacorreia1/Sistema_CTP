import db from "../../models/index.js";
import CriarDemandaController from "./CriarDemandaController.js";
import ListarDemandasController from "./ListarDemandasController.js";
import ListarDemandasUsuarioController from "./ListarDemandasUsuarioController.js";
import ListarDemandaPorIdController from "./ListarDemandaPorIdController.js";
import FecharDemandaController from "./FecharDemandaController.js";

export const criarDemanda = async (req, res) => {
  try {
    const novaDemanda = await CriarDemandaController.execute(req);
    return res.status(201).json({
      mensagem: "Demanda criada com sucesso",
      demanda: novaDemanda,
    });
  } catch (erro) {
    console.error("Erro ao criar demanda:", erro);
    return res
      .status(500)
      .json({ mensagem: "Erro ao criar demanda", erro: erro.message });
  }
};

export const listarDemandas = async (req, res) => {
  try {
    const demandas = await ListarDemandasController.execute();
    return res.status(200).json({ demandas });
  } catch (erro) {
    console.error("Erro ao listar demandas:", erro);
    return res
      .status(erro.message === "Nenhuma demanda encontrada" ? 404 : 500)
      .json({ mensagem: erro.message });
  }
};

export const listarDemandasUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    if (!usuario_id) {
      return res
        .status(400)
        .json({ mensagem: "ID do usuário não encontrado no token" });
    }
    const demandas = await ListarDemandasUsuarioController.execute({
      usuario_id,
      filtros: req.body,
    });
    return res.status(200).json({ demandas });
  } catch (erro) {
    console.error("Erro ao listar demandas do usuário:", erro);
    return res
      .status(
        erro.message === "Nenhuma demanda encontrada para este usuário"
          ? 404
          : 500
      )
      .json({ mensagem: erro.message });
  }
};

export const listarDemandaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const { demanda, podeIntervir } =
      await ListarDemandaPorIdController.execute({ id, usuario_id });
    return res.status(200).json({ demanda, podeIntervir });
  } catch (erro) {
    console.error("Erro ao buscar demanda por ID:", erro);
    return res
      .status(erro.message === "Demanda não encontrada" ? 404 : 500)
      .json({ mensagem: erro.message });
  }
};

export const fecharDemanda = async (req, res) => {
  try {
    const demandaAtualizada = await FecharDemandaController.execute(req);
    return res.status(200).json({
      mensagem: "Demanda fechada com sucesso",
      demanda: demandaAtualizada,
    });
  } catch (erro) {
    console.error("Erro ao fechar demanda:", erro);
    return res
      .status(
        erro.message === "Demanda não encontrada"
          ? 404
          : erro.message.includes("permissão")
          ? 403
          : erro.message.includes("intervenção") ||
            erro.message.includes("fechada")
          ? 400
          : 500
      )
      .json({ mensagem: erro.message });
  }
};
