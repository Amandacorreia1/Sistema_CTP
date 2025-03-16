import db from '../models/index.js';

export const criarEncaminhamento = async (req, res) => {
    const { usuario_id } = req.body;
    const { destinatario_id } = req.body;
    const { demanda_id } = req.body;
    const { descricao } = req.body;
    const { data } = req.body;
    try {
        const usuario_res = await db.Usuario.findByPk(usuario_id);
        if (!usuario_res) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const destinatario_res = await db.Usuario.findByPk(destinatario_id);
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
            const novoEncaminhamento = await db.Encaminhamentos.create({ usuario_id, demanda_id, destinatario_id, descricao, data });
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
    const { id } = req.params;
    try {
        const usuario_res = await db.Usuario.findByPk(id);
        if (!usuario_res) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        try {
            const encaminhamentos = await db.Encaminhamentos.findAll({
                where: { usuario_id:id },
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
    const { id } = req.params;
    try {
        const demanda_res = await db.Demanda.findByPk(id);
        if (!demanda_res) {
            return res.status(404).json({ error: 'Demanda não encontrada.' });
        }
        try {
            const encaminhamentos = await db.Encaminhamentos.findAll({
                where: { demanda_id:id },
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
        const encaminhamentos = await db.Encaminhamentos.findAll({
            include: [{ model: db.Usuario, as: 'Remetente' },
                { model: db.Demanda, as: 'Demanda' },
                { model: db.Usuario, as: 'Destinatario' },],
        });
        return res.status(200).json({ encaminhamentos,mensagem:"Encaminhamentos carregados com sucesso" });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
