export class UserFactory {
  static create(name: string, email: string) {
    return {
      name,
      email,
      password: '123456',
      reminder: [],
      contacts: [],
      emails: [],
    };
  }
}
