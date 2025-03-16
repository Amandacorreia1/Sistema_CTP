'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date()
    await queryInterface.bulkInsert('intervencoes', [
      {descricao: 'Aulas complementares para o aluno',createdAt: now, updatedAt: now},
      {descricao: 'Conversa com o pais do aluno',createdAt: now, updatedAt: now},
      {descricao: 'Suspensão temporária',createdAt: now, updatedAt: now}
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('intervencoes', null, {});
  }
};

