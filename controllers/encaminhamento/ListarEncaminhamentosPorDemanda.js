import db from "../../models/index.js";

class ListarEncaminhamentosPorDemanda {
  async execute({ id }) {
    const demanda_res = await db.Demanda.findByPk(id);
    if (!demanda_res) throw new Error("Demanda não encontrada");

    const encaminhamentos = await db.Encaminhamentos.findAll({
      where: { demanda_id: id },
      include: [
        { model: db.Usuario, as: "Remetente" },
        { model: db.Demanda, as: "Demanda" },
        { model: db.Usuario, as: "Destinatario" },
      ],
    });

    return encaminhamentos;
  }
}

export default new ListarEncaminhamentosPorDemanda();
