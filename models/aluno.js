'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aluno extends Model {
    static associate(models) {
      Aluno.belongsToMany(models.Condicao, {through: 'CondicaoAluno', foreignKey: 'matricula',
        otherKey: 'condicao_id'});
    }
  }
  Condicao.init({
    matricula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    curso: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  }, 
  {
    sequelize,
    modelName: 'Aluno',
  });
  return Aluno;
};