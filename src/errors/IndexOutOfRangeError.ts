export default class IndexOutOfRangeError extends Error {
  constructor(parameterName?: string) {
    let messsage = 'Index was outside the bounds.';
    if (parameterName) messsage += ` Parameter name: ${parameterName}`;
    super(messsage);

    this.name = 'IndexOutOfRangeError';
  }
}