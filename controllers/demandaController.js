import db from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

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
    console.log("Demanda criada:", novaDemanda.id);

    if (alunos && alunos.length > 0) {
      for (const aluno of alunos) {
        const alunoExistente = await db.Aluno.findByPk(aluno.id);
        if (!alunoExistente) {
          return res
            .status(404)
            .json({ mensagem: `Aluno com ID ${aluno.id} não encontrado.` });
        }
        await db.DemandaAluno.create({
          demanda_id: novaDemanda.id,
          aluno_id: aluno.id,
        });
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

    let demandas;
    if (
      usuario.Cargo.nome === "Funcionario CTP" ||
      usuario.Cargo.nome === "Diretor Geral" ||
      usuario.Cargo.nome === "Diretor Ensino"
    ) {
      demandas = await db.Demanda.findAll({
        include: [
          {
            model: db.Usuario,
            attributes: ["id", "nome", "email"],
            as: "Usuario",
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
        ],
      });
    } else {
      demandas = await db.Demanda.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            { usuario_id: usuario_id },
            { "$Encaminhamentos.destinatario_id$": usuario_id },
          ],
        },
        include: [
          {
            model: db.Usuario,
            attributes: ["id", "nome", "email"],
            as: "Usuario",
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
        ],
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
          as: "Usuario",
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
          ],
        },
      ],
    });

    if (!demanda) {
      return res.status(404).json({ mensagem: "Demanda não encontrada" });
    }

    res.status(200).json({ demanda });
  } catch (erro) {
    console.error("Erro ao buscar demanda por ID:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar demanda" });
  }
};