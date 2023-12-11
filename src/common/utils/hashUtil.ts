import * as bcrypt from 'bcrypt';

export class HashUtil {
  static async hash(text: string): Promise<string> {
    const salt = 12;
    return await bcrypt.hash(text, salt);
  }

  static async compare(text: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(text, encrypted);
  }
}
