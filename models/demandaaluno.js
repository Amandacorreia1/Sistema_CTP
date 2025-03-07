'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class DemandaAluno extends Model {
    static associate(models) {
      DemandaAluno.belongsTo(models.Demanda, { foreignKey: 'demanda_id' });
      DemandaAluno.belongsTo(models.Aluno, { foreignKey: 'matricula' });
    }
  }
  DemandaAluno.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    demanda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Demandas', key: 'id' }
    },
    matricula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Alunos', key: 'id' }
    },
    disciplina: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {

    sequelize,
    modelName: 'DemandaAluno',
  },
  );
  return DemandaAluno;
};