import db from '../models/index.js';

export const criarIntervencaoDemanda = async (req, res) => {
    const { intervencao_id, demanda_id, data, descricao, encaminhamento_id } = req.body;
  
    if (!intervencao_id || !demanda_id || !data || !descricao || !encaminhamento_id) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }
  
    try {
      const encaminhamento = await db.Encaminhamento.findByPk(encaminhamento_id);
  
      if (!encaminhamento) {
        return res.status(404).json({ mensagem: 'Encaminhamento não encontrado.' });
      }
  
      const usuario_id = encaminhamento.usuario_id;
  
      const intervencaoDemanda = await db.IntervencaoDemanda.create({
        intervencao_id,
        demanda_id,
        encaminhamento_id,  
        data,
        descricao,
        usuario_id 
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
            attributes: ['descricao'] 
          },
          {
            model: db.Intervencao,  
            attributes: ['descricao'] 
          },
          {
            model: db.Encaminhamento, 
            attributes: ['usuario_id'],  
            include: [
              {
                model: db.Usuario, 
                attributes: ['nome']
              }
            ]
          }
        ]
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
    const intervencaoDemanda = await db.IntervencaoDemanda.findByPk(id);

    if (!intervencaoDemanda) {
      return res.status(404).json({ mensagem: 'Intervenção de demanda não encontrada.' });
    }

    return res.status(200).json(intervencaoDemanda);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar intervenção de demanda.' });
  }
};


