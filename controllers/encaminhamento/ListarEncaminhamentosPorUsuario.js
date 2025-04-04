import db from "../../models/index.js";

class ListarEncaminhamentosPorUsuario {
  async execute({ id }) {
    const usuario_res = await db.Usuario.findByPk(id);
    if (!usuario_res) throw new Error("Usuário não encontrado");

    const encaminhamentos = await db.Encaminhamentos.findAll({
      where: { usuario_id: id },
      include: [
        { model: db.Usuario, as: "Remetente" },
        { model: db.Demanda, as: "Demanda" },
        { model: db.Usuario, as: "Destinatario" },
      ],
    });

    return encaminhamentos;
  }
}

export default new ListarEncaminhamentosPorUsuario();
