import db from "../../models/index.js";

class AdicionarCondicao {
  async execute(req) {
    const { id_condicao } = req.body;
    const { id } = req.params;

    const aluno = await db.Aluno.findOne({ where: { matricula: id } });
    if (!aluno) throw new Error("Aluno não encontrado");

    const condicoes = Array.isArray(id_condicao) ? id_condicao : [id_condicao];
    const condicoesNaoExistem = [];

    for (let condicaoId of condicoes) {
      const condicaoExistente = await db.Condicao.findOne({
        where: { id: condicaoId },
      });

      if (condicaoExistente) {
        const dataAtual = new Date();
        await db.sequelize.query(
          "INSERT INTO condicaoalunos (aluno_id, condicao_id, createdAt, updatedAt) VALUES (:aluno_id, :condicao_id, :createdAt, :updatedAt)",
          {
            replacements: {
              aluno_id: aluno.matricula,
              condicao_id: condicaoId,
              createdAt: dataAtual,
              updatedAt: dataAtual,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );
      } else {
        condicoesNaoExistem.push(condicaoId);
      }
    }

    if (condicoesNaoExistem.length === 0) {
      return { mensagem: "Condição(s) associada(s) ao aluno com sucesso" };
    } else {
      throw new Error(
        "Condição(ões) não encontrada(s): " + condicoesNaoExistem.join(", ")
      );
    }
  }
}

export default new AdicionarCondicao();
