import jwt from 'jsonwebtoken';

export const autenticarToken = (req, res, next) => {
    const cabecalhoAutenticacao = req.headers['authorization'];
    const token = cabecalhoAutenticacao && cabecalhoAutenticacao.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
        if (erro) {
            return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
        }
        req.usuario = usuario;
        next();
    });
};

export const authorizeRole = (role) => {
    return (req, res, next) => {
        try{
            if (req.usuario.cargo !== role) {
                return res.status(403).json({ message: 'Acesso negado' });
            }
            next();

        } catch (error){
            return res.status(500).json({ mensagem: 'Erro no servidor.' });
        }
    };
  }; 
