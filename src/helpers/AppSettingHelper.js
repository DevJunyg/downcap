Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require('fs');
const util = require('util');
const path = require('path');
const PathManager = require('../electron/PathManager');

const fsReadFileAsync = util.promisify(fs.readFile);
const fsWriteFileAsync = util.promisify(fs.writeFile);

/**
 * 
 * @param {{appSettingState: import('storeV2/modules/appSetting').IAppSettingState, userEmail: string}} appSettingPackage 
 */
async function saveAppSettingAsync(appSettingPackage) {
  const appSettingFilePath = path.resolve(`${PathManager.UserData}/${appSettingPackage.userEmail}.json`);
  await fsWriteFileAsync(appSettingFilePath, JSON.stringify(appSettingPackage.appSettingState));
}

/**
 * 
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} userEmail
 */
async function getAppSettingAsync(userEmail) {
  const appSettingFilePath = path.resolve(`${PathManager.UserData}/${userEmail}.json`);
  if (fs.existsSync(appSettingFilePath)) {
    const row = await fsReadFileAsync(appSettingFilePath);
    return JSON.parse(row);
  }
}

exports.SaveAppSetting = saveAppSettingAsync;
exports.GetAppSetting = getAppSettingAsync;
