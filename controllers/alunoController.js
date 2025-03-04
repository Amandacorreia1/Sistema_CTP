/*import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const buscarAlunoRu = async (matricula) => {
    return {
        matricula,
        nome: '',
        email: '',
        curso: '',
    };
};

export const buscarAluno = async (req, res) => {
    const { matricula } = req.params;

    try {
        // Verifica se o aluno já está no banco da ctp
        let aluno = await db.Aluno.findOne({ 
            attributes: ['matricula', 'nome', 'email', 'curso'],
            where: { matricula } 
        });

        // Se o aluno não existir, busca no ru
        if (!aluno) {
            const alunoRu = await buscarAlunoRu(matricula);
            if (!alunoRu) {
                return res.status(404).json({ mensagem: 'Aluno não encontrado' });
            }

            // Salva o aluno no banco da ctp.
            aluno = await db.Aluno.create(alunoRu);
        }

        res.status(200).json(aluno);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao obter aluno' });
    }
};

export const listarAlunos = async (req, res) => {
    try {
        const alunos = await db.Aluno.findAll({ attributes: ['matricula', 'nome', 'email', 'curso'] });
        res.status(200).json(alunos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ mensagem: 'Erro ao buscar alunos' });
    }
};

*/