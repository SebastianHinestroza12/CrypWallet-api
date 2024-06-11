/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';

const walletRoutes = Router();

walletRoutes.post('/:id', WalletController.createWallet);
walletRoutes.get('/user/:id', WalletController.getWalletByUserId);
// walletRoutes.get('/:wallet_id', WalletController.getWalletByUserId);
// walletRoutes.delete('/:wallet_id', WalletController.getWalletByUserId);
walletRoutes.patch('/update/:id', WalletController.setWalletById);

export { walletRoutes };
