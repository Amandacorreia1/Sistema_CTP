'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demanda extends Model {
    static associate(models) {
      Demanda.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
      Demanda.belongsToMany(models.AmparoLegal, { through: 'AmparoDemanda', foreignKey: 'demanda_id', otherKey: 'amparolegal_id' });
      Demanda.belongsToMany(models.Aluno, { through: 'DemandaAluno', foreignKey: 'demanda_id', otherKey: 'matricula' });
      Demanda.hasMany(models.Encaminhamento, { foreignKey: 'encaminhamento_id' });
      Demanda.hasMany(models.IntervencaoDemanda, { foreignKey: 'intervencaodemanda_id' });
    }
  }
  Demanda.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nivel: {
      type: DataTypes.ENUM,
      values: ['Privado', 'Público'],
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios', key: 'id'
      }
    }
  },
    {
      sequelize,
      modelName: 'Demanda',
    });
  return Demanda;
};