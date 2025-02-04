'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IntervencaoDemanda extends Model {
    static associate(models) {
      IntervencaoDemanda.hasOne(models.Demanda, { through: 'Demanda', foreignKey: 'demanda_id'});
      IntervencaoDemanda.hasOne(models.Intervencao, { through: 'Intervencao', foreignKey: 'demanda_id'});
      IntervencaoDemanda.hasOne(models.Usuario, { through: 'Usuario'})
    }
  }
  IntervencaoDemanda.init({
    intervencao_id: {
      type: DataTypes.INTEGER,
    },
    demanda_id: {
      type: DataTypes.INTEGER,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
    },
    data: {
      type: DataTypes.DATE,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'IntervencaoDemanda',
  });
  return IntervencaoDemanda;
};