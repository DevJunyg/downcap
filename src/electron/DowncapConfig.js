Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require('fs');
const PathManager = require('./PathManager');
const { v4: uuidv4 } = require('uuid');

const settingPath = PathManager.Setting;

/**
 * 
 * @returns {{ ClientId:  string,  anonymousId: string }}
 */
function ConfigInit() {
  let _config;
  if (!fs.existsSync(settingPath)) {
    const config = {
      ClientId: uuidv4(),
    };
    _config = config;
    fs.writeFileSync(settingPath, JSON.stringify(config));
  }
  else {
    const file = fs.readFileSync(settingPath);
    const config = JSON.parse(file);
    _config = config;
  }

  return {
    ..._config,
    anonymousId: uuidv4()
  };
}

exports.default = ConfigInit();