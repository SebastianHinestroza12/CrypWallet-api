import { WalletAttributes } from '../types';
import { Transaction } from 'sequelize';
import { Wallet } from '../models/Wallet';
import { generateWalletAddress } from '../utils';

class WalletService {
  static async createWallet(userId: string, transaction: Transaction): Promise<WalletAttributes> {
    const wallet = await Wallet.create(
      {
        name: 'Main Wallet 1',
        address: generateWalletAddress(),
        userId,
      },
      { transaction },
    );

    return wallet;
  }
}

export { WalletService };
