import { ILogger, LogLevel } from "@mnutube/logging";
import ReactLogMessageHelper from "./ReactLogMessageHelper";

if (process.env.REACT_APP_ENVIRONMENT === "Development") {
  console.debug = console.log;
  console.info = console.log;
}

export default class ReactConsoleLogger implements ILogger {
  private catalogName: string;

  public constructor(catalogName: string) {
    this.catalogName = catalogName;
  }

  private writeDictionary: { [key in LogLevel]: (message?: any, ...optionalParams: any[]) => void } = {
    [LogLevel.Trace]: console.debug,
    [LogLevel.Debug]: console.debug,
    [LogLevel.Information]: console.info,
    [LogLevel.Warning]: console.warn,
    [LogLevel.Error]: console.error,
    [LogLevel.Critical]: console.error,
    [LogLevel.None]: () => { /* Do not display logs. */ }
  }

  public log(logLevel: LogLevel, payload: string | Error, error?: Error): void {
    const getLogWrite = () => this.writeDictionary[logLevel];
    const write = getLogWrite();
    write(ReactLogMessageHelper.MessageBuild(this.catalogName, logLevel, payload, error));
  }

  public logTrace(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Trace, payload, error);
  }

  public logDebug(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Debug, payload, error);
  }

  public logInformation(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Information, payload, error);
  }

  public logWarning(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Warning, payload, error);
  }

  public logError(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Error, payload, error);
  }

  public logCritical(payload: string | Error, error?: Error): void {
    this.log(LogLevel.Critical, payload, error);
  }
}