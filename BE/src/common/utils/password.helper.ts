import * as bcrypt from 'bcryptjs';

export class PasswordHelper {
  static async hashPassword(password: string): Promise<string> {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hash(password, SALT);
  }

  static async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
