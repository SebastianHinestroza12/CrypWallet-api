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

  static async deleteWalletById(walletId: string, userId: string): Promise<void> {
    const countWallet = await Wallet.findAndCountAll({
      where: {
        userId,
      },
    });
    if (countWallet.count < 2) {
      throw new Error('You must have at least one wallet');
    }
    await Wallet.destroy({
      where: {
        id: walletId,
      },
    });
  }

  static async getWalletById(walletId: string): Promise<WalletAttributes | null> {
    return await Wallet.findOne({
      where: {
        id: walletId,
      },
    });
  }
}

export { WalletService };
