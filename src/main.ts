import 'dotenv/config';
import express from 'express';
import { sequelize } from './models';
import { middlewares } from './middlewares/middlewares.server';
import { globalErrorHandler } from './middlewares/errorHandler';
import { routes } from './routes/index.routes';

const app = express();
const PORT = process.env.PORT ?? 3001;

//Middleware configuration
middlewares(app);

//Routes configuration
routes(app);

//Handling server errors
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
