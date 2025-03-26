import db from '../models/index.js';  

export const listarAmparoLegal = async (req, res) => {
    try {
      const amparosLegais = await db.AmparoLegal.findAll({
        attributes: ['id', 'nome'],
        order: [['nome', 'ASC']], 
      });
      const indexOutra = amparosLegais.findIndex(amparo => amparo.nome === 'Outra');
      
      if (indexOutra !== -1) {
        const outraAmparoLegal = amparosLegais.splice(indexOutra, 1); 
        amparosLegais.push(outraAmparoLegal[0]);  
      }
  
      return res.status(200).json(amparosLegais);  
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao buscar amparos legais.' });
    }
};

export const addAmparoLegal = async (req, res) => {
  const { nome } = req.body; 

  if (!nome) {
    return res.status(400).json({ mensagem: 'O nome do amparo legal é obrigatório.' });
  }

  try {
    if (nome.toLowerCase() === "outra") {
      const amparoLegal = await db.AmparoLegal.create({ nome });

      return res.status(201).json(amparoLegal);
    }

    const amparoExistente = await db.AmparoLegal.findOne({ where: { nome } });
    if (amparoExistente) {
      return res.status(400).json({ mensagem: 'Amparo legal já cadastrado.' });
    }

    const amparoLegal = await db.AmparoLegal.create({ nome });

    return res.status(201).json(amparoLegal);  
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao criar amparo legal.' });  
  }
};

export const removeAmparoLegal = async (req, res) => {
  const { id } = req.params;   
  
  try {
    const amparoLegal = await db.AmparoLegal.findByPk(id);  

    if (!amparoLegal) {
      return res.status(404).json({ mensagem: 'Amparo legal não encontrado.' }); 
    }

    await amparoLegal.destroy(); 

    return res.status(200).json({ mensagem: 'Amparo legal removido com sucesso.' });  
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao remover amparo legal.' });  
  }
}
export const listarAmparosPorDemanda = async (req, res) => {
    const { demandaId } = req.params; 
  
    try {
      if (!demandaId) {
        return res.status(400).json({ mensagem: 'O ID da demanda é obrigatório.' });
      }
  
      const amparosDemandas = await db.AmparoDemanda.findAll({
        where: { demanda_id: demandaId },
        include: [
          {
            model: db.AmparoLegal,
            as: 'AmparoLegal', 
            attributes: ['id', 'nome'],
          },
        ],
        attributes: ['id', 'demanda_id', 'amparoLegal_id'], 
      });
  
      if (!amparosDemandas || amparosDemandas.length === 0) {
        return res.status(200).json([]); 
      }
  
      const amparosLegais = amparosDemandas.map((ad) => ({
        id: ad.AmparoLegal.id,
        nome: ad.AmparoLegal.nome,
      }));
  
      return res.status(200).json(amparosLegais);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ mensagem: 'Erro ao buscar amparos legais da demanda.' });
    }
  
};
