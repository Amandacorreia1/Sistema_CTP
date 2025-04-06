'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Alunos', [
      { matricula: 20221035000001, nome: 'PEDRO ALVES DE LIMA', email: 'pedroalves@gmail.com', curso_id: 6, createdAt: now, updatedAt: now },
      { matricula: 20221035000002, nome: 'MARIA CLARA OLIVEIRA', email: 'mariaclara@outlook.com', curso_id: 8, createdAt: now, updatedAt: now },
      { matricula: 20221035000003, nome: 'JOÃO COSTA DA SILVA', email: 'joaocosta@gmail.com', curso_id: 7, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alunos', null, {});
  }
};
