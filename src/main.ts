import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sequelize } from './models';
import helmet from 'helmet';
import { globalErrorHandler, notFoundHandler } from './middlewares/errorHandler';
import { authRoute } from './routes/auth.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import { crypoRouter } from './routes/crypto.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH DELETE');
  next();
});

//Middleware to authenticate
app.use(authMiddleware);

//Authentication routes
app.use('/api/v1/auth', authRoute);

//Cryptocurrency routes
app.use('/api/v1', crypoRouter);

//No found route
app.use(notFoundHandler);

//|Error handling middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server Running In The Port ${PORT}🍓💻`);
  void (async () => {
    try {
      await sequelize.authenticate();
      console.log('DB connection established 💯🖥️.');
      await sequelize.sync({ force: false });
    } catch (error) {
      console.error('Connection to DB failed:', error);
    }
  })();
});
