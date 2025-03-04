'use strict';
import { Model } from 'sequelize';
import bcrypt from 'bcrypt';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsTo(models.Cargo, { foreignKey: 'cargo_id' });
      Usuario.hasMany(models.Demanda, { foreignKey: 'usuario_id' });
      Usuario.belongsTo(models.Encaminhamento, { foreignKey: 'encaminhamento_id' });
    }
  }
  Usuario.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    matricula: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 8,
          msg: "Senha precisa ter 8 caracteres."
        },
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    cargo_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cargos',
        key: 'id'
      },
      allowNull: false,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      }
    },
    tableName: 'Usuarios'
  });
  return Usuario;
};