'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cargo extends Model {
    static associate(models) {
      Cargo.BelongsTo(models.Usuario, { foreignKey: 'cargo_id' });
    }
  }
  Cargo.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.ENUM,
      values: ['Diretor Geral', 'Coodernador', 'Funcionario CTP', "Diretor Ensino", "Professor", "Aluno"],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cargo',
    tableName: 'Cargos'
  });
  return Cargo;
};