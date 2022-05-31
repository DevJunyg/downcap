import RealTimeTranslationButton from "components/RealTimeTranslationButton"
import AppSettingManager from "managers/AppSettingManager";
import React from "react";
import * as ReactRedux from 'react-redux';
import { bindActionCreators } from "redux";
import ClientAnalysisService from "services/ClientAnalysisService";
import * as store from 'storeV2';
import * as appSettingActions from "storeV2/modules/appSetting";
import { IAppSettingState } from "storeV2/modules/appSetting";


function RealTimeTranslationButtonContainer() {
  const appSettingState = ReactRedux.useSelector<store.RootState, IAppSettingState>(
    state => state.present.appSetting
    );

    const realTimeTranslationFlag = appSettingState.realTimeTranslationFlag ?? false;

  const dispatch = store.default.dispatch;
  const AppSettingActions = bindActionCreators(appSettingActions, dispatch);

  return (
    <RealTimeTranslationButton
      activated={realTimeTranslationFlag}
      onChange={evt => {
        ClientAnalysisService.realtimeTranslationClick(evt.target.checked);
        AppSettingActions.setRealTimeTranslationFlag(evt.target.checked);
        AppSettingManager.saveAppSettingStateAsync(appSettingState);
      }}
    />
  )
}

export default React.memo(RealTimeTranslationButtonContainer);