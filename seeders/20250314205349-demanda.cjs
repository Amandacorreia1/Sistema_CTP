'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Demandas', [
      {descricao: 'Adaptação curricular para aluno com deficiência visual.', status: true, nivel: 'Público', usuario_id: 1, createdAt: now, updatedAt: now},
      {descricao: 'Pedido de atendimento especializado para aluno com TDAH.', status: true, nivel: 'Privado', usuario_id: 2, createdAt: now, updatedAt: now},
      {descricao: 'Aluno brigou em sala de aula', status: false, nivel: 'Público', usuario_id: 3, createdAt: now, updatedAt: now}
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Demandas', null, {});
  }
};
