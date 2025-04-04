import db from "../../models/index.js";

class ListarAlunos {
  async execute() {
    const alunos = await db.Aluno.findAll({
      attributes: ["matricula", "nome", "email", "curso_id"],
      include: [
        { model: db.Curso, as: "Cursos" },
        { model: db.Condicao, as: "Condicaos", through: { attributes: [] } },
      ],
      where: {
        nome: { [db.Sequelize.Op.ne]: "" },
        email: { [db.Sequelize.Op.ne]: "" },
      },
    });

    return alunos.map((aluno) => ({
      matricula: aluno.matricula,
      nome: aluno.nome,
      email: aluno.email,
      curso_id: aluno.curso_id,
      curso: aluno.Cursos ? aluno.Cursos.nome : null,
      condicoes: aluno.Condicaos
        ? aluno.Condicaos.map((condicao) => condicao.nome)
        : [],
    }));
  }
}

export default new ListarAlunos();
