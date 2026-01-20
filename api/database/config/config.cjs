import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
  }
};
