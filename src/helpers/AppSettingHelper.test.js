const fs = require('fs');
const util = require('util');
const path = require('path');
const PathManager = require('../electron/PathManager');
const AppSettingHelper = require('./AppSettingHelper');

const fsReadFileAsync = util.promisify(fs.readFile);

const saveAppSetting = AppSettingHelper.SaveAppSetting;
const getAppSetting = AppSettingHelper.GetAppSetting;

const appSettingPackage = {
  appSettingState: {
    realTimeTranslationFlag: true
  },
  userEmail: 'test@test.com'
};

const appSettingFilePath = path.resolve(`${PathManager.UserData}/${appSettingPackage.userEmail}.json`);

it('saveAppSetting saves appSettingPackage to a json file.', async () => {
  if (fs.existsSync(appSettingFilePath)) {
    fs.rmSync(appSettingFilePath);
  }

  await saveAppSetting(appSettingPackage);

  const row = await fsReadFileAsync(appSettingFilePath);
  const readFile = JSON.parse(row);

  expect(readFile).toStrictEqual({ realTimeTranslationFlag: true });

  fs.rmSync(appSettingFilePath);
})

it('getAppSetting returns undefined when no file that matched the email.', () => {
  const email = 'notexist@test.com';
  getAppSetting(email).then((appSetting) => {
    expect(appSetting).toBe(undefined);
  });
})

it('getAppSetting returns app setting when exist file that matched the email.', async () => {
  if (fs.existsSync(appSettingFilePath)) {
    fs.rmSync(appSettingFilePath);
  }

  await saveAppSetting(appSettingPackage);
  
  getAppSetting(appSettingPackage.userEmail).then((appSetting) => {
    expect(appSetting).toStrictEqual({ "realTimeTranslationFlag": true });
  });

  fs.rmSync(appSettingFilePath);
})