export const restringirAdmin = () => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
        }

        if (req.usuario.cargo === 'Admin') {
            return res.status(403).json({ mensagem: 'Acesso negado. Administradores não podem acessar esta rota.' });
        }
        next();
    };
};

export default restringirAdmin;
