'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Demanda extends Model {
    static associate(models) {
      Demanda.hasOne(models.Usuario, { foreignKey: 'usuario_id'});
      Demanda.belongsToMany(models.AmparoLegal, {through: 'AmparoDemanda', foreignKey: 'demanda_id', otherKey: 'amparolegal_id'});
      Demanda.belongsToMany(models.Usuario, {through: 'Encaminhamento', foreignKey: 'demanda_id', otherKey: 'usuario_id'});
      Demanda.belongsToMany(models.Aluno, {through: 'DemandaAluno', foreignKey: 'demanda_id', otherKey: 'matricula'});
      Demanda.belongsToMany(models.Intervencao, {through: 'IntervencaoDemanda', foreignKey: 'demanda_id', otherKey: 'intervencao_id'})
    }
  }
  Demanda.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao:{
      type: DataTypes.STRING,
      allowNull: false
    },
    status:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nivel:{
      type: DataTypes.ENUM,
      values: ['Privado','Público'],
      allowNull: false
    },
    usuario_id: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario', key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Demanda',
  });
  return Demanda;
};