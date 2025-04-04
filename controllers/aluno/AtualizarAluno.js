import db from "../../models/index.js";

class AtualizarAluno {
  async execute({ matricula, condicoes }) {
    if (!matricula) {
      throw new Error("Matrícula é obrigatória para identificar o aluno");
    }

    const alunoExistente = await db.Aluno.findOne({
      where: { matricula },
      include: [
        { model: db.Curso, as: "Cursos" },
        { model: db.Condicao, as: "Condicaos" },
      ],
    });
    if (!alunoExistente) {
      throw new Error("Aluno não encontrado");
    }

    if (condicoes && Array.isArray(condicoes) && condicoes.length > 0) {
      const condicaoIds = [];
      for (const condicao of condicoes) {
        let condicaoRecord;
        if (typeof condicao === "object" && condicao.id && condicao.nome) {
          condicaoRecord = await db.Condicao.findOne({
            where: { id: condicao.id },
          });
          if (!condicaoRecord) {
            condicaoRecord = await db.Condicao.create({ nome: condicao.nome });
          }
        } else if (typeof condicao === "string") {
          condicaoRecord = await db.Condicao.findOne({
            where: { nome: condicao },
          });
          if (!condicaoRecord) {
            condicaoRecord = await db.Condicao.create({ nome: condicao });
          }
        } else if (typeof condicao === "number") {
          condicaoRecord = await db.Condicao.findOne({
            where: { id: condicao },
          });
          if (!condicaoRecord) {
            throw new Error(`Condição com ID ${condicao} não encontrada`);
          }
        } else {
          throw new Error("Formato de condição inválido");
        }
        condicaoIds.push(condicaoRecord.id);
      }
      await alunoExistente.setCondicaos(condicaoIds);
    }
    const condicaoRecords = await db.Condicao.findAll({
      where: { id: alunoExistente.Condicaos.map((c) => c.id) },
      attributes: ["id", "nome"],
    });

    return {
      matricula: alunoExistente.matricula,
      nome: alunoExistente.nome,
      email: alunoExistente.email,
      curso: alunoExistente.Cursos?.nome || "Curso não informado",
      condicoes: condicaoRecords.map((c) => ({ id: c.id, nome: c.nome })),
    };
  }
}

export default new AtualizarAluno();
