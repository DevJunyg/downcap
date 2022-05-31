import ArgumentError from "./ArgumentError";

const ARGUMENT_NULL_ERROR_DEFAULT_MESSAGE = 'Value cannot be null.';

export default class ArgumentNullError extends ArgumentError {
  constructor();
  constructor(parameterName: string);
  constructor(parameterName?: string) {
    let message = ARGUMENT_NULL_ERROR_DEFAULT_MESSAGE;
    if (parameterName) {
      message += ` (Parameter '${parameterName}')`;
    }

    super(message);
    this.name = 'ArgumentNullError';
  }
}