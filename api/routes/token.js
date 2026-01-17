import { Router } from "express";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js";
const router = Router();

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) 
    return res.status(401).json({ erro: "Não autenticado" });

  jwt.verify(refreshToken, "REFRESH_SECRET", (err, user) => {
    if (err) 
      return res.status(403).json({ erro: "Refresh inválido" });

    // Garante que o payload tenha email, se disponível
    const newAccess = generateAccessToken({ id: user.id, email: user.email });

    res.cookie("accessToken", newAccess, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 1000 * 60 * 15,
    });

    res.json({ message: "Token renovado" });
  });
});


router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Deslogado" });
});

export default router;