import db from "../../models/index.js";

class ListarEncaminhamentos {
  async execute() {
    const encaminhamentos = await db.Encaminhamentos.findAll({
      include: [
        { model: db.Usuario, as: "Remetente" },
        { model: db.Demanda, as: "Demanda" },
        { model: db.Usuario, as: "Destinatario" },
      ],
    });

    return encaminhamentos;
  }
}

export default new ListarEncaminhamentos();
