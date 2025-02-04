'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IntervencaoDemanda', {
      intervencao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Intervencao', key: 'id' },
        onDelete: 'CASCADE'
      },
      demanda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Demanda', key: 'id' },
        onDelete: 'CASCADE'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuario', key: 'id' },
        onDelete: 'CASCADE'
      },
      data: {
        type: Sequelize.DATE
      },
      descricao: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('IntervencaoDemanda');
  }
};