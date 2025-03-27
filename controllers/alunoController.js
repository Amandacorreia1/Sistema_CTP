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
  const { matricula, nome, email, curso, condicoes } = req.body;

  try {
    if (!matricula || !nome || !email || !curso || !condicoes || !Array.isArray(condicoes) || condicoes.length === 0) {
      return res.status(400).json({ mensagem: 'Matrícula, nome, email, curso e pelo menos uma condição são obrigatórios' });
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (alunoExistente) {
      return res.status(409).json({ mensagem: 'Já existe um aluno cadastrado com essa matrícula' });
    }

    let cursoExistente = await db.Curso.findOne({ where: { nome: curso } });
    if (!cursoExistente) {
      cursoExistente = await db.Curso.create({ nome: curso });
    }

    const novoAluno = await db.Aluno.create({
      matricula,
      nome,
      email,
      curso_id: cursoExistente.id,
    });

    const condicaoIds = [];
    for (const condicao of condicoes) {
      let condicaoRecord;
      if (typeof condicao === 'object' && condicao.id && condicao.nome) {
        condicaoRecord = await db.Condicao.findOne({ where: { id: condicao.id } });
        if (!condicaoRecord) {
          condicaoRecord = await db.Condicao.create({ nome: condicao.nome });
        }
      } else if (typeof condicao === 'string') {
        condicaoRecord = await db.Condicao.findOne({ where: { nome: condicao } });
        if (!condicaoRecord) {
          condicaoRecord = await db.Condicao.create({ nome: condicao });
        }
      } else if (typeof condicao === 'number') {
        condicaoRecord = await db.Condicao.findOne({ where: { id: condicao } });
        if (!condicaoRecord) {
          return res.status(400).json({ mensagem: `Condição com ID ${condicao} não encontrada` });
        }
      } else {
        return res.status(400).json({ mensagem: 'Formato de condição inválido' });
      }
      condicaoIds.push(condicaoRecord.id);
    }

    await novoAluno.addCondicaos(condicaoIds);

    const condicaoRecords = await db.Condicao.findAll({
      where: { id: condicaoIds },
      attributes: ['id', 'nome'],
    });

    res.status(201).json({
      matricula: novoAluno.matricula,
      nome: novoAluno.nome,
      email: novoAluno.email,
      curso: cursoExistente.nome,
      condicoes: condicaoRecords.map((c) => ({ id: c.id, nome: c.nome })),
    });
  } catch (erro) {
    console.error('Erro ao cadastrar aluno:', {
      message: erro.message,
      stack: erro.stack,
    });
    res.status(500).json({ mensagem: 'Erro ao cadastrar aluno', erro: erro.message });
  }
};

export const atualizarAluno = async (req, res) => {
  const matricula = req.params.matricula;
  const { nome, email, curso, condicoes } = req.body;

  try {
    if (!nome || !email || !curso || !condicoes || !Array.isArray(condicoes) || condicoes.length === 0) {
      return res.status(400).json({ mensagem: 'Nome, email, curso e pelo menos uma condição são obrigatórios' });
    }

    const alunoExistente = await db.Aluno.findOne({ where: { matricula } });
    if (!alunoExistente) {
      return res.status(404).json({ mensagem: 'Aluno não encontrado' });
    }

    let cursoExistente = await db.Curso.findOne({ where: { nome: curso } });
    if (!cursoExistente) {
      cursoExistente = await db.Curso.create({ nome: curso });
    }

    await alunoExistente.update({
      nome,
      email,
      curso_id: cursoExistente.id,
    });

    const condicaoIds = [];
    for (const condicao of condicoes) {
      let condicaoRecord;
      if (typeof condicao === 'object' && condicao.id && condicao.nome) {
        condicaoRecord = await db.Condicao.findOne({ where: { id: condicao.id } });
        if (!condicaoRecord) {
          condicaoRecord = await db.Condicao.create({ nome: condicao.nome });
        }
      } else if (typeof condicao === 'string') {
        condicaoRecord = await db.Condicao.findOne({ where: { nome: condicao } });
        if (!condicaoRecord) {
          condicaoRecord = await db.Condicao.create({ nome: condicao });
        }
      } else if (typeof condicao === 'number') {
        condicaoRecord = await db.Condicao.findOne({ where: { id: condicao } });
        if (!condicaoRecord) {
          return res.status(400).json({ mensagem: `Condição com ID ${condicao} não encontrada` });
        }
      } else {
        return res.status(400).json({ mensagem: 'Formato de condição inválido' });
      }
      condicaoIds.push(condicaoRecord.id);
    }

    await alunoExistente.setCondicaos(condicaoIds);

    const condicaoRecords = await db.Condicao.findAll({
      where: { id: condicaoIds },
      attributes: ['id', 'nome'],
    });

    res.status(200).json({
      matricula: alunoExistente.matricula,
      nome: alunoExistente.nome,
      email: alunoExistente.email,
      curso: cursoExistente.nome,
      condicoes: condicaoRecords.map((c) => ({ id: c.id, nome: c.nome })),
    });
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', {
      message: erro.message,
      stack: erro.stack,
    });
    res.status(500).json({ mensagem: 'Erro ao atualizar aluno', erro: erro.message });
  }
};

export const buscarAluno = async (req, res) => {
  const { matricula } = req.params;

  try {
    console.log(`Buscando aluno localmente: ${matricula}`);
    let aluno = await db.Aluno.findOne({
      attributes: ['matricula', 'nome', 'email', 'curso_id'],
      include: [
        { model: db.Curso, as: 'Cursos' },
        { model: db.Condicao, as: 'Condicaos', attributes: ['id', 'nome'] },
      ],
      where: { matricula },
    });

    if (!aluno) {
      console.log(`Aluno não encontrado localmente, consultando API externa: ${matricula}`);
      const url = 'https://ruapi.cedro.ifce.edu.br/api/student-by-enrollment';
      const config = {
        params: { enrollment: matricula, token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      };

      const response = await axios.get(url, config);
      const alunoRu = response.data;
      console.log('Resposta da API externa:', alunoRu);

      if (!alunoRu || !alunoRu.mat) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado na API externa' });
      }

      const nomeCurso = alunoRu.course?.description || 'Curso Desconhecido';
      let curso = await db.Curso.findOne({ where: { nome: nomeCurso } });
      if (!curso && nomeCurso) {
        console.log(`Criando curso: ${nomeCurso}`);
        curso = await db.Curso.create({ nome: nomeCurso });
      }

      const alunoData = {
        matricula: alunoRu.mat || matricula,
        nome: alunoRu.name || 'Nome Desconhecido',
        email: alunoRu.user?.[0]?.email || `${matricula}@example.com`,
        curso: curso?.nome || null,
        condicoes: [],
      };

      return res.status(200).json(alunoData);
    }

    const curso = await db.Curso.findByPk(aluno.curso_id);
    res.status(200).json({
      matricula: aluno.matricula,
      nome: aluno.nome,
      email: aluno.email,
      curso: curso?.nome || null,
      condicoes: aluno.Condicaos || [],
    });
  } catch (erro) {
    console.error('Erro ao buscar aluno:', {
      message: erro.message,
      stack: erro.stack,
      matricula,
    });
    res.status(500).json({ mensagem: 'Erro interno ao buscar aluno', erro: erro.message });
  }
};

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await db.Aluno.findAll({
      attributes: ['matricula', 'nome', 'email', 'curso_id'],
      include: [
        { model: db.Curso, as: 'Cursos' },
        { model: db.Condicao, as: 'Condicaos', through: { attributes: [] } }
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
      curso: aluno.Cursos ? aluno.Cursos.nome : null,
      condicoes: aluno.Condicaos ? aluno.Condicaos.map(condicao => condicao.nome) : []
    }));

    res.status(200).json(alunosFormatados);
  } catch (erro) {
    console.error('Erro ao listar alunos:', {
      message: erro.message,
      stack: erro.stack
    });
    res.status(500).json({ mensagem: 'Erro ao buscar alunos', erro: erro.message });
  }
};