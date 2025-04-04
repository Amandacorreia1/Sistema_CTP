import db from "../../models/index.js";
import EmailController from "./EmailController.js";

class FecharDemandaController {
  async execute(req) {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const demanda = await db.Demanda.findOne({
      where: { id },
      include: [
        { model: db.IntervencaoDemanda, as: "IntervencoesDemandas" },
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
        {
          model: db.DemandaAluno,
          as: "DemandaAlunos",
          include: [
            {
              model: db.Aluno,
              as: "Aluno",
              attributes: ["nome"],
              include: [
                { model: db.Curso, as: "Cursos", attributes: ["nome"] },
              ],
            },
          ],
        },
      ],
    });

    if (!demanda) throw new Error("Demanda não encontrada");
    if (
      !demanda.IntervencoesDemandas ||
      demanda.IntervencoesDemandas.length === 0
    ) {
      throw new Error(
        "A demanda não pode ser fechada sem pelo menos uma intervenção"
      );
    }
    if (!demanda.status) throw new Error("Esta demanda já está fechada");

    const usuarioLogado = await db.Usuario.findByPk(usuario_id, {
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
    });
    const cargosEspeciais = [
      "Funcionario CTP",
      "Diretor Geral",
      "Diretor Ensino",
    ];
    const isCargoEspecial = cargosEspeciais.includes(usuarioLogado.Cargo.nome);
    const isCriador = demanda.usuario_id === usuario_id;

    const encaminhamentos = demanda.Encaminhamentos.sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
    const cargosDestinatarios = await db.Usuario.findAll({
      where: { id: encaminhamentos.map((e) => e.destinatario_id) },
      include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
    });
    const encaminhamentosIniciais = encaminhamentos.filter((e) =>
      cargosDestinatarios.some(
        (u) =>
          u.id === e.destinatario_id && cargosEspeciais.includes(u.Cargo.nome)
      )
    );
    const totalIniciais = encaminhamentosIniciais.length;

    let podeIntervir = false;
    if (encaminhamentos.length > totalIniciais) {
      podeIntervir = encaminhamentos[0].destinatario_id === usuario_id;
    } else {
      podeIntervir =
        isCriador ||
        (isCargoEspecial &&
          encaminhamentos.some((e) => e.destinatario_id === usuario_id));
    }

    if (!podeIntervir) {
      throw new Error(
        "Você não tem permissão para fechar esta demanda no momento"
      );
    }

    await db.Demanda.update({ status: false }, { where: { id } });
    const demandaAtualizada = await db.Demanda.findByPk(id);

    const destinatariosIds = [
      demanda.usuario_id,
      ...encaminhamentos.map((e) => e.destinatario_id),
    ].filter((id, index, self) => self.indexOf(id) === index);

    await EmailController.enviarEmailDemandaFechada(
      demanda,
      usuarioLogado,
      destinatariosIds
    );

    return demandaAtualizada;
  }
}

export default new FecharDemandaController();
