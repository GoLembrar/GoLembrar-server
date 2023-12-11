import * as bcrypt from 'bcrypt';

export class HashUtil {
  static async hash(
    text: string,
    saltOrRounds: number | string,
  ): Promise<string> {
    const salt =
      typeof saltOrRounds === 'number'
        ? await bcrypt.genSalt(saltOrRounds)
        : saltOrRounds;
    return await bcrypt.hash(text, salt);
  }

  static async compare(text: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(text, encrypted);
  }
}
