import { Optional } from 'sequelize';

export type UserAttributes = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
  registrationDate?: number;
};

export type UserCreationAttributes = Optional<UserAttributes, 'id'>;
