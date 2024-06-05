/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { CryptoController } from '../controllers/cryto.controller';

export const crypoRouter = Router();

crypoRouter.get('/cryptocurrencies', CryptoController.getAllCrypto);
crypoRouter.post('/cryptocurrencies', CryptoController.createCrypto);
