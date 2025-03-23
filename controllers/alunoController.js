import db from '../models/index.js';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';

dotenv.config();

export const cadastrarAluno = async (req, res) => {
  const { matricula, nome, email, curso } = req.body;

  try {
    if (!matricula || !nome || !email || !curso) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (alunoExistente) {
      return res.status(409).json({ mensagem: 'Já existe um aluno cadastrado com essa matrícula' });
    }

    const novoAluno = await db.Aluno.create({
      matricula,
      nome,
      email,
      curso
    });

    res.status(201).json(novoAluno);
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', {
      message: erro.message,
      stack: erro.stack
    });
    res.status(500).json({ mensagem: 'Erro ao cadastrar aluno', erro: erro.message });
  }
};

export const buscarAluno = async (req, res) => {
  let { matricula } = req.params;

  try {
    let aluno = await db.Aluno.findOne({ 
      attributes: ['matricula', 'nome', 'email', 'curso'],
      where: { matricula } 
    });
    console.log('Aluno no banco local:', aluno ? aluno.dataValues : 'Não encontrado');

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

      console.log('Parâmetros enviados:', config.params);

      const response = await axios.get(url, config);
      const alunoRu = response.data;
      console.log('Resposta completa da API externa:', JSON.stringify(alunoRu, null, 2));

      if (!alunoRu || !alunoRu.mat) {
        console.log('API externa retornou vazio ou inválido');
        return res.status(404).json({ mensagem: 'Aluno não encontrado na API externa' });
      }

      const alunoData = {
        matricula: alunoRu.mat || matricula,
        nome: alunoRu.name || '',
        email: alunoRu.user && alunoRu.user[0] ? alunoRu.user[0].email || '' : `${matricula}@example.com`,
        curso: alunoRu.course ? alunoRu.course.description || '' : ''
      };
      console.log('Dados mapeados antes de criar:', alunoData);

      aluno = await db.Aluno.create(alunoData);
      console.log('Aluno criado:', aluno.dataValues);
    }

    res.status(200).json(aluno);
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
      attributes: ['matricula', 'nome', 'email', 'curso'],
      where: {
        nome: { [db.Sequelize.Op.ne]: '' }, 
        email: { [db.Sequelize.Op.ne]: '' }, 
        curso: { [db.Sequelize.Op.ne]: '' }  
      }
    });

    res.status(200).json(alunos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar alunos' });
  }
};