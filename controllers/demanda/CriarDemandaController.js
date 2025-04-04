import db from "../../models/index.js";
import EmailController from "./EmailController.js";

class CriarDemandaController {
  async execute(req) {
    const { usuario_id, descricao, status, disciplina, alunos, amparoLegal } =
      req.body;

    const usuario = await db.Usuario.findByPk(usuario_id);
    if (!usuario) throw new Error("Usuário não encontrado.");
    if (!alunos) throw new Error("Os alunos não foram informados.");

    const novaDemanda = await db.Demanda.create({
      usuario_id,
      descricao,
      status: true,
      disciplina,
    });

    if (alunos.length > 0) {
      const alunoIds = new Set();
      for (const aluno of alunos) {
        const alunoExistente = await db.Aluno.findByPk(aluno.id);
        if (!alunoExistente)
          throw new Error(`Aluno com ID ${aluno.id} não encontrado.`);
        if (alunoIds.has(aluno.id)) continue;
        await db.DemandaAluno.create({
          demanda_id: novaDemanda.id,
          aluno_id: aluno.id,
        });
        alunoIds.add(aluno.id);
      }
    }

    if (amparoLegal?.length > 0) {
      for (const amparoId of amparoLegal) {
        const amparoExistente = await db.AmparoLegal.findByPk(amparoId);
        if (!amparoExistente)
          throw new Error(`Amparo legal com ID ${amparoId} não encontrado.`);
      }
      const amparoDemandaData = amparoLegal.map((amparoId) => ({
        demanda_id: novaDemanda.id,
        amparolegal_id: amparoId,
      }));
      await db.AmparoDemanda.bulkCreate(amparoDemandaData);
    }

    const cargosParaEncaminhar = [
      "Funcionario CTP",
      "Diretor Geral",
      "Diretor Ensino",
    ];
    const usuariosDestinatarios = await db.Usuario.findAll({
      where: { id: { [db.Sequelize.Op.ne]: usuario_id } },
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
        usuario_id,
        destinatario_id: destinatario.id,
        descricao:
          "Notificação formal aos superiores para ciência e acompanhamento da demanda",
        data: new Date(),
      }));
      await db.Encaminhamentos.bulkCreate(encaminhamentosData);

      const destinatariosIds = usuariosDestinatarios.map((d) => d.id);
      await EmailController.enviarEmailEncaminhamento(
        usuario.nome,
        destinatariosIds,
        novaDemanda.id,
        "Notificação formal aos superiores para ciência e acompanhamento da demanda",
        new Date()
      );
    }

    return novaDemanda;
  }
}

export default new CriarDemandaController();
