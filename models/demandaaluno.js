'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class demandaaluno extends Model {
    static associate(models) {
      demandaaluno.belongsTo(models.Demanda, { foreignKey: 'demanda_id'});
      demandaaluno.belongsTo(models.Aluno, { foreignKey: 'matricula'}); 
    }
  }
  demandaaluno.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    demanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Demandas', key: 'id' }
    },
    matricula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Alunos', key: 'id' }
    },
    disciplina:{
      type: DataTypes.STRING,
      allowNull: true
    },

    sequelize,
    modelName: 'demandaaluno',
  });
  return demandaaluno;
};