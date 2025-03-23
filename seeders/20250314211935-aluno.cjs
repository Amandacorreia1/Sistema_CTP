'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Alunos', [
      { matricula: 123456, nome: 'Amanda Correia', email: 'amanda.c@email.com', curso_id: 1, createdAt: now, updatedAt: now },
      { matricula: 123457, nome: 'André Casimiro', email: 'andrec@email.com', curso_id: 2, createdAt: now, updatedAt: now },
      { matricula: 123458, nome: 'Daniel Teixeira', email: 'daniel34@email.com', curso_id: 3, createdAt: now, updatedAt: now },
      { matricula: 123459, nome: 'Danielly Benicio', email: 'daniellybenicio@email.com', curso_id: 4, createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alunos', null, {});
  }
};
