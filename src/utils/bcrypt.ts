import bcrypt from 'bcrypt';

const hashPassword = async (password: number): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password.toString(), salt);
};

const comparePassword = async (password: number, hash: string): Promise<boolean> => {
  return bcrypt.compare(password.toString(), hash);
};

export { hashPassword, comparePassword };
