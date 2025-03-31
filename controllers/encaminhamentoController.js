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

transporter.verify((error, success) => {
  if (error) {
    console.error("Erro ao verificar o transporter:", error);
  } else {
    console.log("Transporter configurado corretamente");
  }
});

const enviarEmailEncaminhamento = async (remetenteNome, destinatariosIds, demandaId, descricao, data) => {
  try {
    const demanda = await db.Demanda.findByPk(demandaId);
    if (!demanda) {
      console.error("Demanda não encontrada para envio de e-mail:", demandaId);
      return;
    }

    const destinatarios = await db.Usuario.findAll({
      where: { id: destinatariosIds },
      attributes: ["id", "nome", "email"],
    });

    console.log("Destinatários para envio de e-mail:", destinatarios);

    const formatDateToDisplay = (isoDate) => {
      const date = new Date(isoDate);
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    for (const destinatario of destinatarios) {
      if (!destinatario.email) {
        console.error(`Destinatário ${destinatario.nome} (ID: ${destinatario.id}) não possui e-mail`);
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario.email,
        subject: "Novo Encaminhamento Recebido",
        text: `Olá ${destinatario.nome},\n\nVocê recebeu um novo encaminhamento de ${remetenteNome}.\n\nDemanda: ${demanda.id}\nDescrição: ${descricao}\nData: ${formatDateToDisplay(data)}\n\nAtenciosamente,\nCoordenação Técnico Pedagógica - CTP`,
      };

      console.log(`Tentando enviar e-mail para ${destinatario.email}...`);
      await transporter.sendMail(mailOptions);
      console.log(`E-mail enviado com sucesso para ${destinatario.email}`);
    }
  } catch (error) {
    console.error("Erro ao enviar e-mail de encaminhamento:", error);
  }
};

// Função criarDemanda simplificada, sem encaminhamentos automáticos
export const criarDemanda = async (req, res) => {
  const { descricao, disciplina, status, usuario_id } = req.body;

  try {
    if (!usuario_id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ error: "Descrição da demanda é obrigatória" });
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

// Função para encaminhamentos manuais
export const criarEncaminhamento = async (req, res) => {
  const { destinatario_id, demanda_id, descricao } = req.body;
  const usuario_id = req.usuario.id;

  try {
    if (!usuario_id) {
      return res.status(400).json({ error: "ID do usuário remetente não foi encontrado no token" });
    }
    if (!destinatario_id || (Array.isArray(destinatario_id) && destinatario_id.length === 0)) {
      return res.status(400).json({ error: "Informe pelo menos um destinatário" });
    }
    if (!demanda_id) {
      return res.status(400).json({ error: "ID da demanda é obrigatório" });
    }
    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ error: "Informe uma descrição válida" });
    }

    const demanda = await db.Demanda.findByPk(demanda_id);
    if (!demanda) {
      return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const dataAtual = new Date();
    const destinatarios = Array.isArray(destinatario_id) ? destinatario_id : [destinatario_id];
    const encaminhamentos = [];

    for (const destId of destinatarios) {
      const novoEncaminhamento = await db.Encaminhamentos.create({
        usuario_id,
        demanda_id,
        destinatario_id: destId,
        descricao,
        data: dataAtual,
      });
      encaminhamentos.push(novoEncaminhamento);
    }

    const remetente = await db.Usuario.findByPk(usuario_id, { attributes: ["nome"] });
    if (!remetente) {
      return res.status(404).json({ error: "Remetente não encontrado" });
    }

    await enviarEmailEncaminhamento(remetente.nome, destinatarios, demanda_id, descricao, dataAtual);

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
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const destinatariosFormatados = demandaAtualizada.Encaminhamentos.map((enc) => ({
      id: enc.Destinatario.id,
      nome: enc.Destinatario.nome,
    }));

    return res.status(201).json({
      encaminhamentos: encaminhamentos.map((enc) => ({
        ...enc.toJSON(),
        data: formatDateToDisplay(enc.data),
      })),
      demanda: {
        ...demandaAtualizada.toJSON(),
        destinatarios: destinatariosFormatados,
        data: formatDateToDisplay(demanda.createdAt),
      },
      mensagem: `Encaminhamento${destinatarios.length > 1 ? "s" : ""} realizado${
        destinatarios.length > 1 ? "s" : ""
      } com sucesso!`,
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
