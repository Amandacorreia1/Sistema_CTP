'use strict';
import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Curso extends Model {
    static associate(models) {
      Curso.hasMany(models.Aluno, { foreignKey: 'curso_id', as: 'Cursos' });
    }
  }

  Curso.init({
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
    modelName: 'Curso',
    tableName: 'Cursos',
  });

  return Curso;
};