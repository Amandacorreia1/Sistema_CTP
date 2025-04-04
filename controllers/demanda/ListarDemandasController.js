import db from "../../models/index.js";

class ListarDemandasController {
  async execute() {
    const demandas = await db.Demanda.findAll({
      include: [
        { model: db.Usuario, attributes: ["nome", "email"] },
        {
          model: db.AmparoLegal,
          through: { attributes: [] },
          attributes: ["id", "nome"],
        },
      ],
    });
    if (demandas.length === 0) throw new Error("Nenhuma demanda encontrada");
    return demandas;
  }
}

export default new ListarDemandasController();
