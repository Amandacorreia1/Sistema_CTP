'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cargo extends Model {
    static associate(models) {
      Cargo.hasMany(models.Usuario, {foreignKey: 'cargo_id'});
    }
  }
  Cargo.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.ENUM,
      values: ['Diretor Geral', 'Coodernador', 'CTP',"Diretor Ensino","Professor","Aluno"],
      allowNull: false
    },
    updatedAt:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Cargo',
  });
  return Cargo;
};