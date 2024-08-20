export function isPasswordValid(password: string): boolean {
  const regex = /^(?=.*[A-Z]).{6,24}$/;
  return regex.test(password);
}
