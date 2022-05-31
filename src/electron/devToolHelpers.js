
Object.defineProperty(exports, "__esModule", {
  value: true
});

const reactDevToolId = process.env.ELECTRON_APP_REACT_DEV_TOOL_ID;
const reduxDevToolId = process.env.ELECTRON_APP_REDUX_DEV_TOOL_ID;

let defuatlPath = null;
function getExtensionsDefaultPath() {
  if (defuatlPath === null) {
    defuatlPath = getDefaultDevtoolPath();
  }

  return defuatlPath;

  function getDefaultDevtoolPath() {
    const path = require('path');
    const OsType = require('./OsType');
    const os = require('os');
    switch (os.type()) {
      case OsType.MacOS:
        return path.join(os.homedir(), '/Library/Application Support/Google/Chrome/Default/Extensions');
      case OsType.Windows:
        return path.join(process.env.LOCALAPPDATA, '/Google/Chrome/User Data/Default/Extensions');
      default:
        throw new Error("Unsupported os");
    }
  }
}

function getDevToolDefaultPath(id, version, logger) {
  if (!id) {
    return undefined;
  }
  const fs = require('fs');
  const path = require('path');
  const devToolRootPath = path.join(getExtensionsDefaultPath(), id);
  if (!fs.existsSync(devToolRootPath)) {
    return undefined;
  }

  if (version === null) {
    version = fs.readdirSync(devToolRootPath)[0];
  }

  const devToolPath = path.join(devToolRootPath, version);
  logger?.logInformation(devToolPath);
  return devToolPath;
}

const addDevTools = (logger) => {
  const devTools = [
    {
      name: "React Developer Tools",
      path: process.env.ELECTRON_APP_REACT_DEV_TOOL_PATH ?? getDevToolDefaultPath(reactDevToolId, null, logger)
    },
    {
      name: "Redux DevTool",
      path: process.env.ELECTRON_APP_REDUX_DEV_TOOL_PATH ?? getDevToolDefaultPath(reduxDevToolId, null, logger)
    }
  ];

  devTools.forEach(devTool => {
    try {
      require('electron').session.defaultSession.loadExtension(devTool.path);
    } catch {
      console.warn(`Failed to connect ${devTool.name}. Path: ${devTool.path}.`);
    }
  })
};

exports.default = addDevTools;
