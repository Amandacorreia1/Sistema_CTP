'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demanda extends Model {
    static associate(models) {
      Demanda.belongsToMany(models.AmparoLegal, {through: 'AmparoDemanda', foreignKey: 'demanda_id', otherKey: 'amparolegal_id'});
    }
  }
  Demanda.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nivel:{
      type: DataTypes.ENUM,
      values: ['Privado','Público'],
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Demanda',
  });
  return Demanda;
};