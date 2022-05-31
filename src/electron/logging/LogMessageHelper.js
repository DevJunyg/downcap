const { LogLevel } = require("@mnutube/logging");

Object.defineProperty(exports, "__esModule", {
  value: true
});

const { EOL } = require('os');

const logLevelAlies = {
  [LogLevel.Trace]: 'trce',
  [LogLevel.Debug]: 'dbug',
  [LogLevel.Information]: 'info',
  [LogLevel.Warning]: 'warn',
  [LogLevel.Error]: 'fail',
  [LogLevel.Critical]: 'crit',
  [LogLevel.None]: 'none',
}

const consoleTab = '      ';
class LogMessageHelper {
  static MessageBuild(catalogName, logLevel, payload, error) {
    let message = `${logLevelAlies[logLevel]}: ${catalogName}\n`;
    if (payload instanceof Error) {
      message += ErrorToLogMessage(payload);
    }
    else {
      message += payload;
      if (error) message += '\n' + ErrorToLogMessage(error);
    }

    return message.replace(/\r\n/g, '\n').replace(/\n/g, `${EOL}${consoleTab}`);

    function ErrorToLogMessage(err) {
      let errMessage = '';
      if (err.name) errMessage += err.name + ' ';
      if (err.message) errMessage += err.message;
      if (err.stack) errMessage += `\n${err.stack}`;
      return errMessage;
    }
  }
}

exports.default = LogMessageHelper;
