import db from "../../models/index.js";
import axios from "axios";
import https from "https";
import CadastrarAluno from "./CadastrarAluno.js";

class VerificarAluno {
  async execute({ matricula }) {
    if (
      !matricula ||
      typeof matricula !== "string" ||
      matricula.trim() === ""
    ) {
      throw new Error("Matrícula inválida ou não fornecida");
    }

    const matriculaTrim = matricula.trim();

    let aluno = await db.Aluno.findOne({
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
      where: { matricula: matriculaTrim },
    });

    if (aluno) {
      let cursoNome = null;
      if (aluno.curso_id) {
        const curso = await db.Curso.findByPk(aluno.curso_id, {
          attributes: ["nome"],
        });
        cursoNome = curso?.nome || "Curso não informado";
      }
      return {
        matricula: aluno.matricula,
        nome: aluno.nome,
        email: aluno.email || "Email não informado",
        curso: cursoNome || "Curso não informado",
        condicoes:
          aluno.Condicaos && aluno.Condicaos.length > 0 ? aluno.Condicaos : [],
      };
    }

    const url = "https://ruapi.cedro.ifce.edu.br/api/student-by-enrollment";
    const config = {
      params: {
        enrollment: matriculaTrim,
        token: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    try {
      const response = await axios.get(url, config);
      const alunoRu = response.data;

      if (!alunoRu || !alunoRu.mat) {
        throw new Error("Aluno não encontrado na API externa");
      }

      const nome = alunoRu.name || "Nome Desconhecido";
      const email = alunoRu.user?.[0]?.email || `${matriculaTrim}@example.com`;
      const nomeCurso = alunoRu.course?.description || "Curso Desconhecido";
      const condicoes = [];

      const novoAluno = await CadastrarAluno.execute({
        matricula: matriculaTrim,
        nome,
        email,
        curso: nomeCurso,
        condicoes,
      });

      return novoAluno;
    } catch (error) {
      throw new Error("Matrícula não encontrada.");
    }
  }
}

export default new VerificarAluno();
