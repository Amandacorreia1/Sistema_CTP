import db from '../../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const listarCursos = async (req, res) => {
  try {
    const cursos = await db.Curso.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']],
    });
    res.status(200).json(cursos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao listar os cursos');
  }
};

export const listarCursoPorId = async (req, res) => {
  try {
    const curso = await db.Curso.findByPk(req.params.id, {
      attributes: ['id', 'nome'],
    });
    if (!curso) {
      return res.status(404).send('Curso não encontrado');
    }
    res.status(200).json(curso);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao listar o curso');
  }
};