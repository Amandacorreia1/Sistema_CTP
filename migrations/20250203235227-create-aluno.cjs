module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('Alunos', {
      matricula: {
        type: Sequelize.STRING(14),
        allowNull: false,
        primaryKey: true,
        validate: {
          isNumeric: true 
        }
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      curso: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Alunos');
  }
};