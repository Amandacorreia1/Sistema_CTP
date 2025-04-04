import db from "../../models/index.js";

class CadastrarAluno {
  async execute({ matricula, nome, email, curso, condicoes }) {
    if (!matricula || !nome || !email || !curso) {
      throw new Error("Matrícula, nome, email, curso são obrigatórios");
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (alunoExistente) {
      throw new Error("Já existe um aluno cadastrado com essa matrícula");
    }

    let cursoExistente = await db.Curso.findOne({ where: { nome: curso } });
    if (!cursoExistente) {
      cursoExistente = await db.Curso.create({ nome: curso });
    }

    const novoAluno = await db.Aluno.create({
      matricula,
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

    await novoAluno.addCondicaos(condicaoIds);

    const condicaoRecords = await db.Condicao.findAll({
      where: { id: condicaoIds },
      attributes: ["id", "nome"],
    });

    return {
      matricula: novoAluno.matricula,
      nome: novoAluno.nome,
      email: novoAluno.email,
      curso: cursoExistente.nome,
      condicoes: condicaoRecords.map((c) => ({ id: c.id, nome: c.nome })),
    };
  }
}

export default new CadastrarAluno();
