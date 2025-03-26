import db from '../models/index.js';

export const criarEncaminhamento = async (req, res) => {
    const { destinatario_id, demanda_id, descricao } = req.body;
    const usuario_id = req.usuario.id;

    try {
        if (!usuario_id) {
            return res.status(400).json({ error: "ID do usuário remetente não foi encontrado no token" });
        }
        if (!destinatario_id || (Array.isArray(destinatario_id) && destinatario_id.length === 0)) {
            return res.status(400).json({ error: "Informe pelo menos um destinatário" });
        }
        if (!demanda_id) {
            return res.status(400).json({ error: "ID da demanda é obrigatório" });
        }
        if (!descricao || descricao.trim() === "") {
            return res.status(400).json({ error: "Informe uma descrição válida" });
        }

        const demanda_res = await db.Demanda.findByPk(demanda_id);
        if (!demanda_res) {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }

        const dataAtual = new Date();

        const destinatarios = Array.isArray(destinatario_id) ? destinatario_id : [destinatario_id];
        const encaminhamentos = [];

        for (const destId of destinatarios) {
            try {
                const novoEncaminhamento = await db.Encaminhamentos.create({
                    usuario_id,
                    demanda_id,
                    destinatario_id: destId,
                    descricao,
                    data: dataAtual,
                });
                encaminhamentos.push(novoEncaminhamento);
            } catch (error) {
                console.error(`Erro ao criar encaminhamento para destinatário ${destId}:`, error);
                return res.status(500).json({ error: `Erro ao encaminhar para o destinatário ID ${destId}` });
            }
        }

        return res.status(201).json({
            encaminhamentos,
            mensagem: `Encaminhamento${destinatarios.length > 1 ? "s" : ""} realizado${destinatarios.length > 1 ? "s" : ""} com sucesso!`,
        });
    } catch (error) {
        console.error("Erro ao processar encaminhamento:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
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
                where: { usuario_id: id },
                include: [{ model: db.Usuario, as: 'Remetente' },
                { model: db.Demanda, as: 'Demanda' },
                { model: db.Usuario, as: 'Destinatario' },
                ]
            });
            return res.status(200).json({ encaminhamentos, mensagem: "Encaminhamentos do usuário carregados com sucesso!" });
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
                where: { demanda_id: id },
                include: [{ model: db.Usuario, as: 'Remetente' },
                { model: db.Demanda, as: 'Demanda' },
                { model: db.Usuario, as: 'Destinatario' },
                ]
            });
            return res.status(200).json({ encaminhamentos, mensagem: "Encaminhamentos da demanda carregados com sucesso!" });
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
        return res.status(200).json({ encaminhamentos, mensagem: "Encaminhamentos carregados com sucesso" });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
