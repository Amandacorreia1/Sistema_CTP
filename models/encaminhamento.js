'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Encaminhamento extends Model {
    static associate(models) {
      Encaminhamento.hasOne(models.Usuario, { foreignKey: 'remetente_id' });
      Encaminhamento.hasOne(models.Usuario, { foreignKey: 'destinario_id' });
      Encaminhamento.belongsTo(models.IntervencaoDemanda, { foreignKey: 'intervencaodemanda_id' });
      Encaminhamento.belongsTo(models.Demanda, { foreignKey: 'demanda_id' });
    }
  }
  Encaminhamento.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    demanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    destinatario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Encaminhamento',
  });
  return Encaminhamento;
};