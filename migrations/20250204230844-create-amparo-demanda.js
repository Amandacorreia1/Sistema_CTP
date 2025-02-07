'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AmparoDemandas', {
      demanda_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Demandas', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      amparoLegal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AmparoLegals', 
          key: 'id' 
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
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

    await queryInterface.addConstraint('AmparoDemandas', {
      fields: ['demanda_id', 'amparoLegal_id'],
      type: 'unique', 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AmparoDemandas');
  }
};