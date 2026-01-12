
import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ authenticated: false, error: "Não autenticado" });

  jwt.verify(token, "ACCESS_SECRET", (err, user) => {
    if (err) return res.status(401).json({ authenticated: false, error: "Token inválido" });
    req.user = user;
    next();
  });
}

export default authMiddleware;