'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DemandaAluno extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DemandaAluno.init({
    disciplina: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DemandaAluno',
  });
  return DemandaAluno;
};