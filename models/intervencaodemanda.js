'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class IntervencaoDemanda extends Model {
    static associate(models) {
      IntervencaoDemanda.belongsTo(models.Demanda, { foreignKey: 'demanda_id' });
      IntervencaoDemanda.belongsTo(models.Intervencao, { foreignKey: 'intervencao_id' });
    }
  }
  IntervencaoDemanda.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
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
