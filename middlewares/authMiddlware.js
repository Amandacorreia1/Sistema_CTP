import jwt from "jsonwebtoken";

export const autenticarToken = async (req, res, next) => {
  const cabecalhoAutenticacao = req.headers["authorization"];
  const token = cabecalhoAutenticacao && cabecalhoAutenticacao.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const usuario = await jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (erro) {
    console.error("Erro ao verificar token:", erro);
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
};

export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.cargo !== role) {
      return res.status(403).json({ mensagem: "Acesso negado" });
    }
    next();
  };
};
