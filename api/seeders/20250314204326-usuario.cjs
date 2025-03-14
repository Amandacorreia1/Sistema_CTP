'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const saltRounds = 10;

    const hashedPasswords = await Promise.all([
      bcrypt.hash('senha123', saltRounds),
      bcrypt.hash('senha123', saltRounds),
      bcrypt.hash('senha123', saltRounds),
      bcrypt.hash('senha123', saltRounds),
      bcrypt.hash('senha123', saltRounds),
      bcrypt.hash('senha123', saltRounds)
    ]);

    await queryInterface.bulkInsert('Usuarios', [
      {matricula: 1001258965, nome: 'João Silva', senha: hashedPasswords[0], email: 'joao.silva@example.com', cargo_id: 1, createdAt: now, updatedAt: now},
      {matricula: 1002125478, nome: 'Maria Souza', senha: hashedPasswords[1], email: 'maria.souza@example.com', cargo_id: 2, createdAt: now, updatedAt: now},
      {matricula: 1003456982, nome: 'Carlos Oliveira', senha: hashedPasswords[2], email: 'carlos.oliveira@example.com', cargo_id: 3, createdAt: now, updatedAt: now},
      {matricula: 1004584695, nome: 'Ana Lima', senha: hashedPasswords[3], email: 'ana.lima@example.com', cargo_id: 4, createdAt: now, updatedAt: now},
      {matricula: 1005125478, nome: 'Roberto Mendes', senha: hashedPasswords[4], email: 'roberto.mendes@example.com', cargo_id: 5, createdAt: now, updatedAt: now},
      {matricula: 1006123657, nome: 'Fernanda Costa', senha: hashedPasswords[5], email: 'fernanda.costa@example.com', cargo_id: 6, createdAt: now, updatedAt: now}
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
