import { ILogger, LogLevel } from "@mnutube/logging";
import { IError } from "errors/IError";
import IpcSender from "lib/IpcSender";
import { ILogPayload } from "logging/ILogModel";

export class IpcRenderLogger implements ILogger {
  private catalogName: string;

  public constructor(catalogName: string) {
    this.catalogName = catalogName;
  }

  private payloadBuild(payload: string | Error, error?: Error): ILogPayload {
    let message: string | undefined;
    let err: IError | undefined;
    if (payload instanceof Error) {
      err = errorToJS(payload);
    }
    else {
      message = payload;
      if (error) err = errorToJS(error);
    }

    let logPayload: ILogPayload = {};
    if (message) logPayload = { message: message };
    if (err) logPayload = { ...logPayload, error: err }
    return logPayload;

    function errorToJS(originError: Error) {
      let errorJS: IError = {
        name: originError.name,
        message: originError.message
      };

      if (originError.stack) {
        errorJS.stack = originError.stack;
      }

      return errorJS;
    }
  }

  public log(logLevel: LogLevel, payload: string | Error, error?: Error): void {
    IpcSender.sendLog({
      logLevel: logLevel,
      catalogName: this.catalogName,
      payload: this.payloadBuild(payload, error),
    });
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