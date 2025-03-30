'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const demandas = await queryInterface.sequelize.query(
      `SELECT id FROM Demandas;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const intervencoes = await queryInterface.sequelize.query(
      `SELECT id FROM Intervencoes;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const encaminhamentos = await queryInterface.sequelize.query(
      `SELECT id FROM Encaminhamentos;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Buscar usuários, excluindo o administrador (ID 7)
    const usuarios = await queryInterface.sequelize.query(
      `SELECT id FROM Usuarios WHERE id != 7;`, // Excluir o usuário com ID 7
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (intervencoes.length === 0) {
      throw new Error('Nenhuma intervenção encontrada!');
    }
    if (demandas.length === 0) {
      throw new Error('Nenhuma demanda encontrada!');
    }
    if (encaminhamentos.length === 0) {
      throw new Error('Nenhum encaminhamento encontrado!');
    }
    if (usuarios.length === 0) {
      throw new Error('Nenhum usuário encontrado (excluindo administrador)!');
    }

    return queryInterface.bulkInsert('IntervencaoDemanda', [
      {
        intervencao_id: intervencoes[0].id,
        demanda_id: demandas[0].id,
        encaminhamento_id: encaminhamentos[0].id,
        usuario_id: usuarios[0].id,
        data: now,
        created_at: now,
        updated_at: now,
      },
      {
        intervencao_id: intervencoes[1]?.id || intervencoes[0].id,
        demanda_id: demandas[1]?.id || demandas[0].id,
        encaminhamento_id: encaminhamentos[1]?.id || encaminhamentos[0].id,
        usuario_id: usuarios[1]?.id || usuarios[0].id,
        data: now,
        created_at: now,
        updated_at: now,
      },
      {
        intervencao_id: intervencoes[2]?.id || intervencoes[0].id,
        demanda_id: demandas[2]?.id || demandas[0].id,
        encaminhamento_id: encaminhamentos[2]?.id || encaminhamentos[0].id,
        usuario_id: usuarios[2]?.id || usuarios[0].id,
        data: now,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IntervencaoDemanda', null, {});
  },
};