import fs from 'fs';
import util from 'util';
import path from 'path';
import "../test/testPreload";
import IpcSender from 'lib/IpcSender';
import { configureStore } from 'storeV2/store';
import AppSettingManager from './AppSettingManager';
import * as PathManager from '../electron/PathManager';
import * as AppSettingHelper from '../helpers/AppSettingHelper';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';

const saveAppSetting = AppSettingHelper.SaveAppSetting;
const fsReadFileAsync = util.promisify(fs.readFile);

const initialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/AppSettingManager.test/appSettingTestState.json'
);

describe('Save app setting state', () => {
  const appSettingState = { realTimeTranslationFlag: true };
  it('saveAppSettingState return undefined when email no exist.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: undefined });
    const result = await AppSettingManager.saveAppSettingStateAsync(appSettingState);

    expect(result).toBe(undefined);
  })
  
  it('saveAppSettingState saves appSettingPackage to a json file when email exist.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: 'test@test.com' });

    const appSettingFilePath = path.resolve(`${PathManager.UserData}/test@test.com.json`);

    if (fs.existsSync(appSettingFilePath)) {
      fs.rmSync(appSettingFilePath);
    }

    await AppSettingManager.saveAppSettingStateAsync(appSettingState);

    const appSettingPackage = {
      appSettingState,
      userEmail: 'test@test.com'
    };

    await saveAppSetting(appSettingPackage);

    const row = await fsReadFileAsync(appSettingFilePath, 'utf8');
    const readFile = JSON.parse(row);
    
    expect(readFile).toStrictEqual({ realTimeTranslationFlag: true });

    fs.rmSync(appSettingFilePath);
  })
})

describe('Get app setting state', () => {
  const store = configureStore({
    future: [],
    present: initialState,
    past: []
  });

  it('setAppSettingState return undefined when email no exist.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: undefined });
    const result = await AppSettingManager.setAppSettingStateAsync(store.dispatch);

    expect(result).toBe(undefined);
  })
  
  
  it('setAppSettingState returns undefined when no file that matched the email.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: 'notexist@test.com' });
    const result = await AppSettingManager.setAppSettingStateAsync(store.dispatch);

    expect(result).toBe(undefined);
  })

  it('setAppSettingState returns undefined when exist file that matched the email but null.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: 'test@test.com' });
    IpcSender.invokeGetAppSettingStateAsync = jest.fn().mockReturnValue(undefined);
    const result = await AppSettingManager.setAppSettingStateAsync(store.dispatch);

    expect(result).toBe(undefined);
  })

  it('setAppSettingState set app setting when exist file that matched the email and realTimeTranslationFlag is false.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: 'test@test.com' });
    IpcSender.invokeGetAppSettingStateAsync = jest.fn().mockReturnValue({ realTimeTranslationFlag: false });
    
    await AppSettingManager.setAppSettingStateAsync(store.dispatch);

    const reduxState = store.getState();
    const appSettingState = reduxState.present.appSetting;

    expect(appSettingState.realTimeTranslationFlag).toBe(false);
  })

  it('setAppSettingState set app setting when exist file that matched the email and realTimeTranslationFlag is true.', async () => {
    IpcSender.invokeGetUserInfoAsync = jest.fn().mockReturnValueOnce({ email: 'test@test.com' });
    IpcSender.invokeGetAppSettingStateAsync = jest.fn().mockReturnValue({ realTimeTranslationFlag: true });
    
    await AppSettingManager.setAppSettingStateAsync(store.dispatch);

    const reduxState = store.getState();
    const appSettingState = reduxState.present.appSetting;

    expect(appSettingState.realTimeTranslationFlag).toBe(true);
  })
})