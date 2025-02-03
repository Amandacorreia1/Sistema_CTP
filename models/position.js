'use strict';
const { Model, INTEGER } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Position.init({
    id: {
      type: INTEGER,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.ENUM('Coordenador', 'Diretor de Ensino', 'Diretor Geral', 'Funcionário da CTP', 'Professor'),
      allowNull: false
    }
  }, 
  {
    sequelize,
    modelName: 'Position'
  });

  return Position;
};