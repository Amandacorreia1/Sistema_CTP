import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarDemanda = async (req, res) => {
    const {id, descricao, status, nivel, usuario_id, alunos} = req.body;

    try {
       
        // Verificar se o usuário existe
        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        if(!alunos){
            return res.status(404).json({ mensagem: 'Os alunos não foram informados.' });
        }

        // Validar o nível da demanda
        if (!['Privado', 'Público'].includes(nivel)) {
            return res.status(400).json({ mensagem: 'Nível inválido. Deve ser Privado ou Público.' });
        }

        // Criar a nova demanda
        const novaDemanda = await db.Demanda.create({
            usuario_id,
            descricao,
            status: true,  // Aqui estou assumindo que o status será sempre 'true' (ativo)
            nivel,
        });

        //Associar alunos a demanda
        if(alunos && alunos.length > 0){
            for(const aluno of alunos){
                const alunoExistente = await db.Aluno.findByPk(aluno.id);
                
                if(!alunoExistente){
                    return res.status(404).json({ mensagem: `Aluno com ID ${aluno.id} não encontrado.` });
                }

                await db.DemandaAluno.create({
                    demanda_id: novaDemanda.id,
                    aluno_id: aluno.id,
                });
            }
        }

        // Retornar a resposta de sucesso
        return res.status(201).json({
            mensagem: 'Demanda criada com sucesso',
            demanda: novaDemanda
        });

    } catch (erro) {
        console.error('Erro ao criar demanda:', erro);
        return res.status(500).json({ mensagem: 'Erro ao criar demanda' });
    }
};

export const listarDemandas = async (req, res) => {
    try {
        // Buscar todas as demandas, incluindo informações do usuário associado
        const demandas = await db.Demanda.findAll({
            include: [
                {
                    model: db.Usuario,
                    attributes: ['nome', 'email'], // Retornando o nome e email do usuário
                },
            ],
        });

        if (demandas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda encontrada' });
        }

        // Retornar as demandas encontradas
        res.status(200).json({ demandas });
    } catch (erro) {
        console.error('Erro ao listar demandas:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar demandas' });
    }
};

export const listarNiveis = async (req, res) => {
    try {
      console.log('Valores do ENUM:', db.Demanda.rawAttributes.nivel.type.values);
      const niveis = db.Demanda.rawAttributes.nivel.type.values.map((valor) => ({
        id: valor,
        nome: valor,
      }));
      return res.status(200).json(niveis);
    } catch (erro) {
      console.error('Erro ao listar níveis:', erro);
      return res.status(500).json({ mensagem: 'Erro ao listar níveis' });
    }
  };

  export const listarDemandasUsuario = async (req, res) => {
    try {
        // Obter o ID do usuário logado a partir do token
        const usuario_id = req.usuario.id; // req.usuario vem do autenticarToken
    
        if (!usuario_id) {
            return res.status(400).json({ mensagem: 'ID do usuário não encontrado no token' });
        }
    
        const usuario = await db.Usuario.findByPk(usuario_id, {
            attributes: ['id', 'nome', 'email', 'matricula', 'cargo_id'],
            include: [{ model: db.Cargo, as: 'Cargo' }], 
        });

        let demandas;

        // Buscar todas as demandas criadas pelo usuário logado
        if(usuario.cargo_id === 4 || usuario.cargo_id === 3 || usuario.cargo_id === 2){
            demandas = await db.Demanda.findAll({
                include: [
                    {
                        model: db.Usuario,
                        attributes: ['nome', 'email'], // Informações do usuário associado
                    },
                ],
            });

        } else {
            demandas = await db.Demanda.findAll({
                where: {
                    usuario_id: usuario_id, // Filtra pelo usuario_id
                },
                include: [
                    {
                        model: db.Usuario,
                        attributes: ['nome', 'email'], // Informações do usuário associado
                    },
                ],
            });

        }
        

        if (demandas.length === 0) {
            return res.status(404).json({ mensagem: 'Nenhuma demanda encontrada para este usuário' });
        }

        // Retornar as demandas encontradas
        return res.status(200).json({ demandas });
    } catch (erro) {
        console.error('Erro ao listar demandas do usuário:', erro);
        return res.status(500).json({ mensagem: 'Erro ao listar demandas do usuário' });
    }
};