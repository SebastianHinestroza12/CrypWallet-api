/* eslint-disable @typescript-eslint/no-explicit-any */
import Decimal from 'decimal.js';
import { TransactionType } from '../models/TransactionType';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';
import { Transaction as SequelizeTransaction, QueryTypes, Optional } from 'sequelize';
import { sequelize } from '../database';
import {
  TransactionTypeAttributes,
  SendTransactionIProps,
  PaymentDetailIProps,
  TransactionUserIProps,
  UpdateAmountIProps,
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

  static async createSendCryptoTransaction(
    data: SendTransactionIProps,
    transaction: SequelizeTransaction,
  ) {
    try {
      const { amount, cryptocurrencyId, destinyWalletId, originWalletId } = data;
      const updateBalances: UpdateAmountIProps[] = [
        {
          id: cryptocurrencyId,
          amount,
          type: 'decrement',
          walletId: originWalletId,
        },
        {
          id: cryptocurrencyId,
          amount,
          type: 'increment',
          walletId: destinyWalletId,
        },
      ];

      for (const element of updateBalances) {
        await this.updateWalletBalances(element, transaction);
      }

      return await this.createTransaction({ ...data, typeId: 1 }, transaction);
    } catch (error) {
      throw new Error('Failed to send crypto transaction');
    }
  }

  static async cryptoPurchase(data: PaymentDetailIProps, transaction: SequelizeTransaction) {
    const { amount, cryptoID, idPayment, originWalletId, paymentGateway } = data;
    try {
      const currentCrypto = await this.findAndValidateWallet(originWalletId);

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

      const data = {
        idPayment,
        originWalletId,
        amount: parsedAmount.toNumber(),
        cryptocurrencyId: cryptoID,
        paymentGateway,
        typeId: 3,
      };

      return await this.createTransaction(data, transaction);
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
      	t."cryptoFromId",
      	t."cryptoToId",
      	t."amountFrom",
      	t."amountTo",
      	concat(u2."name",
      	' ',
      	u2."lastName") as user_origin,
      	TO_CHAR(TO_TIMESTAMP(t."date"),
      	'DD-MM-YYYY') as formatted_date,
      	CASE
              WHEN t."destinyWalletId"  IS NOT NULL
              THEN concat(u."name", ' ', u."lastName")
              ELSE null
          END AS user_destination
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
      	or w2."userId" in (:userId)
      order by t."id" desc
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

  static async cryptocurrencyExchange(dataSwap: UpdateAmountIProps[]) {
    const transaction = await sequelize.transaction();

    try {
      for (const item of dataSwap) {
        const transaction = await sequelize.transaction();
        try {
          const { jsonCrypto, walletId } = await this.updateWalletBalances(
            item,
            transaction,
            false,
          );
          await Wallet.update(
            { cryptoCurrency: jsonCrypto },
            { where: { id: walletId }, transaction },
          );
          await transaction.commit();
        } catch (e) {
          await transaction.rollback();
          throw e;
        }
      }

      const transactionData = {
        originWalletId: dataSwap[0].walletId,
        amount: 0,
        cryptocurrencyId: dataSwap[0].id,
        cryptoFromId: dataSwap[0].id,
        cryptoToId: dataSwap[1].id,
        amountFrom: dataSwap[0].amount,
        amountTo: dataSwap[1].amount,
        typeId: 4,
      };

      const saveTransaction = await this.createTransaction(transactionData, transaction);
      await transaction.commit();
      return saveTransaction;
    } catch (e) {
      await transaction.rollback();
      const error = <Error>e;
      throw new Error(`Failed to perform crypto exchange ${error.message}`);
    }
  }

  private static async findAndValidateWallet(walletId: string) {
    const wallet = await Wallet.findByPk(walletId);

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const currentCrypto = wallet.cryptoCurrency;

    if (!currentCrypto) {
      throw new Error('No crypto currency found in wallet');
    }

    return currentCrypto;
  }

  private static async updateWalletBalances(
    item: UpdateAmountIProps,
    transaction: SequelizeTransaction,
    executewithTransaction = true,
  ) {
    const { id, amount, type, walletId } = item;
    const jsonCrypto = await this.findAndValidateWallet(walletId);
    const amountCrypto = jsonCrypto[id];

    if (type === 'decrement' && (amount > (amountCrypto ?? 0) || !(id in jsonCrypto))) {
      if (amount > (amountCrypto ?? 0)) {
        throw new Error('Insufficient amount to make the change');
      } else {
        throw new Error(`Cryptocurrency ${id} not found in wallet`);
      }
    }

    const parsedAmount = new Decimal(amount as unknown as string);
    const currentCryptoAmount = new Decimal(amountCrypto ?? 0);

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

    jsonCrypto[id] = newCryptoAmount.toNumber();

    if (executewithTransaction) {
      await Wallet.update({ cryptoCurrency: jsonCrypto }, { where: { id: walletId }, transaction });
    }

    return {
      jsonCrypto,
      walletId,
    };
  }

  private static async createTransaction<T extends Optional<any, string> | undefined>(
    transactionData: T,
    transaction: SequelizeTransaction,
  ) {
    return await Transaction.create(transactionData, { transaction });
  }
}

export { TransactionService };
