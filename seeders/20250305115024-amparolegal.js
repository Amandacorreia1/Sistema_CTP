'use strict';

import { QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Seeder} */
export default {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('AmparoLegals', [
      { nome: 'Solicitar à coordenadoria de seu curso orientação para solução de eventuais dificuldades na vida acadêmica', createdAt: now, updatedAt: now },
      { nome: 'Receber educação de qualidade, que promova o seu desenvolvimento profissional e humano', createdAt: now, updatedAt: now },
      { nome: 'Requerer providências aos órgãos que integram a estrutura básica regimental do IFCE, quando se considerar lesado em seus legítimos interesses', createdAt: now, updatedAt: now },
      { nome: 'Outra', createdAt: now, updatedAt: now }, 
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('AmparoLegals', null, {});
  }
};
