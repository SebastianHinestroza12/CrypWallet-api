import Decimal from 'decimal.js';
import { TransactionType } from '../models/TransactionType';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Transaction as SequelizeTransaction, QueryTypes } from 'sequelize';
import { sequelize } from '../database';
import {
  TransactionTypeAttributes,
  SendTransactionIProps,
  UpdateBalanceIProps,
  PaymentDetailIProps,
  TransactionUserIProps,
  ExchangeDataIProps,
} from '../types';

class TransactionService {
  static async createTransactionType(): Promise<TransactionTypeAttributes[]> {
    const transactionType = await TransactionType.bulkCreate(
      [{ name: 'Send' }, { name: 'Receive' }, { name: 'Buy' }, { name: 'Swap' }, { name: 'None' }],
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

  static async getAllTransactionByUser(userId: string): Promise<TransactionUserIProps[]> {
    try {
      const query = `
      select
      	t.id ,
      	t."idPayment",
      	w1."address" as destination,
      	w2."address" as origin,
      	t.amount,
      	c.id as symbol,
      	c."name" as name_cryptocurrency,
      	tt."name" as type_transaction,
      	t."referenceNumber",
      	t."paymentGateway",
      	concat(u2."name",
      	' ',
      	u2."lastName") as user_origin,
      	TO_CHAR(TO_TIMESTAMP(t."date"),
      	'DD-MM-YYYY HH24:MI') as formatted_date,
      	case
      		when t."destinyWalletId" is not null
              then concat(u."name",
      		' ',
      		u."lastName")
      		else null
      	end as user_destination
      from
      	public.transactions t
      left join public.wallets w1 on
      	w1.id = t."destinyWalletId"
      join public.wallets w2 on
      	w2.id = t."originWalletId"
      join public.cryptocurrencies c on
      	c.id = t."cryptocurrencyId"
      join public.transaction_types tt on
      	tt.id = t."typeId"
      left join public.users u on
      	u.id = w1."userId"
      join public.users u2 on
      	u2.id = w2."userId"
      where
      	w1."userId" in (:userId)
      	or w2."userId" in (:userId);
    `;

      const allTransactions: TransactionUserIProps[] = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userId },
      });

      return allTransactions;
    } catch (e) {
      const error = <Error>e;
      console.error('Error getting transactions by user:', error.message);
      throw new Error('Failed to get transactions');
    }
  }

  static async cryptocurrencyExchange(
    dataSwap: ExchangeDataIProps,
    transaction: SequelizeTransaction,
  ) {
    try {
      const { walletId, data } = dataSwap;

      const wallet = await Wallet.findByPk(walletId);

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const currentCrypto = wallet.cryptoCurrency;

      if (!currentCrypto) {
        throw new Error('No crypto currency found in wallet');
      }

      for (const { id, amount, type, currentAmountCrypto } of data) {
        if (type === 'decrement' && amount > (currentAmountCrypto ?? 0)) {
          throw new Error('Insufficient amount to make the change');
        }

        const parsedAmount = new Decimal(amount as unknown as string);
        const currentCryptoAmount = new Decimal(currentCrypto[id]);

        let newCryptoAmount: Decimal;

        if (type === 'increment') {
          newCryptoAmount = currentCryptoAmount.plus(parsedAmount);
        } else if (type === 'decrement') {
          newCryptoAmount = currentCryptoAmount.minus(parsedAmount);

          if (newCryptoAmount.lessThan(0)) {
            throw new Error(`Insufficient ${id} balance in wallet`);
          }
        } else {
          throw new Error('Invalid transaction type');
        }

        currentCrypto[id] = newCryptoAmount.toNumber();

        await Wallet.update(
          { cryptoCurrency: currentCrypto },
          { where: { id: walletId }, transaction },
        );
      }

      // Guardar la transacción en la base de datos
      return await Transaction.create(
        {
          originWalletId: walletId,
          amount: 0,
          cryptocurrencyId: dataSwap.data[0].id,
          cryptoFromId: dataSwap.data[0].id,
          cryptoToId: dataSwap.data[1].id,
          amountFrom: dataSwap.data[0].amount,
          amountTo: dataSwap.data[1].amount,
          typeId: 4,
        },
        { transaction },
      );
    } catch (e) {
      const error = <Error>e;
      throw new Error(`Failed to perform crypto exchange ${error.message}`);
    }
  }
}

export { TransactionService };
