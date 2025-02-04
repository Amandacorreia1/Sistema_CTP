'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AmparoLegal', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.ENUM('Receber educação de qualidade, que promova o seu desenvolvimento profissional e humano.',
        'Solicitar à coordenadoria de seu curso orientação para solução de eventuais dificuldades na vida acadêmica.',
        'Denunciar, tendo assegurado o anonimato, o mau uso do patrimônio público, depredações e atos de vandalismo, condutas ilícitas, por parte dos pares e servidores.',
        'Outros'
      )},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AmparoLegal');
  }
};