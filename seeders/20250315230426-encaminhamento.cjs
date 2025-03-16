'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date()
    const usuarios = await queryInterface.sequelize.query(
      `SELECT id FROM usuarios;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const demandas = await queryInterface.sequelize.query(
      `SELECT id FROM Demandas;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (usuarios.length === 0) {
      throw new Error("Nenhum usuário encontrado!");
    }

    if (demandas.length === 0) {
      throw new Error("Nenhuma demanda encontrada!");
    }

    return queryInterface.bulkInsert('encaminhamentos', [
      {
        usuario_id: usuarios[0].id,
        demanda_id: demandas[0].id,
        destinatario_id: usuarios[1].id,
        descricao: 'Encaminhamento para o profissional responsável', 
        data: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        usuario_id: usuarios[2].id,
        demanda_id: demandas[1].id,
        destinatario_id: usuarios[0].id,
        descricao: 'Encaminhamento para o profissional responsável', 
        data: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        usuario_id: usuarios[3].id,
        demanda_id: demandas[2].id,
        destinatario_id: usuarios[2].id,
        descricao: 'Encaminhamento para o profissional responsável', 
        data: now,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('encaminhamentos', null, {});
  }
};
