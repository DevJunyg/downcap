//@ts-check
Object.defineProperty(exports, "__esModule", {
  value: true
});

const LoggerFactory = require("@mnutube/logging").LoggerFactory;
const ConsoleLogger = require("./ConsoleLogger").default;
const FileLogger = require("./FileLogger").default;

class LoggerFactoryHelper {
  /**
   * 
   * @param {string} catalogName 
   * @returns {import("@mnutube/logging").ILogger}
   */
  static Build(catalogName) {
    return new LoggerFactory(`Electron.${catalogName}`)
      .AddLogger(name => new ConsoleLogger(name))
      .AddLogger(name => new FileLogger(name))
      .Build();
  }
}

exports.default = LoggerFactoryHelper;