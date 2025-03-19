import db from '../models/index.js';

export const buscarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'matricula', 'cargo_id'],
      include: [{ model: db.Cargo, as: 'Cargo' }], 
    });
    res.status(200).json({ message: 'Usuários recuperados com sucesso', usuarios });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

export const buscarUsuariosPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(id, {
      attributes: ['id', 'nome', 'email', 'matricula', 'cargo_id'],
      include: [{ model: db.Cargo, as: 'Cargo' }], 
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário recuperado com sucesso', usuario });
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário por ID' });
  }
};

export const buscarUsuarioPorNome = async (req, res) => {
  const { nome } = req.params; 

  if (!nome) {
    return res.status(400).json({ message: 'O nome é obrigatório' });
  }

  try {
    const usuarios = await db.Usuario.findAll({
      where: {
        nome: {
          [db.Sequelize.Op.like]: `%${nome}%`,
        },
      },
      attributes: ['id', 'nome', 'email', 'matricula', 'cargo_id'],
      include: [{ model: db.Cargo, as: 'Cargo' }],
    });
    res.status(200).json({ message: 'Usuários recuperados com sucesso', usuarios });
  } catch (error) {
    console.error('Erro ao buscar usuários por nome:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários por nome' });
  }
};

export const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, matricula, email, senha, cargoId } = req.body;

  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    usuario.nome = nome;
    usuario.matricula = matricula;
    usuario.email = email;
    usuario.senha = senha;
    usuario.cargo_id = cargoId;
    await usuario.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso', usuario });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

export const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    await usuario.destroy();
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};


export const usuariosPorCargo = async (req, res) => {
  const { cargo } = req.params;

  if (!cargo) {
    return res.status(400).json({ message: 'O cargo é obrigatório' });
  }

  try {
    const usuarios = await db.Usuario.findAll({
      include: [{
        model: db.Cargo,
        as: 'Cargo',
        where: {
          nome: {
            [db.Sequelize.Op.like]: `%${cargo}%`
          }
        },
        attributes: ['nome']
      }],
      attributes: ['nome', 'email', 'matricula', 'cargo_id']
    });
    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado para este cargo' });
    }

    res.status(200).json({
      message: 'Usuários recuperados com sucesso',
      usuarios
    });
  } catch (error) {
    console.error('Erro ao buscar usuários por cargo:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários por cargo' });
  }
};