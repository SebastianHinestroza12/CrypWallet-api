import { Optional } from 'sequelize';

export type UserAttributes = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  currentWallet?: string;
  avatarUrl?: string;
  registrationDate?: number;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
export type OptionalUserAttributes = Partial<UserAttributes>;
export type RegisterUserAttributes = Omit<UserAttributes, 'id' | 'isActive' | 'registrationDate'>;
