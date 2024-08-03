import { generateSafeWords, decrypt } from '../utils';
import { SafeWords } from '../models/SafeWords';
import { Transaction } from 'sequelize';

class SafeWordsService {
  static async saveSafeWordsByUser(userId: string, transaction: Transaction): Promise<string[]> {
    const generatedWords = generateSafeWords();
    const safeWords = await SafeWords.create(
      {
        userId,
        words: generatedWords,
      },
      { transaction },
    );

    return safeWords.words.map((word: string) => decrypt(word));
  }

  static async getSafeWordsById(userId: string): Promise<string[] | undefined> {
    const safeWords = await SafeWords.findOne({
      where: {
        userId,
      },
      attributes: ['words'],
    });

    return safeWords?.words.map((word: string) => decrypt(word));
  }
}

export { SafeWordsService };
