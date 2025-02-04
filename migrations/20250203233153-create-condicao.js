'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Condicoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.ENUM('Transtorno do Espectro Autista', 'TDAH(Transtorno do Déficit de Atenção com Hiperatividade)',
        'Deficiência Auditiva', 'Deficiência Motora/Física', 'Deficiência Visual(cegueira ou baixa visão)',
        'Transtornos do Desenvolvimento Global',
        'Deficiência Intelectual', 'Deficiência Múltipla', 'Portador de Altas Habilidades', 'Outra')
      },
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
    await queryInterface.dropTable('Condicoes');
  }
};