import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sequelize } from './database';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH DELETE');
  next();
});

app.listen(PORT, () => {
  console.log(`Server Running In The Port ${PORT}🍓💻`);
  void (async () => {
    try {
      await sequelize.authenticate();
      console.log('DB connection established 💯🖥️.');
      await sequelize.sync();
    } catch (error) {
      console.error('Connection to DB failed:', error);
    }
  })();
});