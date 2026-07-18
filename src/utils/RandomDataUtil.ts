export class RandomDataUtil {
  static generateUsername(prefix = 'AutoUser'): string {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      `${now.getMonth() + 1}`.padStart(2, '0'),
      `${now.getDate()}`.padStart(2, '0'),
      `${now.getHours()}`.padStart(2, '0'),
      `${now.getMinutes()}`.padStart(2, '0'),
      `${now.getSeconds()}`.padStart(2, '0')
    ].join('');

    return `${prefix}_${stamp}`;
  }
}
