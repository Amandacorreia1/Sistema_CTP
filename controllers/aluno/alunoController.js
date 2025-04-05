import dotenv from "dotenv";
import AdicionarCondicao from "./AdicionarCondicao.js";
import CadastrarAluno from "./CadastrarAluno.js";
import AtualizarAluno from "./AtualizarAluno.js";
import BuscarAluno from "./BuscarAluno.js";
import ListarAlunos from "./ListarAlunos.js";
import VerificarAluno from "./VerificarAluno.js";

dotenv.config();

export const adicionarCondicao = async (req, res) => {
  try {
    const result = await AdicionarCondicao.execute(req);
    return res.status(201).json(result);
  } catch (erro) {
    console.error("Erro ao adicionar condição ao aluno:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(erro.message.includes("não encontrada") ? 404 : 500)
      .json({ mensagem: erro.message });
  }
};

export const cadastrarAluno = async (req, res) => {
  try {
    const result = await CadastrarAluno.execute(req.body);
    return res.status(201).json(result);
  } catch (erro) {
    console.error("Erro ao cadastrar aluno:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(
        erro.message.includes("já existe")
          ? 409
          : erro.message.includes("obrigatórios") ||
            erro.message.includes("inválido")
          ? 400
          : 500
      )
      .json({ mensagem: erro.message });
  }
};

export const atualizarAluno = async (req, res) => {
  try {
    const { matricula } = req.params;
    const result = await AtualizarAluno.execute({ matricula, ...req.body });
    return res.status(200).json(result);
  } catch (erro) {
    console.error("Erro ao atualizar aluno:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(
        erro.message.includes("não encontrado")
          ? 404
          : erro.message.includes("obrigatórios") ||
            erro.message.includes("inválido")
          ? 400
          : 500
      )
      .json({ mensagem: erro.message });
  }
};

export const buscarAluno = async (req, res) => {
  try {
    const { matricula } = req.params;
    const result = await BuscarAluno.execute({ matricula });
    return res.status(200).json(result);
  } catch (erro) {
    console.error("Erro ao buscar aluno:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(erro.message.includes("não encontrado") ? 404 : 500)
      .json({ mensagem: erro.message });
  }
};

export const listarAlunos = async (req, res) => {
  try {
    const result = await ListarAlunos.execute();
    return res.status(200).json(result);
  } catch (erro) {
    console.error("Erro ao listar alunos:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res.status(500).json({ mensagem: erro.message });
  }
};

export const verificarAluno = async (req, res) => {
  try {
    const { matricula } = req.params;
    const result = await VerificarAluno.execute({ matricula });
    return res.status(200).json(result);
  } catch (erro) {
    console.error("Erro ao verificar aluno na base local:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(erro.message.includes("não encontrado") ? 404 : 500)
      .json({ mensagem: erro.message });
  }
};
