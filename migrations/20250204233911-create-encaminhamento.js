'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Encaminhamentos', {
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      demanda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Demandas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      destinatarios: {
        type: Sequelize.INTEGER
      },
      descricao: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.DATE
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

    await queryInterface.addConstraint('Encaminhamentos', {
      type: 'primary key',
      fields: ['usuario_id', 'demanda_id', ]
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Encaminhamentos');
  }
};