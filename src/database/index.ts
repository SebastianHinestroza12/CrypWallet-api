import { Sequelize } from 'sequelize';

const { DB_NAME, DB_PASSWORD, DB_USER, DB_HOST } = process.env;

if (!DB_NAME || !DB_PASSWORD || !DB_USER || !DB_HOST) {
  throw new Error('Please make sure that all necessary environment variables are set.');
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
