const ARGUMENT_ERROR_DEFAULT_MESSAGE = 'Value does not fall within the expected range.';

export default class ArgumentError extends Error {
  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? ARGUMENT_ERROR_DEFAULT_MESSAGE);

    this.name = 'ArgumentError';
  }
}