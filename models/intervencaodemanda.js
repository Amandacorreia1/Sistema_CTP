'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class IntervencaoDemanda extends Model {
    static associate(models) {
      IntervencaoDemanda.belongsTo(models.Demanda, { foreignKey: 'demanda_id', as: 'Demanda' });
      IntervencaoDemanda.belongsTo(models.Intervencao, { foreignKey: 'intervencao_id', as: 'Intervencao' });
      IntervencaoDemanda.belongsTo(models.Encaminhamentos, { foreignKey: 'encaminhamento_id', as: 'Encaminhamentos' });
      IntervencaoDemanda.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'Usuarios' });
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
    encaminhamento_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Encaminhamentos', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Usuarios', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'IntervencaoDemanda',
    tableName: 'IntervencaoDemanda',
    underscored: true
  });

  return IntervencaoDemanda;
};
