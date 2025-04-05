import db from "../../models/index.js";

class VerificarAluno {
  async execute({ matricula }) {
    if (
      !matricula ||
      typeof matricula !== "string" ||
      matricula.trim() === ""
    ) {
      throw new Error("Matrícula inválida ou não fornecida");
    }

    try {
      const aluno = await db.Aluno.findOne({
        attributes: ["matricula", "nome", "email", "curso_id"],
        include: [
          {
            model: db.Curso,
            as: "Cursos",
            attributes: ["nome"],
          },
          {
            model: db.Condicao,
            as: "Condicaos",
            attributes: ["id", "nome"],
          },
        ],
        where: { matricula: matricula.trim() },
      });

      if (!aluno) {
        throw new Error("Aluno não encontrado na base de dados local");
      }
      if (!aluno.matricula || !aluno.nome) {
        console.error("Dados do aluno estão incompletos:", aluno.toJSON());
        throw new Error("Dados do aluno estão incompletos na base de dados");
      }

      let cursoNome = null;
      if (aluno.curso_id) {
        const curso = await db.Curso.findByPk(aluno.curso_id, {
          attributes: ["nome"],
        });
        cursoNome = curso?.nome || null;
      } else {
        console.log("Nenhum curso_id associado ao aluno");
      }
      const resultado = {
        matricula: aluno.matricula,
        nome: aluno.nome,
        email: aluno.email || "Email não informado",
        curso: cursoNome || "Curso não informado",
        condicoes:
          aluno.Condicaos && aluno.Condicaos.length > 0 ? aluno.Condicaos : [],
      };

      return resultado;
    } catch (error) {
      throw error;
    }
  }
}

export default new VerificarAluno();
