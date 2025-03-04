'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Intervencao extends Model {
    static associate(models) {
      Intervencao.belongsToMany(models.Demanda, { through: 'IntervencaoDemanda', foreignKey: 'intervencao_id' });
    }
  }
  Intervencao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
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