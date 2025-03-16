
export const restringirAdmin = () => {
    return (req, res, next) => {
        if (req.usuario && req.usuario.cargo === 'admin') {
            return res.status(403).json({ mensagem: 'Acesso negado.' });
        }
        next();
    };
};

export default restringirAdmin;
