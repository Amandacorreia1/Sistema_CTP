'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AmparoLegal extends Model {
    static associate(models) {
      AmparoLegal.belongsToMany(models.Demanda, { through: 'AmparoDemanda', foreignKey: 'amparolegal_id', otherKey: 'demanda_id' });
    }
  }
  AmparoLegal.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.ENUM, //saber quais tipos serao determinados
      allowNull: false
    },    
  }, {
    sequelize,
    modelName: 'AmparoLegal',
  });
  return AmparoLegal;
};