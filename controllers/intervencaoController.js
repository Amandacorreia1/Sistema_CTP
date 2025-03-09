import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarIntervencao = async (req, res) => {
    const { usuario_id, demanda_id, descricao } = req.body;

    try {
        const usuario_res = await db.Usuario.findByPk(usuario_id);
        if (!usuario_res) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const novaIntervencao = await db.Intervencao.create({
            descricao,
            usuario_id,
            demanda_id
        });

        return res.status(201).json({
            mensagem: 'Intervenção criada com sucesso!',
            intervencao: novaIntervencao
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar a intervenção' });
    }
};

export const listarIntervencaoPorDemanda = async (req, res) => {
    const { demanda_id } = req.params;

    try {
        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        const intervencao_res = await db.Intervencao.findAll({
            where: { demanda_id },
            include: [
                {
                    model: db.Usuario,
                    as: 'Usuario',
                    attributes: ['nome'] 
                },
            ]
        });

        return res.status(200).json({
            intervencao: intervencao_res,
            mensagem: "Intervenções da demanda carregadas com sucesso!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar as intervenções da demanda' });
    }
};

export const listarIntervencao = async (req, res) => {
    try {
        const intervencao_res = await db.Intervencao.findAll({
            include: [
                {
                    model: db.Usuario,
                    as: 'Usuario',
                    attributes: ['nome'] 
                },
                {
                    model: db.Demanda,
                    as: 'Demanda',
                    attributes: ['descricao'] 
                },
            ]
        });

        return res.status(200).json({
            intervencao: intervencao_res,
            mensagem: "Todas as intervenções carregadas com sucesso!"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar as intervenções' });
    }
};
