'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Encaminhamento extends Model {
    static associate(models) {
      Encaminhamento.belongsToMany(models.Demanda, { foreignKey: 'demanda_id' });
      Encaminhamento.belongsToMany(models.Usuario, { foreignKey: 'usuario_id' });
      Encaminhamento.belongsTo(models.IntervencaoDemanda, { foreignKey: 'intervencao_id'});
    }
  }
  Encaminhamento.init({
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