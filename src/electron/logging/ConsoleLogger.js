//@ts-check
const { LogLevel, ILogger } = require("@mnutube/logging");
const LogMessageHelper = require("./LogMessageHelper").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});

console.debug = console.log;
console.info = console.log;

/**
 * @implements {ILogger}
 */
class ConsoleLogger {
  /**
   * 
   * @param {string} catalogName 
   */
  constructor(catalogName) {
    this.catalogName = catalogName;
  }

  /**
   * @type {Object.<LogLevel, (message: string) => void> }
   */
  writeDictionary = {
    [LogLevel.Trace]: console.debug,
    [LogLevel.Debug]: console.debug,
    [LogLevel.Information]: console.info,
    [LogLevel.Warning]: console.warn,
    [LogLevel.Error]: console.error,
    [LogLevel.Critical]: console.error,
    [LogLevel.None]: () => { /* Do not display logs. */ }
  }

  /**
   * 
   * @param {LogLevel} logLevel 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  log(logLevel, payload, error) {
    const getLogWrite = () => this.writeDictionary[logLevel];
    const write = getLogWrite();

    write(LogMessageHelper.MessageBuild(this.catalogName, logLevel, payload, error));
  }

  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logTrace(payload, error) {
    this.log(LogLevel.Trace, payload, error);
  }


  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logDebug(payload, error) {
    this.log(LogLevel.Debug, payload, error);
  }


  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logInformation(payload, error) {
    this.log(LogLevel.Information, payload, error);
  }


  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logWarning(payload, error) {
    this.log(LogLevel.Warning, payload, error);
  }


  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logError(payload, error) {
    this.log(LogLevel.Error, payload, error);
  }


  /**
   * 
   * @param {string | Error} payload 
   * @param {Error} [error]
   */
  logCritical(payload, error) {
    this.log(LogLevel.Critical, payload, error);
  }
}

exports.default = ConsoleLogger;