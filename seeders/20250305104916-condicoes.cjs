"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("Condicoes", [
      { nome: "Deficiência Auditiva", createdAt: now, updatedAt: now },
      { nome: "Deficiência Intelectual", createdAt: now, updatedAt: now },
      { nome: "Deficiência Múltipla", createdAt: now, updatedAt: now },
      { nome: "Deficiência Motora/Física", createdAt: now, updatedAt: now },
      {
        nome: "Deficiência Visual (cegueira ou baixa visão)",
        createdAt: now,
        updatedAt: now,
      },
      { nome: "Portador de Altas Habilidades", createdAt: now, updatedAt: now },
      {
        nome: "TDAH (Transtorno do Déficit de Atenção com Hiperatividade)",
        createdAt: now,
        updatedAt: now,
      },
      {
        nome: "Transtorno do Espectro Autista",
        createdAt: now,
        updatedAt: now,
      },
      {
        nome: "Transtornos do Desenvolvimento Global",
        createdAt: now,
        updatedAt: now,
      },
      { nome: "Outra", createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Condicoes", null, {});
  },
};
