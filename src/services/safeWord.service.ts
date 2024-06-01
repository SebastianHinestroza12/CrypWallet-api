import { SafeWordsAttributes } from '../types';
import { generateSafeWords } from '../utils';
import { SafeWords } from '../models/SafeWords';

class SafeWordsService {
  static async saveSafeWordsByUser(userId: string): Promise<SafeWordsAttributes> {
    const safeWords = await SafeWords.create({
      userId,
      words: generateSafeWords(),
    });

    return safeWords;
  }
}

export { SafeWordsService };
