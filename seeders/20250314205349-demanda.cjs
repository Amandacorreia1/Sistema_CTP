'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    await queryInterface.bulkInsert('Demandas', [
      {descricao: 'Adaptação curricular para aluno com deficiência visual.', status: true, usuario_id: 1, createdAt: now, updatedAt: now},
      {descricao: 'Pedido de atendimento especializado para aluno com TDAH.', status: true, disciplina: "Estrutura de Dados", usuario_id: 2, createdAt: now, updatedAt: now},
      {descricao: 'Aluno brigou em sala de aula', status: false, usuario_id: 3, createdAt: now, updatedAt: now}
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Demandas', null, {});
  }
};