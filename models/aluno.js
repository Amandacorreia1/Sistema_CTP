'use strict';
import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Aluno extends Model {
    static associate(models) {
      Aluno.belongsToMany(models.Condicao, {
        through: 'CondicaoAlunos',
        foreignKey: 'aluno_id',
        otherKey: 'condicao_id',
        as: 'Condicaos'
      });
      Aluno.hasMany(models.DemandaAluno, { foreignKey: 'aluno_id' });
      Aluno.belongsTo(models.Curso, { foreignKey: 'curso_id', as: 'Cursos' });
    }
  }
  Aluno.init({
    matricula: {
      type: DataTypes.STRING(14),
      primaryKey: true,
      validate: {
        isNumeric: true
      }
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cursos',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Aluno'
  });

  return Aluno;
};