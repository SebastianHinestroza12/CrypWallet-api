import { WalletAttributes } from '../types';
import { Transaction, QueryTypes } from 'sequelize';
import { Wallet } from '../models/Wallet';
import { getCurrentUnixTimestamp, WalletGenerator } from '../utils';
import { sequelize } from '../database';
import { DestinationWallet } from '../interfaces/Wallet';

class WalletService {
  static async createWallet(
    userId: string,
    nameWallet: string,
    transaction: Transaction,
  ): Promise<WalletAttributes> {
    const wallet = await Wallet.create(
      {
        name: nameWallet,
        userId,
        address: WalletGenerator.generateAddress(),
        cryptoCurrency: WalletGenerator.generateRandomCryptoValues(),
      },
      { transaction },
    );
    return wallet;
  }

  static async getWalletByUserId(userId: string): Promise<WalletAttributes[]> {
    return await Wallet.findAll({
      where: {
        userId,
        isDeleted: false,
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
          isDeleted: false,
        },
      },
    );
  }

  static async deleteWalletById(walletId: string, userId: string): Promise<void> {
    const countWallet = await Wallet.count({
      where: {
        userId,
        isDeleted: false,
      },
    });

    if (countWallet < 2) {
      throw new Error('You must have at least one wallet');
    }

    //Borrado lógico
    await Wallet.update(
      { isDeleted: true, deletedAt: getCurrentUnixTimestamp() },
      {
        where: {
          id: walletId,
        },
      },
    );
  }

  static async getWalletById(walletId: string): Promise<WalletAttributes | null> {
    return await Wallet.findOne({
      where: {
        id: walletId,
        isDeleted: false,
      },
    });
  }

  static async getWalletByAddress(address: string): Promise<WalletAttributes | null> {
    return await Wallet.findOne({
      where: {
        address,
        isDeleted: false,
      },
    });
  }

  static async getWalletByField(
    field: 'id' | 'address',
    value: string,
  ): Promise<{ wallet: WalletAttributes; destination: DestinationWallet[] } | null> {
    const findWallet = await Wallet.findOne({
      where: {
        [field]: value,
        isDeleted: false,
      },
    });

    if (findWallet) {
      const query = `
      SELECT CONCAT(u."name", ' ', u."lastName") AS name, w.id as walletId 
      FROM public.wallets AS w
      INNER JOIN public.users AS u ON w."userId" = u.id
      WHERE w.address = :address
    `;

      const destinationWallet: DestinationWallet[] = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { address: value },
      });

      return {
        wallet: findWallet,
        destination: destinationWallet,
      };
    }

    return null;
  }
}

export { WalletService };
