import nodemailer from "nodemailer";
import dotenv from "dotenv";
import db from "../../models/index.js";

dotenv.config();

class EmailController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  formatDateToDisplay(isoDate) {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }

  async enviarEmailEncaminhamento(
    remetenteNome,
    destinatariosIds,
    demandaId,
    descricao,
    data
  ) {
    const demanda = await db.Demanda.findByPk(demandaId, {
      include: [
        {
          model: db.DemandaAluno,
          as: "DemandaAlunos",
          include: [
            {
              model: db.Aluno,
              as: "Aluno",
              attributes: ["nome"],
              include: [
                { model: db.Curso, as: "Cursos", attributes: ["nome"] },
              ],
            },
          ],
        },
        {
          model: db.AmparoLegal,
          through: { attributes: [] },
          attributes: ["nome"],
        },
      ],
    });

    if (!demanda) {
      console.error("Demanda não encontrada:", demandaId);
      return;
    }

    const destinatarios = await db.Usuario.findAll({
      where: { id: destinatariosIds },
      attributes: ["id", "nome", "email"],
    });

    const alunosEnvolvidos =
      demanda.DemandaAlunos.length > 0
        ? demanda.DemandaAlunos.map(
            (da) =>
              `${da.Aluno.nome} (${
                da.Aluno.Cursos?.nome || "Curso não informado"
              })`
          ).join(", ")
        : "Nenhum aluno envolvido";

    const amparoLegal =
      demanda.AmparoLegals.length > 0
        ? demanda.AmparoLegals.map((amparo) => amparo.nome).join(", ")
        : "Nenhum amparo legal associado";

    for (const destinatario of destinatarios) {
      if (!destinatario.email) {
        console.error(
          `Destinatário ${destinatario.nome} (ID: ${destinatario.id}) sem e-mail`
        );
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario.email,
        subject: "Encaminhamento de Demanda",
        text: `Olá ${
          destinatario.nome
        },\n\nVocê recebeu um novo encaminhamento de ${remetenteNome}.\n\nDescrição: ${descricao}\nAlunos envolvidos: ${alunosEnvolvidos}\nData: ${this.formatDateToDisplay(
          data
        )}\nAmparo legal: ${amparoLegal}\n\nAtenciosamente,\nCoordenação Técnico Pedagógica - CTP`,
      };
      await this.transporter.sendMail(mailOptions);
    }
  }

  async enviarEmailDemandaFechada(demanda, usuarioLogado, destinatariosIds) {
    const usuariosNotificados = await db.Usuario.findAll({
      where: { id: destinatariosIds },
      attributes: ["id", "nome", "email"],
    });

    const alunosEnvolvidos =
      demanda.DemandaAlunos.length > 0
        ? demanda.DemandaAlunos.map(
            (da) =>
              `${da.Aluno.nome} (${
                da.Aluno.Cursos?.nome || "Curso não informado"
              })`
          ).join(", ")
        : "Nenhum aluno envolvido";

    for (const usuario of usuariosNotificados) {
      if (!usuario.email) {
        console.error(`Usuário ${usuario.nome} (ID: ${usuario.id}) sem e-mail`);
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: usuario.email,
        subject: "Demanda Fechada",
        text: `Olá ${usuario.nome},\n\nA demanda #${
          demanda.id
        } foi fechada por ${usuarioLogado.nome} em ${this.formatDateToDisplay(
          new Date()
        )}.\n\nDescrição: ${
          demanda.descricao
        }\nAlunos envolvidos: ${alunosEnvolvidos}\n\nAtenciosamente,\nCoordenação Técnico Pedagógica - CTP`,
      };
      await this.transporter.sendMail(mailOptions);
    }
  }
}

export default new EmailController();
