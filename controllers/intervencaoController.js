import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Criar Intervenção
export const criarIntervencao = async (req, res) => {
    const { descricao } = req.body;  // Como você mencionou que só precisa da descrição

    try {
        // Criando a nova intervenção
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

// Listar todas as Intervenções
export const listarIntervencao = async (req, res) => {
    try {
        // Buscando todas as intervenções
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

// Listar Intervenções por Demanda
export const listarIntervencaoPorDemanda = async (req, res) => {
    const { demanda_id } = req.params;

    try {
        // Verificando se a demanda existe
        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }

        // Buscando as intervenções associadas à demanda
        const intervencao_res = await db.Intervencao.findAll({
            where: { demanda_id },
        });

        return res.status(200).json({
            intervencao: intervencao_res,
            mensagem: "Intervenções da demanda carregadas com sucesso!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar as intervenções da demanda' });
    }
};
