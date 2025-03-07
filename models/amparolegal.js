'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class AmparoLegal extends Model {
    static associate(models) {
      AmparoLegal.belongsToMany(models.Demanda, { through: 'AmparoDemandas', foreignKey: 'amparolegal_id', otherKey: 'demanda_id' });
    }
  }
  AmparoLegal.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'AmparoLegal',
    tableName: 'AmparoLegals'
  });
  return AmparoLegal;
};