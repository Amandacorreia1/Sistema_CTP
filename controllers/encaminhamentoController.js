import db from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

export const criarEncaminhamento = async (req, res) => {
    const { usuario_id } = req.body;
    const { destinatario } = req.body;
    const { demanda_id } = req.body;
    const { descricao } = req.body;
    const { data } = req.body;
    try {
        const usuario_res = await db.Usuario.findByPk(usuario_id);
        if (!usuario_res) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const destinatario_res = await db.Usuario.findByPk(destinatario);
        if (!destinatario_res) {
            return res.status(404).json({ error: 'Destinatário não encontrado' });
        }
        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrada' });
        }
        if (descricao == '' || descricao == null) {
            return res.status(400).json({ error: 'Informe uma descrição!' });
        }
        if (data == null) {
            return res.status(400).json({ error: 'Informe uma data válida!' });
        }
        try {
            const novoEncaminhamento = await db.Encaminhamento.create({ usuario_id, demanda_id, destinatario, descricao, data });
            return res.status(201).json({ encaminhamento: novoEncaminhamento, mensagem: "Encaminhamento realizado com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao realizar o encaminhamento da demanda.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

export const listarEncaminhamentosPorUsuario = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const usuario_res = await db.Usuario.findByPk(usuario_id);
        if (!usuario_res) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        try {
            const encaminhamentos = await db.Encaminhamento.findAll({
                where: { usuario_id },
                include: [{ model: db.Usuario, as: 'Remetente' },
                { model: db.Demanda, as: 'Demanda' },
                { model: db.Usuario, as: 'Destinatario' },
                ]
            });
            return res.status(200).json({ encaminhamentos,mensagem:"Encaminhamentos do usuário carregados com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar os encaminhamentos do usuário.' });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

export const listarEncaminhamentosPorDemanda = async (req, res) => {
    const { demanda_id } = req.params;
    try {
        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrado' });
        }
        try {
            const encaminhamentos = await db.Encaminhamento.findAll({
                where: { demanda_id },
                include: [{ model: db.Usuario, as: 'Remetente' },
                { model: db.Demanda, as: 'Demanda' },
                { model: db.Usuario, as: 'Destinatario' },
                ]
            });
            return res.status(200).json({ encaminhamentos,mensagem:"Encaminhamentos da demanda carregados com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar os encaminhamentos da demanda.' });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

export const listarEncaminhamentos = async (req, res) => {
    try {
        const encaminhamentos = await db.Encaminhamento.findAll({
            include: [{ model: db.Usuario, as: 'Remetente' },
            { model: db.Demanda, as: 'Demanda' },
            { model: db.Usuario, as: 'Destinatario' },
            ]
        });
        return res.status(200).json({ encaminhamentos,mensagem:"Encaminhamentos carregados com sucesso" });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

export const editarEncaminhamento = async (req, res) => {
    const { encaminhamento_id } = req.params;
    const { usuario_id, destinatario, demanda_id, descricao, data } = req.body;

    try {
        const encaminhamento = await db.Encaminhamento.findByPk(encaminhamento_id);
        if (!encaminhamento) {
            return res.status(404).json({ error: "Encaminhamento não encontrado" });
        }

        if (usuario_id) {
            const usuario_res = await db.Usuario.findByPk(usuario_id);
            if (!usuario_res) {
                return res.status(404).json({ error: "Usuário remetente não encontrado" });
            }
        }

        if (destinatario) {
            const destinatario_res = await db.Usuario.findByPk(destinatario);
            if (!destinatario_res) {
                return res.status(404).json({ error: "Destinatário não encontrado" });
            }
        }

        if (demanda_id) {
            const demanda_res = await db.Demanda.findByPk(demanda_id);
            if (!demanda_res) {
                return res.status(404).json({ error: "Demanda não encontrada" });
            }
        }

        await encaminhamento.update({
            usuario_id: usuario_id || encaminhamento.usuario_id,
            destinatario: destinatario || encaminhamento.destinatario,
            demanda_id: demanda_id || encaminhamento.demanda_id,
            descricao: descricao !== undefined ? descricao : encaminhamento.descricao,
            data: data || encaminhamento.data
        });

        return res.status(200).json({
            message: "Encaminhamento atualizado com sucesso!",
            encaminhamento
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao editar o encaminhamento." });
    }
};

export const excluirEncaminhamento = async(req,res) => {
    const { encaminhamento_id } = req.params;
    try {
        const encaminhamento_res = await db.Encaminhamento.findByPk(encaminhamento_id);
        if (!encaminhamento_res) {
            return res.status(404).json({ error: 'Encaminhamento não encontrado' });
        }
        await encaminhamento_res.destroy();
        return res.status(204);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};