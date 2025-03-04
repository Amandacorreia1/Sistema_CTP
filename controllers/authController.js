import db from '../models/index.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, matricula, cargo } = req.body;

    try {
        const usuarioExistente = await db.Usuario.findOne({ 
            attributes: ['id', 'matricula', 'nome', 'senha', 'email', 'cargo_id'],
            where: { matricula } 
        });
        if (usuarioExistente) {
            return res.status(400).json({ mensagem: 'Matrícula já está em uso.' });
        }

        const emailExistente = await db.Usuario.findOne({ 
            attributes: ['id', 'matricula', 'nome', 'senha', 'email', 'cargo_id'],
            where: { email } 
        });
        if (emailExistente) {
            return res.status(400).json({ mensagem: 'Email já está em uso.' });
        }

        const cargoEncontrado = await db.Cargo.findOne({ where: { nome: cargo } });

        if (!cargoEncontrado) {
            return res.status(400).json({ mensagem: 'Cargo não encontrado. Cadastre o cargo antes de criar o usuário.' });
        }
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = await db.Usuario.create({ 
            nome, 
            email, 
            senha: senhaCriptografada, 
            matricula,
            cargo_id: cargoEncontrado.id 
        });

        const usuario = novoUsuario.get({ plain: true });
        delete usuario.senha; 

        res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao criar usuário' });
    }
};
