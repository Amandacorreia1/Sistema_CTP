import db from "../models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const cadastrarUsuario = async (req, res) => {
  console.log(req.body);
  const { nome, email, senha, matricula, cargo } = req.body;

  try {
    const usuarioExistente = await db.Usuario.findOne({
      attributes: ["id", "matricula", "nome", "senha", "email", "cargo_id"],
      where: { matricula },
    });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "Matrícula já está em uso." });
    }

    const emailExistente = await db.Usuario.findOne({
      attributes: ["id", "matricula", "nome", "senha", "email", "cargo_id"],
      where: { email },
    });
    if (emailExistente) {
      return res.status(400).json({ mensagem: "Email já está em uso." });
    }

    if (senha.length < 8) {
      return res
        .status(400)
        .json({ mensagem: "A senha deve ter no mínimo 8 caracteres." });
    }

    const cargoEncontrado = await db.Cargo.findByPk(cargo);

    if (!cargoEncontrado) {
      return res.status(400).json({
        mensagem:
          "Cargo não encontrado. Cadastre o cargo antes de criar o usuário.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = await db.Usuario.create({
      nome,
      email,
      senha: senhaCriptografada,
      matricula,
      cargo_id: cargoEncontrado.id,
    });

    const usuario = novoUsuario.get({ plain: true });
    delete usuario.senha;

    res.status(201).json({ mensagem: "Usuário criado com sucesso", usuario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: "Erro ao criar usuário" });
  }
};

export const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarioExistente = await db.Usuario.findOne({
      attributes: ["id", "matricula", "nome", "senha", "email"],
      where: { email },
      include: [
        {
          model: db.Cargo,
          as: "Cargo",
          attributes: ["nome"],
        },
      ],
    });

    if (!usuarioExistente) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioExistente.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    const token = jwt.sign(
      {
        id: usuarioExistente.id,
        nome: usuarioExistente.nome,
        cargo: usuarioExistente.Cargo.nome,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login bem-sucedido.", token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
};
