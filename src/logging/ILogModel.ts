import { LogLevel } from "@mnutube/logging";
import { IError } from "errors/IError";

export interface ILogPayload {
  message?: string
  error?: IError
}

export interface ILogModel {
  catalogName: string,
  logLevel: LogLevel
  payload: ILogPayload
}