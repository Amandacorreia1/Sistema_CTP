import { Sequelize } from 'sequelize';

export default {
  async up(queryInterface) {
    await queryInterface.createTable('AmparoDemandas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
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
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AmparoDemandas');
  }
};