import db from "../../models/index.js";
import axios from "axios";
import https from "https";

class BuscarAluno {
  async execute({ matricula }) {
    console.log(`Buscando aluno localmente: ${matricula}`);
    let aluno = await db.Aluno.findOne({
      attributes: ["matricula", "nome", "email", "curso_id"],
      include: [
        { model: db.Curso, as: "Cursos" },
        { model: db.Condicao, as: "Condicaos", attributes: ["id", "nome"] },
      ],
      where: { matricula },
    });

    if (!aluno) {
      console.log(
        `Aluno não encontrado localmente, consultando API externa: ${matricula}`
      );
      const url = "https://ruapi.cedro.ifce.edu.br/api/student-by-enrollment";
      const config = {
        params: {
          enrollment: matricula,
          token:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      };

      const response = await axios.get(url, config);
      const alunoRu = response.data;
      console.log("Resposta da API externa:", alunoRu);

      if (!alunoRu || !alunoRu.mat) {
        throw new Error("Aluno não encontrado na API externa");
      }

      const nomeCurso = alunoRu.course?.description || "Curso Desconhecido";
      let curso = await db.Curso.findOne({ where: { nome: nomeCurso } });
      if (!curso && nomeCurso) {
        console.log(`Criando curso: ${nomeCurso}`);
        curso = await db.Curso.create({ nome: nomeCurso });
      }

      return {
        matricula: alunoRu.mat || matricula,
        nome: alunoRu.name || "Nome Desconhecido",
        email: alunoRu.user?.[0]?.email || `${matricula}@example.com`,
        curso: curso?.nome || null,
        condicoes: [],
      };
    }

    const curso = await db.Curso.findByPk(aluno.curso_id);
    return {
      matricula: aluno.matricula,
      nome: aluno.nome,
      email: aluno.email,
      curso: curso?.nome || null,
      condicoes: aluno.Condicaos || [],
    };
  }
}

export default new BuscarAluno();
