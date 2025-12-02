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
    { expiresIn: "5d" }
  );
}

export { generateAccessToken, generateRefreshToken };