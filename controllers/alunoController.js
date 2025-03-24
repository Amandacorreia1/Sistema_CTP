import db from '../models/index.js';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';

dotenv.config();

export const adicionarCondicao = async (req, res) => {
  try {
    const { id_condicao } = req.body; 
    const { id } = req.params; 

    const aluno = await db.Aluno.findOne({ where: { matricula: id } });
    if (!aluno) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado' });
    }

    const condicoes = Array.isArray(id_condicao) ? id_condicao : [id_condicao];

    const condicoesNaoExistem = [];

    for (let condicaoId of condicoes) {
      const condicaoExistente = await db.Condicao.findOne({ where: { id: condicaoId } });

      if (condicaoExistente) {
        const dataAtual = new Date();

        await db.sequelize.query(
          'INSERT INTO condicaoalunos (aluno_id, condicao_id, createdAt, updatedAt) VALUES (:aluno_id, :condicao_id, :createdAt, :updatedAt)',
          {
            replacements: {
              aluno_id: aluno.matricula,
              condicao_id: condicaoId,
              createdAt: dataAtual,
              updatedAt: dataAtual,
            },
            type: db.Sequelize.QueryTypes.INSERT,
          }
        );
      } else {
        condicoesNaoExistem.push(condicaoId);
      }
    }

    if (condicoesNaoExistem.length === 0) {
      return res.status(201).json({ mensagem: 'Condição(s) associada(s) ao aluno com sucesso' });
    } else {
      return res.status(404).json({
        mensagem: 'Condição(ões) não encontrada(s): ' + condicoesNaoExistem.join(', '),
      });
    }

  } catch (erro) {
    console.error('Erro ao adicionar condição ao aluno:', {
      message: erro.message,
      stack: erro.stack,
    });
    res.status(500).json({ mensagem: 'Erro ao adicionar a condição ao aluno', erro: erro.message });
  }
};

export const cadastrarAluno = async (req, res) => {
  const { matricula, nome, email, curso_id } = req.body;

  try {
    if (!matricula || !nome || !email || !curso_id) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (alunoExistente) {
      return res.status(409).json({ mensagem: 'Já existe um aluno cadastrado com essa matrícula' });
    }

    const cursoExistente = await db.Curso.findByPk(curso_id);
    if (!cursoExistente) {
      return res.status(400).json({ mensagem: 'Curso inválido' });
    }

    const novoAluno = await db.Aluno.create({
      matricula,
      nome,
      email,
      curso_id
    });

    res.status(201).json({
      matricula: novoAluno.matricula,
      nome: novoAluno.nome,
      email: novoAluno.email,
      curso_id: novoAluno.curso_id
    });
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', {
      message: erro.message,
      stack: erro.stack
    });
    res.status(500).json({ mensagem: 'Erro ao cadastrar aluno', erro: erro.message });
  }
};

export const buscarAluno = async (req, res) => {
  const { matricula } = req.params;

  try {
    let aluno = await db.Aluno.findOne({
      attributes: ['matricula', 'nome', 'email', 'curso_id'],
      include: [{ model: db.Curso, as:'Cursos' }],
      include: [{model:db.Condicao, attributes: ['id', 'nome']}],
      where: { matricula }
    });

    const curso = await db.Curso.findByPk(aluno.curso_id);

    if (!aluno) {
      const url = 'https://ruapi.cedro.ifce.edu.br/api/student-by-enrollment';
      const config = {
        params: {
          enrollment: matricula,
          token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      };

      const response = await axios.get(url, config);
      const alunoRu = response.data;

      if (!alunoRu || !alunoRu.mat) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado na API externa' });
      }

      const nomeCurso = alunoRu.course ? alunoRu.course.description || '' : '';
      let curso = await db.Curso.findOne({ where: { nome: nomeCurso } });

      if (!curso && nomeCurso) {
        curso = await db.Curso.create({ nome: nomeCurso });
      }
      
      const alunoData = {
        matricula: alunoRu.mat || matricula,
        nome: alunoRu.name || '',
        email: alunoRu.user && alunoRu.user[0] ? alunoRu.user[0].email || '' : `${matricula}@example.com`,
        curso_id: curso ? curso.id : null,       
      };

      if (!alunoData.curso_id) {
        return res.status(400).json({ mensagem: 'Curso não pode ser nulo' });
      }

      aluno = await db.Aluno.create(alunoData);
    }

    res.status(200).json({
      matricula: aluno.matricula,
      nome: aluno.nome,
      email: aluno.email,
      curso_id: aluno.curso_id,
      curso: curso,
      condicoes:aluno.Condicaos
    });
  } catch (erro) {
    console.error('Erro ao buscar aluno:', {
      message: erro.message,
      stack: erro.stack,
      response: erro.response ? erro.response.data : null
    });
    res.status(500).json({ mensagem: 'Erro ao obter aluno', erro: erro.message });
  }
};

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await db.Aluno.findAll({
      attributes: ['matricula', 'nome', 'email', 'curso_id'],
      include: [
        { model: db.Curso, as: 'Curso' }, 
        { model: db.Condicao, through: 'condicaoalunos' } 
      ],
      where: {
        nome: { [db.Sequelize.Op.ne]: '' },
        email: { [db.Sequelize.Op.ne]: '' }
      }
    });
  

    const alunosFormatados = alunos.map(aluno => ({
      matricula: aluno.matricula,
      nome: aluno.nome,
      email: aluno.email,
      curso_id: aluno.curso_id,
      curso: aluno.Curso ? aluno.Curso.nome : null,
      condicoes: aluno.Condicaos ?  aluno.Condicaos.map(condicao => ([condicao.nome]
      )): []
    }));

    res.status(200).json(alunosFormatados);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar alunos' });
  }
};