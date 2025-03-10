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

