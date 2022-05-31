import ArgumentError from "./ArgumentError";

const ARGUMENT_UNDEFINED_ERROR_DEFAULT_MESSAGE = 'Value cannot be undefined.';

export default class ArgumentUndefinedError extends ArgumentError {
  constructor();
  constructor(parameterName: string);
  constructor(parameterName?: string) {
    let message = ARGUMENT_UNDEFINED_ERROR_DEFAULT_MESSAGE;
    if (parameterName) {
      message += ` (Parameter '${parameterName}')`;
    }

    super(message);
    this.name = 'ArgumentUndefinedError';
  }
}