'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AmparoLegal extends Model {
    static associate(models) {
      AmparoLegal.belongsToMany(models.Demanda, { through: 'AmparoDemanda', foreignKey: 'amparolegal_id', otherKey: 'demanda_id' });
    }
  }
  AmparoLegal.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.ENUM, 
      values: [
        'Receber educação de qualidade, que promova o seu desenvolvimento profissional e humano.',
        'Solicitar à coordenadoria de seu curso orientação para solução de eventuais dificuldades na vida acadêmica.',
        'Denunciar, tendo assegurado o anonimato, o mau uso do patrimônio público, depredações e atos de vandalismo, condutas ilícitas, por parte dos pares e servidores.',
        'Outros'
      ],

      allowNull: false
    },    
  }, {
    sequelize,
    modelName: 'AmparoLegal',
  });
  return AmparoLegal;
};