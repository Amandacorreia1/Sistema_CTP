'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Intervencao extends Model {
    static associate(models) {
      Intervencao.belongsToMany(models.Demanda, { through: 'IntervencaoDemanda', foreignKey: 'intervencaoId', otherKey: 'demandaId' })
      
    }
  }
  Intervencao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      sequelize,
      modelName: 'Intervencao',
    });
  return Intervencao;
};