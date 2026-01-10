import users from '../database/models/User.js';
import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    "ACCESS_SECRET",
    { expiresIn: "2min" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    "REFRESH_SECRET",
    { expiresIn: "2min" }
  );
}

export { generateAccessToken, generateRefreshToken };