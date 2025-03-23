import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarDemanda = async (req, res) => {
    const {id, descricao, status, disciplina, usuario_id, alunos} = req.body;

    try {
       
        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        if(!alunos){
            return res.status(404).json({ mensagem: 'Os alunos não foram informados.' });
        }

        const novaDemanda = await db.Demanda.create({
            usuario_id,
            descricao,
            status: true,  
            disciplina,
        });

        if(alunos && alunos.length > 0){
            for(const aluno of alunos){
                const alunoExistente = await db.Aluno.findByPk(aluno.id);
                
                if(!alunoExistente){
                    return res.status(404).json({ mensagem: `Aluno com ID ${aluno.id} não encontrado.` });
                }

                await db.DemandaAluno.create({
                    demanda_id: novaDemanda.id,
                    aluno_id: aluno.id,
                });
            }
        }

        return res.status(201).json({
            mensagem: 'Demanda criada com sucesso',
            demanda: novaDemanda
        });

    } catch (erro) {
        console.error('Erro ao criar demanda:', erro);
        return res.status(500).json({ mensagem: 'Erro ao criar demanda' });
    }
};

export const listarDemandas = async (req, res) => {
    try {
        const demandas = await db.Demanda.findAll({
            include: [
                {
                    model: db.Usuario,
                    attributes: ['nome', 'email'], 
                },
            ],
        });

        if (demandas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda encontrada' });
        }

        res.status(200).json({ demandas });
    } catch (erro) {
        console.error('Erro ao listar demandas:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar demandas' });
    }
};

  export const listarDemandasUsuario = async (req, res) => {
    try {
        const usuario_id = req.usuario.id; 
    
        if (!usuario_id) {
            return res.status(400).json({ mensagem: 'ID do usuário não encontrado no token' });
        }
    
        const usuario = await db.Usuario.findByPk(usuario_id, {
            attributes: ['id', 'nome', 'email', 'matricula', 'cargo_id'],
            include: [{ model: db.Cargo, as: 'Cargo' }], 
        });

        let demandas;

        if(usuario.cargo_id === 4 || usuario.cargo_id === 3 || usuario.cargo_id === 2){
            demandas = await db.Demanda.findAll({
                include: [
                    {
                        model: db.Usuario,
                        attributes: ['nome', 'email'], 
                    },
                ],
            });

        } else {
            demandas = await db.Demanda.findAll({
                where: {
                    usuario_id: usuario_id, 
                },
                include: [
                    {
                        model: db.Usuario,
                        attributes: ['nome', 'email'], 
                    },
                ],
            });

        }
        

        if (demandas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda encontrada para este usuário' });
        }

        return res.status(200).json({ demandas });
    } catch (erro) {
        console.error('Erro ao listar demandas do usuário:', erro);
        return res.status(500).json({ mensagem: 'Erro ao listar demandas do usuário' });
    }
};