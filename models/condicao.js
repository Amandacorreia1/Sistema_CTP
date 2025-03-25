'use strict';
import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Condicao extends Model {
    static associate(models) {
      Condicao.belongsToMany(models.Aluno, {
        through: 'CondicaoAlunos',
        foreignKey: 'condicao_id',
        otherKey: 'aluno_id'
      });
    }
  }
  Condicao.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Condicao',
    tableName: 'Condicoes',
  });

  return Condicao;
};