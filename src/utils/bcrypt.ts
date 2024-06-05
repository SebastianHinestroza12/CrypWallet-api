import bcrypt from 'bcrypt';
import { IHashService } from '../interfaces/Authentication';

export class BcryptHashService implements IHashService {
  async hashPassword(password: string): Promise<string> {
    const SALT_WORK_FACTOR = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, SALT_WORK_FACTOR);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
