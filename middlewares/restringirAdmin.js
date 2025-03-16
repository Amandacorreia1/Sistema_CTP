export const restringirAdmin = () => {
    return (req, res, next) => {
        // Verifica se existe o req.usuario e se o cargo do usuário é 'admin'
        if (!req.usuario) {
            return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
        }

        if (req.usuario.cargo === 'Admin') {
            return res.status(403).json({ mensagem: 'Acesso negado. Administradores não podem acessar esta rota.' });
        }

        next(); // Se não for admin, o fluxo continua
    };
};

export default restringirAdmin;
