import { SafeWordsAttributes } from '../types';
import { generateSafeWords } from '../utils';
import { SafeWords } from '../models/SafeWords';
import { Transaction } from 'sequelize';

class SafeWordsService {
  static async saveSafeWordsByUser(
    userId: string,
    transaction: Transaction,
  ): Promise<SafeWordsAttributes> {
    const safeWords = await SafeWords.create(
      {
        userId,
        words: generateSafeWords(),
      },
      { transaction },
    );

    return safeWords;
  }

  static async getSafeWordsById(userId: string): Promise<SafeWordsAttributes | null> {
    return await SafeWords.findOne({
      where: {
        userId,
      },
      attributes: ['words'],
    });
  }
}

export { SafeWordsService };
