'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Cargos', [
      { nome: 'Aluno', createdAt: now, updatedAt: now },
      { nome: 'Coordenador', createdAt: now, updatedAt: now },
      { nome: 'Diretor Ensino', createdAt: now, updatedAt: now },
      { nome: 'Diretor Geral', createdAt: now, updatedAt: now },
      { nome: 'Funcionario CTP', createdAt: now, updatedAt: now },
      { nome: 'Professor', createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cargos', null, {});
  }
};

