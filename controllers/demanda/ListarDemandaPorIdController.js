import db from "../../models/index.js";

class ListarDemandaPorIdController {
  async execute({ id, usuario_id }) {
    const demanda = await db.Demanda.findOne({
      where: { id },
      include: [
        {
          model: db.Usuario,
          as: "Usuarios",
          attributes: ["id", "nome", "email"],
          include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
        },
        {
          model: db.DemandaAluno,
          as: "DemandaAlunos",
          include: [
            {
              model: db.Aluno,
              attributes: ["matricula", "nome", "email"],
              include: [
                { model: db.Curso, as: "Cursos", attributes: ["id", "nome"] },
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
              attributes: ["id", "nome"],
              include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
            },
            {
              model: db.Usuario,
              as: "Destinatario",
              attributes: ["id", "nome"],
              include: [{ model: db.Cargo, as: "Cargo", attributes: ["nome"] }],
            },
          ],
        },
        {
          model: db.IntervencaoDemanda,
          as: "IntervencoesDemandas",
          include: [
            { model: db.Intervencao, as: "Intervencao" },
            {
              model: db.Encaminhamentos,
              as: "Encaminhamentos",
              include: [
                { model: db.Usuario, as: "Remetente" },
                { model: db.Usuario, as: "Destinatario" },
              ],
            },
            { model: db.Usuario, as: "Usuarios" },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!demanda) throw new Error("Demanda não encontrada");

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

    return { demanda, podeIntervir };
  }
}

export default new ListarDemandaPorIdController();
