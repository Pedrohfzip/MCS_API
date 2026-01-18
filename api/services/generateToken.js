import users from '../database/models/User.js';
import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    "ACCESS_SECRET",
    { expiresIn: "1h" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    "REFRESH_SECRET",
    { expiresIn: "1min" }
  );
}

function deleteTokens(res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

}

export { generateAccessToken, generateRefreshToken, deleteTokens };