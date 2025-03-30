'use strict';
import db from '../models/index.js';
import { jwtDecode } from 'jwt-decode';

export const criarIntervencaoDemanda = async (req, res) => {
  const { intervencao_id, demanda_id, data, encaminhamento_id , usuario_id} = req.body;
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!intervencao_id || !demanda_id || !data || !encaminhamento_id || usuario_id) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
  }

  try {
    const decoded = jwtDecode(token);
    const usuario_id = decoded.id;

    const encaminhamento = await db.Encaminhamentos.findByPk(encaminhamento_id);
    if (!encaminhamento) {
      return res.status(404).json({ mensagem: 'Encaminhamento não encontrado.' });
    }

    const intervencaoDemanda = await db.IntervencaoDemanda.create({
      intervencao_id,
      demanda_id,
      encaminhamento_id,
      data,
      usuario_id, 
    });

    return res.status(201).json(intervencaoDemanda);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao criar intervenção de demanda.' });
  }
};

export const listarIntervencoesDemandas = async (req, res) => {
  try {
    const intervencoesDemandas = await db.IntervencaoDemanda.findAll({
      order: [['data', 'ASC']],
      include: [
        {
          model: db.Demanda,
          as: 'Demanda',
          attributes: ['descricao'],
        },
        {
          model: db.Intervencao,
          as: 'Intervencao',
          attributes: ['descricao'],
        },
        {
          model: db.Encaminhamentos,
          as: 'Encaminhamentos',
          attributes: ['usuario_id'],
          include: [
            {
              model: db.Usuario,
              as: 'Remetente',
              attributes: ['nome', 'email'],
            },
            {
              model: db.Usuario,
              as: 'Destinatario',
              attributes: ['nome', 'email'],
            },
          ],
        },
        {
          model: db.Usuario,
          as: 'Usuario', 
          attributes: ['nome', 'email'],
        },
      ],
    });

    return res.status(200).json(intervencoesDemandas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar intervenções de demanda.' });
  }
};

export const buscarIntervencaoDemandaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const intervencaoDemanda = await db.IntervencaoDemanda.findByPk(id, {
      include: [
        {
          model: db.Demanda,
          as: 'Demanda',
          attributes: ['descricao'],
        },
        {
          model: db.Intervencao,
          as: 'Intervencao',
          attributes: ['descricao'],
        },
        {
          model: db.Encaminhamentos,
          as: 'Encaminhamentos',
          attributes: ['usuario_id'],
          include: [
            {
              model: db.Usuario,
              as: 'Remetente',
              attributes: ['nome', 'email'],
            },
            {
              model: db.Usuario,
              as: 'Destinatario',
              attributes: ['nome', 'email'],
            },
          ],
        },
        {
          model: db.Usuario,
          as: 'Usuario', 
          attributes: ['nome', 'email'],
        },
      ],
    });

    if (!intervencaoDemanda) {
      return res.status(404).json({ mensagem: 'Intervenção de demanda não encontrada.' });
    }

    return res.status(200).json(intervencaoDemanda);
  } catch (erro) {
    console.error('Erro ao buscar intervenção de demanda:', erro.message);
    return res.status(500).json({ mensagem: 'Erro ao buscar intervenção de demanda.' });
  }
};