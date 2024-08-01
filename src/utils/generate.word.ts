import { wordDictionary } from '../helper/word.dictionary';
import crypto from 'crypto';
import { getEnvVariable } from './env';

const ENCRYPTION_KEY = Buffer.from(getEnvVariable('ENCRYPTION_KEY'), 'hex');
const IV_LENGTH = 16;

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const generateSafeWords = (): string[] => {
  const safeWords: string[] = [];
  const usedWords: Set<string> = new Set();

  while (safeWords.length < 12) {
    const word = wordDictionary[Math.floor(Math.random() * wordDictionary.length)];
    if (!usedWords.has(word)) {
      usedWords.add(word);
      const encryptedWord = encrypt(word);
      safeWords.push(encryptedWord);
    }
  }

  return safeWords;
};
