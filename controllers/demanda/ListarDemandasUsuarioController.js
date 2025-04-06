import db from "../../models/index.js";

class ListarDemandasUsuarioController {
  async execute({ usuario_id, filtros = {} }) {
    const usuario = await db.Usuario.findByPk(usuario_id, {
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
    });
    if (!usuario) throw new Error("Usuário não encontrado");

    const { nomeAluno, cursoId, date, tipoDemanda } = filtros;
    const includeCommon = [
      {
        model: db.Usuario,
        as: "Usuarios",
        attributes: ["id", "nome", "email"],
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
              { model: db.Curso, as: "Cursos", attributes: ["id", "nome"] },
            ],
          },
        ],
      },
      {
        model: db.Encaminhamentos,
        as: "Encaminhamentos",
        attributes: ["id", "descricao", "data"],
        include: [
          { model: db.Usuario, as: "Destinatario", attributes: ["id", "nome"] },
        ],
      },
    ];

    let whereClause = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate],
      };
    }
    if (nomeAluno) {
      whereClause["$DemandaAlunos.Aluno.nome$"] = {
        [db.Sequelize.Op.like]: `%${nomeAluno}%`,
      };
    }
    if (cursoId) {
      whereClause["$DemandaAlunos.Aluno.Cursos.id$"] = cursoId;
    }

    let demandas;
    const cargosEspeciais = [
      "Funcionario CTP",
      "Diretor Geral",
      "Diretor Ensino",
    ];

    if (cargosEspeciais.includes(usuario.Cargo.nome)) {
      let tipoWhere = {};
      if (tipoDemanda === "criadaPorMim") {
        tipoWhere = { usuario_id }; 
      } else if (tipoDemanda === "encaminhada") {
        tipoWhere = { "$Encaminhamentos.destinatario_id$": usuario_id }; 
      } else {
        tipoWhere = {
          [db.Sequelize.Op.or]: [
            { usuario_id },
            { "$Encaminhamentos.destinatario_id$": usuario_id },
          ],
        }; 
      }

      demandas = await db.Demanda.findAll({
        where: { [db.Sequelize.Op.and]: [whereClause, tipoWhere] },
        include: includeCommon,
        order: [["createdAt", "DESC"]],
      });
    } else {
      let tipoWhere = {};
      if (tipoDemanda === "criadaPorMim") {
        tipoWhere = { usuario_id };
      } else if (tipoDemanda === "encaminhada") {
        tipoWhere = {
          [db.Sequelize.Op.and]: [
            { "$Encaminhamentos.destinatario_id$": usuario_id },
            { usuario_id: { [db.Sequelize.Op.ne]: usuario_id } },
          ],
        };
      } else {
        tipoWhere = {
          [db.Sequelize.Op.or]: [
            { usuario_id },
            { "$Encaminhamentos.destinatario_id$": usuario_id },
          ],
        };
      }

      demandas = await db.Demanda.findAll({
        where: { [db.Sequelize.Op.and]: [whereClause, tipoWhere] },
        include: includeCommon,
        order: [["createdAt", "DESC"]],
      });
    }

    if (demandas.length === 0)
      throw new Error("Nenhuma demanda encontrada para este usuário");

    return demandas.map((demanda) => ({
      ...demanda.toJSON(),
      destinatarios: demanda.Encaminhamentos.map((enc) => ({
        id: enc.Destinatario.id,
        nome: enc.Destinatario.nome,
      })),
    }));
  }
}

export default new ListarDemandasUsuarioController();