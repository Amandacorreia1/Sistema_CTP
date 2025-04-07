import db from '../../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarIntervencao = async (req, res) => {
    const { descricao } = req.body;  

    try {
        const novaIntervencao = await db.Intervencao.create({
            descricao,
        });

        return res.status(201).json({
            mensagem: 'Intervenção criada com sucesso!',
            intervencao: novaIntervencao,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a intervenção' });
    }
};

export const listarIntervencao = async (req, res) => {
    try {
        const intervencao_res = await db.Intervencao.findAll();

        return res.status(200).json({
            intervencao: intervencao_res,
            mensagem: "Todas as intervenções carregadas com sucesso!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar as intervenções' });
    }
};

