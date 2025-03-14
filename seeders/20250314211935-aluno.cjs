'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Alunos', [
      { matricula: 123456, nome: 'Amanda Correia', email: 'amanda.c@email.com', curso: 'Engenharia Mecânica', createdAt: now, updatedAt: now },
      { matricula: 123457, nome: 'André Casimiro', email: 'andrec@email.com', curso: 'Engenharia Elétrica', createdAt: now, updatedAt: now },
      { matricula: 123458, nome: 'Daniel Teixeira', email: 'daniel34@email.com', curso: 'Mecatrônica Industrial', createdAt: now, updatedAt: now },
      { matricula: 123459, nome: 'Danielly Benicio', email: 'daniellybenicio@email.com', curso: 'Sistemas de Informação', createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alunos', null, {});
  }
};
