'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class IntervencaoDemanda extends Model {
    static associate(models) {
      IntervencaoDemanda.belongsTo(models.Demanda, { foreignKey: 'demanda_id' });
      IntervencaoDemanda.belongsTo(models.Intervencao, { foreignKey: 'intervencao_id' });
      IntervencaoDemanda.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    }
  }

  IntervencaoDemanda.init({
    intervencao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Intervencoes', key: 'id' }
    },
    demanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Demandas', key: 'id' }
    },
    usuario_id: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Usuarios', key: 'id' }
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
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
