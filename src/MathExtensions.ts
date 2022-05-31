export default class MathExtensions {
  static round(value: number, digits: number) {
    const pow = Math.pow(10, digits);
    return Math.round(value * pow) / pow;
  }
}