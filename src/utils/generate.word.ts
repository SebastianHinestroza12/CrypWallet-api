import { wordDictionary } from '../helper/word.dictionary';

export const generateSafeWords = (): string[] => {
  const safeWords: string[] = [];

  while (safeWords.length < 12) {
    const word = wordDictionary[Math.floor(Math.random() * wordDictionary.length)];
    if (!safeWords.includes(word)) {
      safeWords.push(word);
    }
  }

  return safeWords;
};
