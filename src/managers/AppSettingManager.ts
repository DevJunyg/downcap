import * as Redux from 'redux';
import IpcSender from 'lib/IpcSender';
import { default as rootStore } from 'storeV2';
import { IAppSettingState } from "storeV2/modules/appSetting";
import * as appSettingActions from 'storeV2/modules/appSetting';

export default class AppSettingManager {
  static async setAppSettingStateAsync(dispatch: typeof rootStore.dispatch) {
    const userInfo = await IpcSender.invokeGetUserInfoAsync();
    const userEmail = userInfo?.email;

    if(userEmail === undefined) {
      return;
    }

    const appSettingState = await IpcSender.invokeGetAppSettingStateAsync(userEmail);
    
    if (appSettingState === undefined) {
      return;
    }

    const AppSettingAction = Redux.bindActionCreators(appSettingActions, dispatch);

    if (appSettingState.realTimeTranslationFlag) {
      AppSettingAction.setRealTimeTranslationFlag(true);
    }
  }

  static async saveAppSettingStateAsync(appSettingState: IAppSettingState) {
    const userInfo = await IpcSender.invokeGetUserInfoAsync();
    const userEmail = userInfo?.email;

    if(userEmail === undefined) {
      return;
    }

    const appSettingPackage = {
      appSettingState,
      userEmail
    };

    IpcSender.sendAppSettingState(appSettingPackage);
  }
}