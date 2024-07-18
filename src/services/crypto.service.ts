import { api } from '../utils';
import { CryptoCompareData, CryptoCompareApiResponse } from '../interfaces/cryptocurrency';
import { CryptocurrencyInstance } from '../interfaces/index';
import { Cryptocurrency } from '../models/Cryptocurrency';
import { Transaction } from 'sequelize';

class CryptoService {
  static async getAllCrypto(): Promise<CryptoCompareData[]> {
    try {
      const { data } = await api.get<CryptoCompareApiResponse>(
        'https://min-api.cryptocompare.com/data/top/totalvolfull?limit=100&tsym=USD',
      );
      return data.Data;
    } catch (e) {
      const error = <Error>e;
      throw new Error(error.message);
    }
  }

  static async createCrytoCurerncy(transaction: Transaction): Promise<CryptocurrencyInstance[]> {
    const allCrypto = await this.getAllCrypto();
    const cryptos = allCrypto.map((crypto) => ({
      id: crypto.CoinInfo.Name,
      name: crypto.CoinInfo.FullName,
    }));

    const createData = await Cryptocurrency.bulkCreate(cryptos, {
      updateOnDuplicate: ['id', 'name'],
      transaction,
    });

    return createData;
  }
}

export { CryptoService };
