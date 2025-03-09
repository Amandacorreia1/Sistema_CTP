import db from '../models/index.js';
import dotenv from 'dotenv';
import { buscarAluno } from './alunoController.js'; 
import { listarCondicoes } from './condicaoController.js'; 
import { listarAmparoLegal } from './amparolegalController.js'; 

dotenv.config();

export const criarDemanda = async (req, res) => {
    const { matricula, usuario_id, descricao, nivel, condicao_id, amparo_legal_nome } = req.body;

    try {
        const alunoResponse = await buscarAluno({ params: { matricula } }, res);
        if (!alunoResponse || alunoResponse.statusCode === 404) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado' });
        }
        const aluno = alunoResponse.data;

        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        if (!['Privado', 'Público'].includes(nivel)) {
            return res.status(400).json({ mensagem: 'Nível inválido. Deve ser Privado ou Público.' });
        }

        const amparosLegaisResponse = await listarAmparoLegal(req, res);
        const amparosLegais = amparosLegaisResponse.data || [];

        let amparoLegal = amparosLegais.find(amparo => amparo.nome === amparo_legal_nome);

        if (!amparoLegal) {
            amparoLegal = await db.AmparoLegal.create({ nome: amparo_legal_nome });
        }

        const novaDemanda = await db.Demanda.create({
            usuario_id,
            descricao,
            status: true, 
            nivel,
            amparo_legal_id: amparoLegal.id 
        });

        await db.DemandaAluno.create({
            demanda_id: novaDemanda.id,
            matricula
        });

        const condicoesResponse = await listarCondicoes(req, res);
        const condicoes = condicoesResponse.data;

        if (condicao_id) {
            const condicao = await db.Condicao.findByPk(condicao_id);
            if (!condicao) {
                return res.status(404).json({ mensagem: 'Condição não encontrada' });
            }

            await db.AlunoCondicao.create({
                aluno_id: aluno.id,
                condicao_id
            });
        }

        res.status(201).json({
            mensagem: 'Demanda criada com sucesso',
            demanda: novaDemanda,
            condicoes
        });
    } catch (erro) {
        console.error('Erro ao criar demanda:', erro);
        res.status(500).json({ mensagem: 'Erro ao criar demanda' });
    }
}
    export const listarDemandas = async (req, res) => {
        try {
            const demandas = await db.Demanda.findAll({
                include: [
                    {
                        model: db.Usuario,
                        attributes: ['nome', 'email'],
                    },
                    {
                        model: db.AmparoLegal,
                        attributes: ['nome'],
                    },
                    {
                        model: db.Condicao,
                        attributes: ['nome'],
                        through: { attributes: [] },
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
    

