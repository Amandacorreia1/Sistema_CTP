'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Condicao extends Model {
    static associate(models) {
      Condicao.belongsToMany(models.Aluno, {through: 'CondicaoAluno', foreignKey: 'condicao_id',
        otherKey: 'matricula'});
    }
  }
  Condicao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING, // COLOCAR O ENUM
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Condicao',
  });

  return Condicao;
};
