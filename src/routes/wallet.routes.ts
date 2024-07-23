/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { validateWalletId, paramsIdValidation } from '../validations/wallet.validate';

const walletRoutes = Router();

walletRoutes.post('/:id', paramsIdValidation(), WalletController.createWallet);
walletRoutes.get('/:id', paramsIdValidation(), WalletController.getWalletById);
walletRoutes.get('/address/:walletAddress', WalletController.getWalletByAddress);
walletRoutes.delete('/delete/:id/:userId', validateWalletId(), WalletController.deleteWalletById);
walletRoutes.get('/user/:id', paramsIdValidation(), WalletController.getWalletByUserId);
walletRoutes.patch('/update/:id', paramsIdValidation(), WalletController.setWalletById);

export { walletRoutes };
