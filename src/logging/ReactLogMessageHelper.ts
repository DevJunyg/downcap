import { LogLevel } from "@mnutube/logging";

const logLevelAlies = {
  [LogLevel.Trace]: 'trce',
  [LogLevel.Debug]: 'dbug',
  [LogLevel.Information]: 'info',
  [LogLevel.Warning]: 'warn',
  [LogLevel.Error]: 'fail',
  [LogLevel.Critical]: 'crit',
  [LogLevel.None]: 'none',
}


const consoleTab = '        ';
class ReactLogMessageHelper {
  static MessageBuild(catalogName: string, logLevel: LogLevel, payload: string | Error, error?: Error) {
    let message = `${logLevelAlies[logLevel]}: ${catalogName}\n`;
    if (payload instanceof Error) {
      message += ErrorToLogMessage(payload);
    }
    else {
      message += payload;
      if (error) message += '\n' + ErrorToLogMessage(error);
    }

    return message.replace(/\r\n/g, '\n').replace(/\n/g, `\n${consoleTab}`);

    function ErrorToLogMessage(err: Error) {
      let errMessage = '';
      if (err.name) errMessage += err.name + ' ';
      if (err.message) errMessage += err.message;
      if (err.stack) errMessage += `\n${err.stack}`
      return errMessage;
    }
  }
}

export default ReactLogMessageHelper;
