//@ts-check

const { EOL } = require('os');
const { app } = require('electron');
const PathManager = require('../PathManager');
const LogMessageHelper = require("./LogMessageHelper").default;

const path = require('path');
const fs = require('fs');
const { LogLevel, ILogger } = require("@mnutube/logging");

const now = new Date();
const dateTime = {
  year: now.getUTCFullYear(),
  month: now.getUTCMonth()+1,
  date: now.getUTCDate(),
  hour: now.getUTCHours(),
  min: now.getUTCMinutes(),
  sec: now.getUTCSeconds()
}
const dateTimeString = `${dateTime.year}_${dateTime.month}_${dateTime.date}_${dateTime.hour}_${dateTime.min}_${dateTime.sec}`
const appName = app.getName();

const logDirectoryPath = PathManager.LogDirectory;
const logFilePath = `${appName}_${dateTimeString}.log`;
const logFileFullPath = path.resolve(`${logDirectoryPath}/${logFilePath}`);


/** @type { fs.WriteStream | null } */
let logStream = null;
try {
  if (!fs.existsSync(logDirectoryPath)) {
    fs.mkdirSync(logDirectoryPath);
  }

  if (!fs.existsSync(logFileFullPath)) {
    fs.openSync(logFileFullPath, 'w');
  }

  logStream = fs.createWriteStream(logFileFullPath);

} catch (err) {
  console.warn('Failed to initialize log file.', err);
}

app.addListener('quit', () => {
  logStream?.end();
})

/**
 * @implements {ILogger}
 */
class FileLogger {
  /**
 * 
 * @param {string} catalogName 
 */
  constructor(catalogName) {
    this.catalogName = catalogName;
  }

  /**
 * 
 * @param {LogLevel} logLevel 
 * @param {string | Error} payload 
 * @param {Error} [error]
 */
  log(logLevel, payload, error) {
    logStream?.write(LogMessageHelper.MessageBuild(this.catalogName, logLevel, payload, error) + EOL);
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

exports.default = FileLogger;