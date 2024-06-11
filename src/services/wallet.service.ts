import { WalletAttributes } from '../types';
import { Transaction } from 'sequelize';
import { Wallet } from '../models/Wallet';
import { WalletAddressGenerator } from '../utils';

class WalletService {
  static async createWallet(
    userId: string,
    nameWallet: string,
    transaction: Transaction,
  ): Promise<WalletAttributes> {
    const wallet = await Wallet.create(
      {
        name: nameWallet,
        address: WalletAddressGenerator.generate(),
        userId,
      },
      { transaction },
    );
    return wallet;
  }

  static async getWalletByUserId(userId: string): Promise<WalletAttributes[]> {
    return await Wallet.findAll({
      where: {
        userId,
      },
    });
  }

  static async setWalletById(walletId: string, name: string): Promise<void> {
    await Wallet.update(
      {
        name,
      },
      {
        where: {
          id: walletId,
        },
      },
    );
  }

  static async deleteWalletById(walletId: string): Promise<void> {}

  static async findWalletById(walletId: string): Promise<void> {}
}

export { WalletService };
