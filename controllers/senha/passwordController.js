import db from "../../models/index.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const recuperarSenha = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await db.Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "E-mail não encontrado." });
    }

    const token = randomBytes(20).toString("hex");
    const expires = Date.now() + 3600000;
    const emailEncoded = Buffer.from(email).toString("base64");

    const resetLink = `http://localhost:3001/redefinir-senha/${token}?expires=${expires}&email=${emailEncoded}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação de Senha",
      text: `Olá,\n\nVocê solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha. Este link é válido por 1 hora:\n\n${resetLink}\n\nSe você não solicitou essa alteração, ignore este e-mail.\n\nAtenciosamente,\nCoordenação Técnico Pedagógica - CTP`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "E-mail de recuperação enviado!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao solicitar recuperação!" });
  }
};

export const redefinirSenha = async (req, res) => {
  const { novaSenha, confirmarSenha } = req.body;
  const { token } = req.params;
  const { expires, email } = req.query;

  if (
    !novaSenha ||
    !confirmarSenha ||
    novaSenha !== confirmarSenha ||
    novaSenha.length < 6
  ) {
    return res.status(400).json({ message: "Senhas inválidas ou diferentes." });
  }

  if (Date.now() > Number(expires)) {
    return res.status(400).json({ message: "Token expirado." });
  }

  if (!email) {
    return res.status(400).json({ message: "Email não fornecido." });
  }

  try {
    const decodedEmail = Buffer.from(email, "base64").toString("ascii");
    const usuario = await db.Usuario.findOne({
      where: { email: decodedEmail },
    });

    if (!usuario) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    await usuario.update({ senha: hashedPassword });

    return res.status(200).json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao redefinir senha!" });
  }
};
