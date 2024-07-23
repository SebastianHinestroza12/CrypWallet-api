import Decimal from 'decimal.js';
import { TransactionType } from '../models/TransactionType';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Transaction as SequelizeTransaction } from 'sequelize';
import {
  TransactionTypeAttributes,
  SendTransactionIProps,
  UpdateBalanceIProps,
  PaymentDetailIProps,
} from '../types';

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

      const parsedAmount = new Decimal(amount as unknown as string);
      const currentCryptoAmount = new Decimal(currentCrypto[cryptoCurrency]);

      // Actualizar el valor de la criptomoneda
      let newCryptoAmount: Decimal;

      if (type === 'increment') {
        newCryptoAmount = currentCryptoAmount.plus(parsedAmount);
      } else if (type === 'decrement') {
        newCryptoAmount = currentCryptoAmount.minus(parsedAmount);

        // Verificar que no se vuelva negativo
        if (newCryptoAmount.lessThan(0)) {
          throw new Error(`Insufficient ${cryptoCurrency} balance in wallet`);
        }
      } else {
        throw new Error('Invalid transaction type');
      }

      // Actualizar el valor de la criptomoneda en el objeto
      currentCrypto[cryptoCurrency] = newCryptoAmount.toNumber();

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

  static async cryptoPurchase(data: PaymentDetailIProps, transaction: SequelizeTransaction) {
    const { amount, cryptoID, idPayment, originWalletId, paymentGateway } = data;
    try {
      const wallet = await Wallet.findByPk(originWalletId);

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const currentCrypto = wallet.cryptoCurrency;

      if (!currentCrypto) {
        throw new Error('No crypto currency found in wallet');
      }

      const parsedAmount = new Decimal(amount as unknown as string);

      if (parsedAmount.isNaN()) {
        throw new Error(`Invalid amount value: ${amount}`);
      }

      if (cryptoID in currentCrypto) {
        currentCrypto[cryptoID] = new Decimal(currentCrypto[cryptoID])
          .plus(parsedAmount)
          .toNumber();
      } else {
        currentCrypto[cryptoID] = parsedAmount.toNumber();
      }

      await Wallet.update(
        { cryptoCurrency: currentCrypto },
        { where: { id: originWalletId }, transaction },
      );

      const buyCrypto = await Transaction.create(
        {
          idPayment,
          originWalletId,
          amount: parsedAmount.toNumber(),
          cryptocurrencyId: cryptoID,
          paymentGateway,
          typeId: 3,
        },
        { transaction },
      );

      return buyCrypto;
    } catch (e) {
      const error = <Error>e;
      throw new Error(`Failed to perform crypto purchase ${error.message}`);
    }
  }
}

export { TransactionService };
