import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarDemandaAluno = async (req, res) => {
    const { demanda_id, aluno_id, disciplina } = req.body;

    try {
        const demanda = await db.Demanda.findByPk(demanda_id);
        if (!demanda) {
            return res.status(404).json({ mensagem: 'Demanda não encontrada' });
        }
        const aluno = await db.Aluno.findByPk(aluno_id);
        if (!aluno) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado' });
        }
        const novaDemandaAluno = await db.DemandaAluno.create({
            demanda_id,
            aluno_id,
            disciplina,
        });

        return res.status(201).json({
            mensagem: 'Demanda de aluno criada com sucesso',
            demandaAluno: novaDemandaAluno
        });

    } catch (erro) {
        console.error('Erro ao criar demanda de aluno:', erro);
        return res.status(500).json({ mensagem: 'Erro ao criar demanda de aluno' });
    }
};
export const listarDemandasAlunos = async (req, res) => {
    try {
        const demandasAlunos = await db.DemandaAluno.findAll({
            include: [
                {
                    model: db.Demanda,
                    attributes: ['descricao'],
                },
                {
                    model: db.Aluno,
                    attributes: ['nome'], 
                }
            ],
            order: [['id', 'ASC']] 
        });

        if (!demandasAlunos || demandasAlunos.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda de aluno encontrada' });
        }

        return res.status(200).json(demandasAlunos);
    } catch (erro) {
        console.error('Erro ao listar demandas de alunos:', erro);
        return res.status(500).json({ mensagem: 'Erro ao listar demandas de alunos' });
    }
};

export const buscarDemandaAlunoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const demandaAluno = await db.DemandaAluno.findByPk(id, {
            include: [
                {
                    model: db.Demanda,
                    attributes: ['descricao'], 
                },
                {
                    model: db.Aluno,
                    attributes: ['nome'], 
                }
            ]
        });

        if (!demandaAluno) {
            return res.status(404).json({ mensagem: 'Demanda de aluno não encontrada' });
        }

        return res.status(200).json(demandaAluno);
    } catch (erro) {
        console.error('Erro ao buscar demanda de aluno:', erro);
        return res.status(500).json({ mensagem: 'Erro ao buscar demanda de aluno' });
    }
};

