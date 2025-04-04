import db from "../../models/index.js";

class CriarDemanda {
  async execute({ descricao, disciplina, status, usuario_id }) {
    if (!usuario_id) throw new Error("ID do usuário é obrigatório");
    if (!descricao || descricao.trim() === "")
      throw new Error("Descrição da demanda é obrigatória");

    const novaDemanda = await db.Demanda.create({
      descricao,
      disciplina: disciplina || null,
      status: status || "Pendente",
      usuario_id,
    });

    return novaDemanda;
  }
}

export default new CriarDemanda();
