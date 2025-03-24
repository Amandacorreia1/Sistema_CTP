import db from '../models/index.js';  
export const listarCondicoes = async (req, res) => {
    try {
      const condicoes = await db.Condicao.findAll({
        attributes: ['id','nome'],
        order: [
          ['nome', 'ASC'],  
        ]
      });
      const outraCondicaoIndex = condicoes.findIndex(condicao => condicao.nome === 'Outra');
      
      if (outraCondicaoIndex !== -1) {
        const outraCondicao = condicoes.splice(outraCondicaoIndex, 1);
        condicoes.push(outraCondicao[0]);
      }
  
      return res.status(200).json(condicoes);  
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao buscar condições.' });
    }
};

export const addCondicao = async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome da condição é obrigatório.' });
  }

  try {
    const condicao = await db.Condicao.create({ nome });

    return res.status(201).json(condicao);  
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao criar condição.' });
  }
};

export const removeCondicao = async (req, res) => {
  const { id } = req.params;

  try {
    const condicao = await db.Condicao.findByPk(id);

    if (!condicao) {
      return res.status(404).json({ mensagem: 'Condição não encontrada.' });
    }

    await condicao.destroy();

    return res.status(200).json({ mensagem: 'Condição removida com sucesso.' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao remover condição.' });
  }
};
