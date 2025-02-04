'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Encaminhamento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Encaminhamento.init({
    usuario_id: DataTypes.INTEGER,
    demanda_id: DataTypes.INTEGER,
    destinatario: DataTypes.INTEGER,
    descricao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Encaminhamento',
  });
  return Encaminhamento;
};