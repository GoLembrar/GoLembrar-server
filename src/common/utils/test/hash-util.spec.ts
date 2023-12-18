import { HashUtil } from '../hashUtil';

describe('HashUtil class units tests', () => {
  it('should return false when trying to compare passwords without encrypted one', async () => {
    const pass: string = '123456';
    const userInput: string = '123456';

    const comparisonResult: boolean = await HashUtil.compare(pass, userInput);
    expect(comparisonResult).toBeFalsy();
  });

  it('should return encrypted password', async () => {
    const pass: string = '12345';
    const encrypted: string = await HashUtil.hash(pass);
    expect(encrypted).not.toBe(pass);
  });

  it('should return false when comparing different passwords', async () => {
    const pass: string = 'pass123';
    const differentPass: string = 'Pass1234';
    const encrypted: string = await HashUtil.hash(pass);
    const comparison: boolean = await HashUtil.compare(
      differentPass,
      encrypted,
    );

    expect(comparison).toBeFalsy();
  });

  it('should return true when comparing matching passwords', async () => {
    const pass: string = 'pass123';
    const otherPass: string = 'pass123';
    const encrypted: string = await HashUtil.hash(pass);
    const comparison: boolean = await HashUtil.compare(otherPass, encrypted);

    expect(comparison).toBeTruthy();
  });
});
