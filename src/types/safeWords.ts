import { Optional } from 'sequelize';

export type SafeWordsAttributes = {
  id: number;
  userId: string;
  words: string[];
};

export type SafeWordsCreationAttributes = Optional<SafeWordsAttributes, 'id'>;
