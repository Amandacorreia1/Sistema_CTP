
const restringirAdmin = (rotasRestritas) => {
    return (req, res, next) => {
        if (req.user && req.user.role === 'admin' && rotasRestritas.includes(req.path)) {
            return res.status(403).json({ mensagem: 'Acesso negado. Administradores não têm permissão nesta rota.' });
        }
        next();
    };
};

export default restringirAdmin;
