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
            `${da.Aluno.nome} (${da.Aluno.Cursos?.nome || "Curso não informado"
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
        text: `Olá ${destinatario.nome
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
  const { id, descricao, status, disciplina, usuario_id, alunos, amparoLegal } =
    req.body;

  try {
    console.log("Payload recebido:", req.body);

    const usuario = await db.Usuario.findByPk(usuario_id);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    if (!alunos) {
      return res
        .status(404)
        .json({ mensagem: "Os alunos não foram informados." });
    }

    const novaDemanda = await db.Demanda.create({
      usuario_id,
      descricao,
      status: true,
      disciplina,
    });

    if (alunos && alunos.length > 0) {
      const alunoIds = new Set();
      for (const aluno of alunos) {
        const alunoExistente = await db.Aluno.findByPk(aluno.id);
        if (!alunoExistente) {
          return res
            .status(404)
            .json({ mensagem: `Aluno com ID ${aluno.id} não encontrado.` });
        }
        if (alunoIds.has(aluno.id)) {
          continue;
        }
        const duplicata = await db.DemandaAluno.findOne({
          where: { demanda_id: novaDemanda.id, aluno_id: aluno.id },
        });
        if (!duplicata) {
          await db.DemandaAluno.create({
            demanda_id: novaDemanda.id,
            aluno_id: aluno.id,
          });
          alunoIds.add(aluno.id);
        }
      }
      console.log("Alunos associados com sucesso");
    }

    if (amparoLegal && amparoLegal.length > 0) {
      for (const amparoId of amparoLegal) {
        const amparoExistente = await db.AmparoLegal.findByPk(amparoId);
        console.log(
          `Verificando amparo ID ${amparoId}:`,
          amparoExistente ? "Encontrado" : "Não encontrado"
        );
        if (!amparoExistente) {
          return res.status(404).json({
            mensagem: `Amparo legal com ID ${amparoId} não encontrado.`,
          });
        }
      }
      const amparoDemandaData = amparoLegal.map((amparoId) => ({
        demanda_id: novaDemanda.id,
        amparolegal_id: amparoId,
      }));
      console.log("Dados para AmparoDemandas:", amparoDemandaData);
      await db.AmparoDemanda.bulkCreate(amparoDemandaData);
      console.log("Amparos associados com sucesso");
    }

    const cargosParaEncaminhar = [
      "Funcionario CTP",
      "Diretor Geral",
      "Diretor Ensino",
    ];
    const usuariosDestinatarios = await db.Usuario.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: usuario_id },
      },
      include: [
        {
          model: db.Cargo,
          as: "Cargo",
          where: { nome: { [db.Sequelize.Op.in]: cargosParaEncaminhar } },
          attributes: ["nome"],
        },
      ],
      attributes: ["id", "nome", "email"],
    });

    if (usuariosDestinatarios.length > 0) {
      const encaminhamentosData = usuariosDestinatarios.map((destinatario) => ({
        demanda_id: novaDemanda.id,
        usuario_id: usuario_id,
        destinatario_id: destinatario.id,
        descricao:
          "Notificação formal aos superiores para ciência e acompanhamento da demanda",
        data: new Date(),
      }));
      console.log("Dados para Encaminhamentos:", encaminhamentosData);
      await db.Encaminhamentos.bulkCreate(encaminhamentosData, {
        validate: true,
        fields: [
          "demanda_id",
          "usuario_id",
          "destinatario_id",
          "descricao",
          "data",
        ],
      });
      console.log(
        `Encaminhamentos automáticos criados para ${usuariosDestinatarios.length} usuários`
      );

      const destinatariosIds = usuariosDestinatarios.map((d) => d.id);
      await enviarEmailEncaminhamento(
        usuario.nome,
        destinatariosIds,
        novaDemanda.id,
        "Notificação formal aos superiores para ciência e acompanhamento da demanda",
        new Date()
      );
    } else {
      console.warn(
        "Nenhum usuário encontrado com os cargos especificados para encaminhamento automático (excluindo o criador)"
      );
    }

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
    const demandas = await db.Demanda.findAll({
      include: [
        {
          model: db.Usuario,
          attributes: ["nome", "email"],
        },
        {
          model: db.AmparoLegal,
          through: { attributes: [] },
          attributes: ["id", "nome"],
        },
      ],
    });

    if (demandas.length === 0) {
      return res.status(404).json({ mensagem: "Nenhuma demanda encontrada" });
    }

    res.status(200).json({ demandas });
  } catch (erro) {
    console.error("Erro ao listar demandas:", erro);
    res.status(500).json({ mensagem: "Erro ao listar demandas" });
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

    const usuario = await db.Usuario.findByPk(usuario_id, {
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["id", "nome"] }],
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const includeCommon = [
      {
        model: db.Usuario,
        attributes: ["id", "nome", "email"],
        as: "Usuarios",
        include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
      },
      {
        model: db.AmparoLegal,
        through: { attributes: [] },
        attributes: ["id", "nome"],
      },
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
                attributes: ["id", "nome"],
              },
            ],
          },
        ],
      },
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
    ];

    let demandas;
    if (
      usuario.Cargo.nome === "Funcionario CTP" ||
      usuario.Cargo.nome === "Diretor Geral" ||
      usuario.Cargo.nome === "Diretor Ensino"
    ) {
      demandas = await db.Demanda.findAll({
        include: includeCommon,
        order: [["createdAt", "DESC"]],
      });
    } else {
      demandas = await db.Demanda.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { usuario_id: usuario_id },
            { "$Encaminhamentos.destinatario_id$": usuario_id },
          ],
        },
        include: includeCommon,
        order: [["createdAt", "DESC"]],
      });
    }

    if (demandas.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhuma demanda encontrada para este usuário" });
    }

    const demandasFormatadas = demandas.map((demanda) => ({
      ...demanda.toJSON(),
      destinatarios: demanda.Encaminhamentos.map((enc) => ({
        id: enc.Destinatario.id,
        nome: enc.Destinatario.nome,
      })),
    }));

    return res.status(200).json({ demandas: demandasFormatadas });

  } catch (erro) {
    console.error("Erro detalhado ao listar demandas do usuário:", {
      message: erro.message,
      stack: erro.stack,
    });
    return res
      .status(500)
      .json({ mensagem: "Erro ao listar demandas do usuário" });
  }
};

export const listarDemandaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const demanda = await db.Demanda.findOne({
      where: { id },
      include: [
        {
          model: db.Usuario,
          as: "Usuarios",
          attributes: ["id", "nome", "email"],
        },
        {
          model: db.DemandaAluno,
          as: "DemandaAlunos",
          include: [
            {
              model: db.Aluno,
              attributes: ["matricula", "nome", "email"],
              include: [
                {
                  model: db.Curso,
                  as: "Cursos",
                  attributes: ["id", "nome"],
                },
                {
                  model: db.Condicao,
                  as: "Condicaos",
                  attributes: ["id", "nome"],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
        {
          model: db.AmparoLegal,
          through: { attributes: [] },
          attributes: ["id", "nome"],
        },
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          include: [
            {
              model: db.Usuario,
              as: "Remetente",
              attributes: ["id", "nome", "email"],
            },
            {
              model: db.Usuario,
              as: "Destinatario",
              attributes: ["id", "nome", "email"],
            },
          ],
        },
        {
          model: db.IntervencaoDemanda,
          as: "IntervencoesDemandas",
          include: [
            {
              model: db.Intervencao,
              as: "Intervencao",
              attributes: ["id", "descricao"],
            },
            {
              model: db.Encaminhamentos,
              as: "Encaminhamentos",
              attributes: ["id"],
              include: [
                {
                  model: db.Usuario,
                  as: "Remetente",
                  attributes: ["id", "nome", "email"],
                },
                {
                  model: db.Usuario,
                  as: "Destinatario",
                  attributes: ["id", "nome", "email"],
                },
              ],
            },
            {
              model: db.Usuario,
              as: "Usuarios",
              attributes: ["id", "nome", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    const podeIntervir = true;
    //primeiro verifica o cargo sendo CTP ou diren retorna sempre true
    //pega o último encaminhamento desta demanda, se o usuário do último encaminhamento for o mesmo que está logado retorna true
    //do contrário false


    if (!demanda) {
      return res.status(404).json({ mensagem: "Demanda não encontrada" });
    }

    res.status(200).json({ demanda, podeIntervir });
  } catch (erro) {
    console.error("Erro ao buscar demanda por ID:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar demanda" });
  }
};

export const fecharDemanda = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const demanda = await db.Demanda.findOne({
      where: { id },
      include: [
        {
          model: db.IntervencaoDemanda,
          as: "IntervencoesDemandas",
          include: [
            {
              model: db.Intervencao,
              as: "Intervencao",
            },
            {
              model: db.Encaminhamentos,
              as: "Encaminhamentos",
              include: [
                { model: db.Usuario, as: "Remetente" },
                { model: db.Usuario, as: "Destinatario" },
              ],
            },
          ],
        },
        {
          model: db.Encaminhamentos,
          as: "Encaminhamentos",
          include: [
            { model: db.Usuario, as: "Remetente" },
            { model: db.Usuario, as: "Destinatario" },
          ],
        },
        {
          model: db.Usuario,
          as: "Usuarios",
          include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
        },
      ],
    });

    if (!demanda) {
      return res.status(404).json({ mensagem: "Demanda não encontrada" });
    }

    if (
      !demanda.IntervencoesDemandas ||
      demanda.IntervencoesDemandas.length === 0
    ) {
      return res.status(400).json({
        mensagem:
          "A demanda não pode ser fechada sem pelo menos uma intervenção realizada",
      });
    }

    if (demanda.status === false) {
      return res.status(400).json({
        mensagem: "Esta demanda já está fechada",
      });
    }

    const encaminhamentos = demanda.Encaminhamentos.sort((a, b) => b.id - a.id);

    const usuarioCriador = demanda.Usuarios;
    const isFuncionarioCTP = usuarioCriador.Cargo?.nome === "Funcionario CTP";
    const isCriador = demanda.usuario_id === usuario_id;

    if (encaminhamentos.length > 0) {
      const ultimoEncaminhamento = encaminhamentos[0];

      if (isCriador && isFuncionarioCTP) {
      } else if (ultimoEncaminhamento.destinatario_id !== usuario_id) {
        return res.status(403).json({
          mensagem:
            "Apenas o último destinatário pode fechar esta demanda no momento, a menos que você seja o criador e Funcionario CTP",
        });
      }
    } else {
      if (!isCriador) {
        return res.status(403).json({
          mensagem:
            "Apenas o criador pode fechar esta demanda, pois não foi encaminhada",
        });
      }
    }

    await db.Demanda.update(
      {
        status: false,
      },
      { where: { id } }
    );

    const demandaAtualizada = await db.Demanda.findByPk(id);

    return res.status(200).json({
      mensagem: "Demanda fechada com sucesso",
      demanda: demandaAtualizada,
    });
  } catch (erro) {
    console.error("Erro ao fechar demanda:", erro);
    return res.status(500).json({
      mensagem: "Erro ao fechar demanda",
      erro: erro.message,
    });
  }
};
