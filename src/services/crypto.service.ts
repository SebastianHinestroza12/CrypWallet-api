import { api } from '../utils';
import { CryptoData } from '../interfaces/cryptocurrency';
import { CryptocurrencyInstance } from '../interfaces/index';
import { Cryptocurrency } from '../models/Cryptocurrency';
import { Transaction } from 'sequelize';

const { API_SERVICE_CRYPTO } = process.env;

class CryptoService {
  static async getAllCrypto(): Promise<CryptoData[]> {
    if (!API_SERVICE_CRYPTO) {
      throw new Error('Please make sure that all necessary environment variables are set.');
    }

    const getCrypto = await api.get<CryptoData[]>(API_SERVICE_CRYPTO);
    const allCrypto: CryptoData[] = getCrypto.data;

    return allCrypto;
  }

  static async createCrytoCurerncy(transaction: Transaction): Promise<CryptocurrencyInstance[]> {
    const allCrypto: CryptoData[] = await this.getAllCrypto();
    const cryptos = allCrypto.map((crypto) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
    }));

    const createData = await Cryptocurrency.bulkCreate(cryptos, {
      updateOnDuplicate: ['id', 'name', 'symbol'],
      transaction,
    });

    return createData;
  }
}

export { CryptoService };
