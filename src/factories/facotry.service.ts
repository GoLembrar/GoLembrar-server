import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryService {
  public generateWords(count: number): string {
    return faker.word.words({ count });
  }

  public generateUUID(): string {
    return faker.string.uuid();
  }

  public generatePhoneNumber(): string {
    return faker.phone.number();
  }

  public generateUserName(firstName?: string, lastName?: string): string {
    return faker.internet.userName({ firstName, lastName });
  }

  public generateEmail(): string {
    return faker.internet.email();
  }

  public generateAvatar(): string {
    return faker.image.avatar();
  }

  public generatePassword(
    length: number = 12,
    memorable: boolean = true,
  ): string {
    return faker.internet.password({
      length,
      memorable,
    });
  }

  public generateBirthdate(): Date {
    return faker.date.birthdate();
  }

  public generatePastDate(): Date {
    return faker.date.past();
  }
}
