const FORMAT_ERROR_DEFAULT_MESSAGE = 'Invalid format.';

export default class FormatError extends Error {
  constructor();
  constructor(message: string);
  constructor(message?: string) {
    super(message ?? FORMAT_ERROR_DEFAULT_MESSAGE);

    this.name = 'FormatError';
  }
}