'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Cursos', [
      // Cursos Técnicos Integrados (Nível Médio)
      { nome: 'Integrado em Eletrotécnica', createdAt: now, updatedAt: now },
      { nome: 'Integrado em Informática', createdAt: now, updatedAt: now },
      { nome: 'Integrado em Mecânica Industrial', createdAt: now, updatedAt: now },

      // Cursos Técnicos (Somente Técnicos)
      { nome: 'Técnico em Mecânica Industrial', createdAt: now, updatedAt: now },
      { nome: 'Técnico em Eletrotécnica', createdAt: now, updatedAt: now },

      // Cursos Superiores
      { nome: 'Bacharelado em Sistemas de Informação', createdAt: now, updatedAt: now },
      { nome: 'Bacharelado em Engenharia Elétrica', createdAt: now, updatedAt: now },
      { nome: 'Bacharelado em Engenharia Mecânica', createdAt: now, updatedAt: now },
      { nome: 'Licenciatura em Física', createdAt: now, updatedAt: now },
      { nome: 'Licenciatura em Matemática', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cursos', null, {});
  }
};