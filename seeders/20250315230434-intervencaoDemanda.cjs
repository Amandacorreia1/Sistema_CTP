'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date()
    const demandas = await queryInterface.sequelize.query(
      `SELECT id FROM Demandas;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const intervencoes = await queryInterface.sequelize.query(
      `SELECT id FROM intervencoes;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const encaminhamentos = await queryInterface.sequelize.query(
      `SELECT id FROM encaminhamentos;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (intervencoes.length === 0) {
      throw new Error("Nenhuma intervenção encontrada!");
    }

    if (demandas.length === 0) {
      throw new Error("Nenhuma demanda encontrada!");
    }

    if (encaminhamentos.length === 0) {
      throw new Error("Nenhum encaminhamento encontrado!");
    }

    return queryInterface.bulkInsert('intervencaodemanda', [
      {
        intervencao_id: intervencoes[0].id,
        demanda_id: demandas[0].id,
        encaminhamento_id: encaminhamentos[0].id,
        descricao: 'Encaminhamento para o profissional responsável, para resolução da causa', 
        data: now,
        created_at: now,
        updated_at: now,
      },
      {
        intervencao_id: intervencoes[1].id,
        demanda_id: demandas[1].id,
        encaminhamento_id: encaminhamentos[1].id,
        descricao: 'Encaminhamento para o profissional responsável, para resolução da causa', 
        data: now,
        created_at: now,
        updated_at: now,
      },
      {
        intervencao_id: intervencoes[2].id,
        demanda_id: demandas[2].id,
        encaminhamento_id: encaminhamentos[2].id,
        descricao: 'Encaminhamento para o profissional responsável, para resolução da causa', 
        data: now,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('intervencaodemanda', null, {});
  }
};
