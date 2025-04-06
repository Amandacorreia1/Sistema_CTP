'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Alunos', [
      { matricula: 20221035000028, nome: 'AMANDA DO NASCIMENTO CORREIA', email: 'amandanascimentocorreia18@gmail.com', curso_id: 6, createdAt: now, updatedAt: now },
      { matricula: 20221035000281, nome: 'MARIA DANIELLY BENICIO DE ARAUJO', email: 'daniellybenicio@outlook.com', curso_id: 6, createdAt: now, updatedAt: now },
      { matricula: 20221035000052, nome: 'DANIEL TEIXEIRA DA SILVA', email: 'daniel.teixeira08@aluno.ifce.edu.br', curso_id: 3, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alunos', null, {});
  }
};
