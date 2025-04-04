import db from "../../models/index.js";

class AtualizarAluno {
  async execute({ matricula, nome, email, curso, condicoes }) {
    if (!nome || !email || !curso) {
      throw new Error("Nome, email, curso são obrigatórios");
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (!alunoExistente) {
      throw new Error("Aluno não encontrado");
    }

    let cursoExistente = await db.Curso.findOne({ where: { nome: curso } });
    if (!cursoExistente) {
      cursoExistente = await db.Curso.create({ nome: curso });
    }

    await alunoExistente.update({
      nome,
      email,
      curso_id: cursoExistente.id,
    });

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
        condicaoRecord = await db.Condicao.findOne({ where: { id: condicao } });
        if (!condicaoRecord) {
          throw new Error(`Condição com ID ${condicao} não encontrada`);
        }
      } else {
        throw new Error("Formato de condição inválido");
      }
      condicaoIds.push(condicaoRecord.id);
    }

    await alunoExistente.setCondicaos(condicaoIds);

    const condicaoRecords = await db.Condicao.findAll({
      where: { id: condicaoIds },
      attributes: ["id", "nome"],
    });

    return {
      matricula: alunoExistente.matricula,
      nome: alunoExistente.nome,
      email: alunoExistente.email,
      curso: cursoExistente.nome,
      condicoes: condicaoRecords.map((c) => ({ id: c.id, nome: c.nome })),
    };
  }
}

export default new AtualizarAluno();
