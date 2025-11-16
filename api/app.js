import express from 'express';
import cors from 'cors';
import Router from './routes/index.js';
import sequelize from './database/index.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use('/', Router);


app.listen(port, async () => {
  try {
    await sequelize.authenticate().then(() => {
        console.log('Database connected successfully.');
    });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});