import db from "../models/index.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const enviarEmailEncaminhamento = async (
  remetenteNome,
  destinatariosIds,
  demandaId,
  descricao,
  data
) => {
  try {
    const demanda = await db.Demanda.findByPk(demandaId, {
      include: [
        {
          model: db.DemandaAluno,
          as: "DemandaAlunos",
          include: [
            {
              model: db.Aluno,
              as: "Aluno",
              attributes: ["nome"],
              include: [
                {
                  model: db.Curso,
                  as: "Cursos",
                  attributes: ["nome"],
                },
              ],
            },
          ],
        },
        {
          model: db.AmparoLegal,
          through: { attributes: [] },
          attributes: ["nome"],
        },
      ],
    });

    if (!demanda) {
      console.error("Demanda não encontrada para envio de e-mail:", demandaId);
      return;
    }

    const destinatarios = await db.Usuario.findAll({
      where: { id: destinatariosIds },
      attributes: ["id", "nome", "email"],
    });

    const formatDateToDisplay = (isoDate) => {
      const date = new Date(isoDate);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const alunosEnvolvidos =
      demanda.DemandaAlunos.length > 0
        ? demanda.DemandaAlunos.map(
            (da) =>
              `${da.Aluno.nome} (${
                da.Aluno.Cursos?.nome || "Curso não informado"
              })`
          ).join(", ")
        : "Nenhum aluno envolvido";

    const amparoLegal =
      demanda.AmparoLegals.length > 0
        ? demanda.AmparoLegals.map((amparo) => amparo.nome).join(", ")
        : "Nenhum amparo legal associado";

    for (const destinatario of destinatarios) {
      if (!destinatario.email) {
        console.error(
          `Destinatário ${destinatario.nome} (ID: ${destinatario.id}) não possui e-mail`
        );
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario.email,
        subject: "Encaminhamento de Demanda",
        text: `Olá ${
          destinatario.nome
        },\n\nVocê recebeu um novo encaminhamento de ${remetenteNome}.\n\nDescrição da demanda: ${descricao}\nAlunos envolvidos: ${alunosEnvolvidos}\nData da demanda: ${formatDateToDisplay(
          data
        )}\nAmparo legal: ${amparoLegal}\n\nAtenciosamente,\nCoordenação Técnico Pedagógica - CTP`,
      };
      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error("Erro ao enviar e-mail de encaminhamento:", error);
  }
};

export const criarDemanda = async (req, res) => {
  const { descricao, disciplina, status, usuario_id } = req.body;

  try {
    if (!usuario_id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    if (!descricao || descricao.trim() === "") {
      return res
        .status(400)
        .json({ error: "Descrição da demanda é obrigatória" });
    }

    const novaDemanda = await db.Demanda.create({
      descricao,
      disciplina: disciplina || null,
      status: status || "Pendente",
      usuario_id,
    });

    return res.status(201).json({
      demanda: novaDemanda,
      mensagem: "Demanda criada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar demanda:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const criarEncaminhamento = async (req, res) => {
  const { destinatario_id, demanda_id, descricao } = req.body;
  const usuario_id = req.usuario.id;

  try {
    if (!usuario_id) {
      return res.status(400).json({ error: "ID do usuário remetente não foi encontrado no token" });
    }
    if (!destinatario_id) {
      return res.status(400).json({ error: "Informe um destinatário" });
    }
    if (Array.isArray(destinatario_id)) {
      return res.status(400).json({ error: "A demanda só pode ser encaminhada para uma única pessoa" });
    }
    if (!demanda_id) {
      return res.status(400).json({ error: "ID da demanda é obrigatório" });
    }
    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ error: "Informe uma descrição válida" });
    }

    const demanda = await db.Demanda.findByPk(demanda_id, {
      include: [
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          include: [
            {
              model: db.Usuario,
              as: "Destinatario",
              include: [{ model: db.Cargo, as: "Cargo" }],
            },
          ],
        },
      ],
    });
    if (!demanda) {
      return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const usuarioLogado = await db.Usuario.findByPk(usuario_id, {
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
    });
    const cargosEspeciais = ["Funcionario CTP", "Diretor Geral", "Diretor Ensino"];
    const isCargoEspecial = cargosEspeciais.includes(usuarioLogado.Cargo.nome);
    const isCriador = demanda.usuario_id === usuario_id;

    const encaminhamentos = demanda.Encaminhamentos.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
    const encaminhamentosIniciais = encaminhamentos.filter((e) =>
      cargosEspeciais.includes(e.Destinatario.Cargo.nome)
    );
    const totalIniciais = encaminhamentosIniciais.length;

    let podeIntervir = false;
    if (encaminhamentos.length > totalIniciais) {
      const ultimoEncaminhamento = encaminhamentos[0];
      if (ultimoEncaminhamento.destinatario_id === usuario_id) {
        podeIntervir = true;
      } else {
        console.log(
          "Usuário não é o último destinatário:",
          ultimoEncaminhamento.destinatario_id
        );
      }
    } else {
      if (isCriador) {
        podeIntervir = true;
      } else if (isCargoEspecial) {
        const recebeuEncaminhamentoInicial = encaminhamentos.some(
          (e) => e.destinatario_id === usuario_id
        );
        if (recebeuEncaminhamentoInicial) {
          podeIntervir = true;
        }
      }
    }

    if (!podeIntervir) {
      return res.status(403).json({
        error: "Você não tem permissão para encaminhar esta demanda no momento",
      });
    }

    const dataAtual = new Date();
    const novoEncaminhamento = await db.Encaminhamentos.create({
      usuario_id,
      demanda_id,
      destinatario_id, 
      descricao,
      data: dataAtual,
    });

    const remetente = await db.Usuario.findByPk(usuario_id, {
      attributes: ["nome"],
    });
    if (!remetente) {
      return res.status(404).json({ error: "Remetente não encontrado" });
    }

    await enviarEmailEncaminhamento(
      remetente.nome,
      [destinatario_id], 
      demanda_id,
      descricao,
      dataAtual
    );

    const demandaAtualizada = await db.Demanda.findByPk(demanda_id, {
      include: [
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          attributes: ["id", "descricao", "data"],
          include: [
            {
              model: db.Usuario,
              as: "Destinatario",
              attributes: ["id", "nome"],
            },
          ],
        },
      ],
    });

    const formatDateToDisplay = (isoDate) => {
      const date = new Date(isoDate);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const destinatariosFormatados = demandaAtualizada.Encaminhamentos.map(
      (enc) => ({
        id: enc.Destinatario.id,
        nome: enc.Destinatario.nome,
      })
    );

    return res.status(201).json({
      encaminhamentos: [
        {
          ...novoEncaminhamento.toJSON(),
          data: formatDateToDisplay(novoEncaminhamento.data),
        },
      ],
      demanda: {
        ...demandaAtualizada.toJSON(),
        destinatarios: destinatariosFormatados,
        data: formatDateToDisplay(demanda.createdAt),
      },
      mensagem: "Encaminhamento realizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao processar encaminhamento:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const listarEncaminhamentosPorUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario_res = await db.Usuario.findByPk(id);
    if (!usuario_res) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    try {
      const encaminhamentos = await db.Encaminhamentos.findAll({
        where: { usuario_id: id },
        include: [
          { model: db.Usuario, as: "Remetente" },
          { model: db.Demanda, as: "Demanda" },
          { model: db.Usuario, as: "Destinatario" },
        ],
      });
      return res.status(200).json({
        encaminhamentos,
        mensagem: "Encaminhamentos do usuário carregados com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao listar os encaminhamentos do usuário." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const listarEncaminhamentosPorDemanda = async (req, res) => {
  const { id } = req.params;
  try {
    const demanda_res = await db.Demanda.findByPk(id);
    if (!demanda_res) {
      return res.status(404).json({ error: "Demanda não encontrada." });
    }
    try {
      const encaminhamentos = await db.Encaminhamentos.findAll({
        where: { demanda_id: id },
        include: [
          { model: db.Usuario, as: "Remetente" },
          { model: db.Demanda, as: "Demanda" },
          { model: db.Usuario, as: "Destinatario" },
        ],
      });
      return res.status(200).json({
        encaminhamentos,
        mensagem: "Encaminhamentos da demanda carregados com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao listar os encaminhamentos da demanda." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

export const listarEncaminhamentos = async (req, res) => {
  try {
    const encaminhamentos = await db.Encaminhamentos.findAll({
      include: [
        { model: db.Usuario, as: "Remetente" },
        { model: db.Demanda, as: "Demanda" },
        { model: db.Usuario, as: "Destinatario" },
      ],
    });
    return res.status(200).json({
      encaminhamentos,
      mensagem: "Encaminhamentos carregados com sucesso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
