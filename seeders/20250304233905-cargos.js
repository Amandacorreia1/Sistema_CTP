'use strict';

import { QueryInterface } from 'sequelize';  

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface) {
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

  async down(queryInterface) {
    await queryInterface.bulkDelete('Cargos', null, {});
  }
};
