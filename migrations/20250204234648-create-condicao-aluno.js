'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CondicaoAlunos', {
      condicao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Condicao', 
          key: 'id' 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      matricula: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Aluno', 
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
    await queryInterface.addConstraint('CondicaoAluno', {
      type: 'primary key',
      fields: ['condicao_id', 'matricula']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CondicaoAlunos');
  }
};