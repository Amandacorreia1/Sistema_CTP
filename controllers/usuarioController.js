import db from "../models/index.js";

export const buscarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      include: [{ model: db.Cargo, as: "Cargo" }],
      order: [["nome", "ASC"]],
    });
    res
      .status(200)
      .json({ message: "Usuários recuperados com sucesso", usuarios });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro ao listar usuários" });
  }
};

export const buscarUsuariosPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(id, {
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      include: [{ model: db.Cargo, as: "Cargo" }],
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Usuário recuperado com sucesso", usuario });
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ message: "Erro ao buscar usuário por ID" });
  }
};

export const buscarUsuarioPorNome = async (req, res) => {
  const { nome } = req.params;

  if (!nome) {
    return res.status(400).json({ message: "O nome é obrigatório" });
  }

  try {
    const usuarios = await db.Usuario.findAll({
      where: {
        nome: {
          [db.Sequelize.Op.like]: `%${nome}%`,
        },
      },
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      include: [{ model: db.Cargo, as: "Cargo" }],
    });
    res
      .status(200)
      .json({ message: "Usuários recuperados com sucesso", usuarios });
  } catch (error) {
    console.error("Erro ao buscar usuários por nome:", error);
    res.status(500).json({ message: "Erro ao buscar usuários por nome" });
  }
};

export const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cargoId } = req.body;

  try {
    const usuarioExistenteComEmail = await db.Usuario.findOne({
      where: {
        email: email,
        id: { [db.Sequelize.Op.ne]: id }, 
      },
    });

    if (usuarioExistenteComEmail) {
      return res.status(409).json({ mensagem: "Este e-mail já está em uso." });
    }

    const usuario = await db.Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuario.nome = nome || usuario.nome;
    usuario.email = email || usuario.email;
    usuario.cargo_id = cargoId || usuario.cargo_id;

    await usuario.save();

    res.status(200).json({
      mensagem: "Usuário atualizado com sucesso",
      usuario,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ mensagem: "Erro ao atualizar usuário" });
  }
};

export const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await usuario.destroy();
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
};

export const usuariosPorCargo = async (req, res) => {
  const { cargo } = req.params;

  if (!cargo) {
    return res.status(400).json({ message: "O cargo é obrigatório" });
  }

  try {
    const usuarios = await db.Usuario.findAll({
      include: [
        {
          model: db.Cargo,
          as: "Cargo",
          where: {
            nome: {
              [db.Sequelize.Op.like]: `%${cargo}%`,
            },
          },
          attributes: ["nome"],
        },
      ],
      attributes: ["nome", "email", "matricula", "cargo_id"],
    });
    if (usuarios.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum usuário encontrado para este cargo" });
    }

    res.status(200).json({
      message: "Usuários recuperados com sucesso",
      usuarios,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por cargo:", error);
    res.status(500).json({ message: "Erro ao buscar usuários por cargo" });
  }
};

export const UsuariosPorNomeOuCargo = async (req, res) => {
  const { termo } = req.params;
  if (!termo) {
    return res.status(400).json({ message: "O termo de busca é obrigatório" });
  }

  try {
    const decodedTermo = decodeURIComponent(termo);
    const usuarios = await db.Usuario.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { nome: { [db.Sequelize.Op.like]: `%${decodedTermo}%` } },
          {
            cargo_id: {
              [db.Sequelize.Op.in]: db.sequelize.literal(
                `(SELECT id FROM Cargos WHERE nome LIKE '%${decodedTermo}%')`
              ),
            },
          },
        ],
      },
      include: [{ model: db.Cargo, as: "Cargo" }],
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      order: [["nome", "ASC"]],
    });

    if (usuarios.length === 0) {
      return res
        .status(200)
        .json({ message: "Nenhum usuário encontrado", usuarios: [] });
    }

    res.status(200).json({
      message: "Usuários recuperados com sucesso",
      usuarios,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários por nome ou cargo:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários por nome ou cargo" });
  }
};
export const usuariosEncaminhamento = async (req, res) => {
  const usuarioLogadoId = req.usuario.id;

  try {
    const usuarios = await db.Usuario.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: usuarioLogadoId },
      },
      attributes: ["id", "nome", "email", "matricula", "cargo_id"],
      include: [
        {
          model: db.Cargo,
          as: "Cargo",
          where: {
            nome: { [db.Sequelize.Op.ne]: "Admin" },
          },
          required: true,
        },
      ],
    });

    if (usuarios.length === 0) {
      return res
        .status(200)
        .json({ message: "Nenhum usuário elegível encontrado", usuarios: [] });
    }

    res
      .status(200)
      .json({ message: "Usuários recuperados com sucesso", usuarios });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro ao listar usuários" });
  }
};
