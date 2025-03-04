'use strict';
import { Model}  from 'sequelize';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  class Condicao extends Model {
    static associate(models) {
      Condicao.belongsToMany(models.Aluno, {
        through: 'CondicaoAluno', foreignKey: 'condicao_id',
        otherKey: 'matricula'
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
      type: DataTypes.ENUM,
      values: ['Transtorno do Espectro Autista', 'TDAH(Transtorno do Déficit de Atenção com Hiperatividade)',
        'Deficiência Auditiva', 'Deficiência Motora/Física', 'Deficiência Visual(cegueira ou baixa visão)',
        'Transtornos do Desenvolvimento Global',
        'Deficiência Intelectual', 'Deficiência Múltipla', 'Portador de Altas Habilidades', 'Outra'
      ],
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Condicao',
  });

  return Condicao;
};
