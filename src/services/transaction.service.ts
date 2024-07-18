import { TransactionType } from '../models/TransactionType';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { TransactionTypeAttributes, SendTransactionIProps, UpdateBalanceIProps } from '../types';

class TransactionService {
  static async createTransactionType(): Promise<TransactionTypeAttributes[]> {
    const transactionType = await TransactionType.bulkCreate(
      [
        { name: 'Send' },
        { name: 'Receive' },
        { name: 'Buy' },
        { name: 'Sell' },
        { name: 'Swap' },
        { name: 'None' },
      ],
      {
        updateOnDuplicate: ['name'],
      },
    );

    return transactionType;
  }

  static async updateWalletBalances(data: UpdateBalanceIProps, transaction: SequelizeTransaction) {
    try {
      const { amount, cryptoCurrency, type, walletId } = data;
      const wallet = await Wallet.findByPk(walletId);

      // Validar que si exista una billetera con ese id
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Obtener el objeto de criptomonedas actual
      const currentCrypto = wallet.cryptoCurrency;

      if (!currentCrypto) {
        throw new Error('No crypto currency found in wallet');
      }

      if (!(cryptoCurrency in currentCrypto)) {
        // Verificar si la criptomoneda existe en el objeto
        throw new Error(`Cryptocurrency ${cryptoCurrency} not found in wallet`);
      }

      // Actualizar el valor de la criptomoneda
      if (type === 'increment') {
        currentCrypto[cryptoCurrency] += amount;
      } else if (type === 'decrement') {
        currentCrypto[cryptoCurrency] -= amount;

        // Verificar que no se vuelva negativo
        if (currentCrypto[cryptoCurrency] < 0) {
          throw new Error(`Insufficient ${cryptoCurrency} balance in wallet`);
        }
      } else {
        throw new Error('Invalid transaction type');
      }

      await Wallet.update(
        { cryptoCurrency: currentCrypto },
        { where: { id: walletId }, transaction },
      );
    } catch (e) {
      const error = <Error>e;
      throw new Error(`Failed to update wallet balance: ${error.message}`);
    }
  }

  static async createSendCryptoTransaction(
    data: SendTransactionIProps,
    transaction: SequelizeTransaction,
  ) {
    try {
      const { amount, cryptocurrencyId, destinyWalletId, originWalletId } = data;
      // save transaction data to database and update balances

      await this.updateWalletBalances(
        {
          amount: amount,
          cryptoCurrency: cryptocurrencyId,
          type: 'decrement',
          walletId: originWalletId,
        },
        transaction,
      );

      await this.updateWalletBalances(
        {
          amount: amount,
          cryptoCurrency: cryptocurrencyId,
          type: 'increment',
          walletId: destinyWalletId,
        },
        transaction,
      );

      // Guardar la transacción en la base de datos
      const transfer = await Transaction.create({ ...data, typeId: 1 }, { transaction });

      return transfer;
    } catch (error) {
      throw new Error('Failed to send crypto transaction');
    }
  }
}

export { TransactionService };
