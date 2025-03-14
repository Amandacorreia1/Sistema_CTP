'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Aluno extends Model {
    static associate(models) {
      Aluno.belongsToMany(models.Condicao, { through: 'CondicaoAluno', foreignKey: 'matricula', otherKey: 'condicao_id' });
      Aluno.hasMany(models.DemandaAluno, { foreignKey: 'aluno_id'});
    }
  }
  Aluno.init({
    matricula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    curso: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      sequelize,
      modelName: 'Aluno',
    });
  return Aluno;
};