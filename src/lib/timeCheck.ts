import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";

const isDevelopement = process.env.REACT_APP_ENVIRONMENT === "Development";

const logger = isDevelopement ? ReactLoggerFactoryHelper.build('timeCheck') : undefined;

function timeCheck<T>(action: () => T | void, message: string) {
  const now = Date.now();
  const result = action();
  const dt = Date.now() - now;
  logger?.logTrace(message + `(${dt}ms)`);
  return result;
}

export default isDevelopement ? timeCheck : (action: <T>() => T | void) => action;
