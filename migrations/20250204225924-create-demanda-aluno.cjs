module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DemandaAlunos', {
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
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      aluno_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Alunos',
          key: 'matricula',
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
    await queryInterface.dropTable('DemandaAlunos');
  }
};