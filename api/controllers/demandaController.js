import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarDemanda = async (req, res) => {
    const {id, descricao, status, nivel, usuario_id } = req.body;

    try {
       

        // Verificar se o usuário existe
        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        // Validar o nível da demanda
        if (!['Privado', 'Público'].includes(nivel)) {
            return res.status(400).json({ mensagem: 'Nível inválido. Deve ser Privado ou Público.' });
        }


        // Criar a nova demanda
        const novaDemanda = await db.Demanda.create({
            usuario_id,
            descricao,
            status: true,  // Aqui estou assumindo que o status será sempre 'true' (ativo)
            nivel,
        });

       
        // Retornar a resposta de sucesso
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
        // Buscar todas as demandas, incluindo informações do usuário associado
        const demandas = await db.Demanda.findAll({
            include: [
                {
                    model: db.Usuario,
                    attributes: ['nome', 'email'], // Retornando o nome e email do usuário
                },
            ],
        });

        if (demandas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda encontrada' });
        }

        // Retornar as demandas encontradas
        res.status(200).json({ demandas });
    } catch (erro) {
        console.error('Erro ao listar demandas:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar demandas' });
    }
};
