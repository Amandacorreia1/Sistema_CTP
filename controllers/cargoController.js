import db from '../models/index.js';

export const listarCargos = async (req, res) => {
    try {
        const cargos = await db.Cargo.findAll();
        res.status(200).json(cargos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar os cargos');
    }
}

export const listarCargoPorId = async (req, res) => {
    try {
        const cargo = await db.Cargo.findByPk(req.params.id);
        if (!cargo) {
            return res.status(404).send('Cargo não encontrado');
        }
        res.status(200).json(cargo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar o cargo');

    }
}

export const cadastrarCargo = async (req, res) => {
    const { nome } = req.body;
    try {
        const novoCargo = await db.Cargo.create({
            nome
        });
        res.status(201).json(novoCargo);
    } catch (error) {
        console.error(error);
        res.status(400).send('Erro ao cadastrar o cargo');
    }
}
