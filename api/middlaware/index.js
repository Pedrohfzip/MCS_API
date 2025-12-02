
import jwt from 'jsonwebtoken';
function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ erro: "Não autenticado" });

  jwt.verify(token, "ACCESS_SECRET", (err, user) => {
    if (err) return res.status(401).json({ erro: "Token inválido" });
    req.user = user;
    next();
  });
}
export default authMiddleware;