import { ILogger, LoggerFactory } from "@mnutube/logging";
import ReactConsoleLogger from "./ReactConsoleLogger";
import { IpcRenderLogger } from "./IpcRenderLogger";
interface ILoggerInternalExtend extends ILogger {
  variableIsUndefined?: (variableName: string, methodName?: string, error?: Error) => void;
}

export interface ILoggerExtend extends ILoggerInternalExtend {
  variableIsUndefined: (variableName: string, methodName?: string, error?: Error) => void;
}

export default class ReactLoggerFactoryHelper {
  private static getVariableIsUndefineMessage(variableName: string, methodName?: string) {
    let message = `Undefined variable ${variableName}`;
    if (methodName) message += ` of ${methodName}`;
    return message;
  }

  static build(catalogName: string) {
    const logger = new LoggerFactory(`React.${catalogName}`)
      .AddLogger(name => new ReactConsoleLogger(name))
      .AddLogger(name => new IpcRenderLogger(name))
      .Build() as ILoggerInternalExtend;

    logger.variableIsUndefined = (variableName: string, methodName?: string, error?: Error) => {
      logger.logWarning(ReactLoggerFactoryHelper.getVariableIsUndefineMessage(variableName, methodName), error);
    }

    return logger as ILoggerExtend;
  }
}