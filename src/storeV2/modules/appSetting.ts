import { Action, createAction, handleActions } from "redux-actions";
import appSettingType from './appSettingActionType';

export interface IAppSettingState {
  realTimeTranslationFlag: boolean;
}


export const setRealTimeTranslationFlag = createAction<boolean>(appSettingType.setRealTimeTranslationFlag);

const initState: IAppSettingState = {
  realTimeTranslationFlag: false
}

const reducer = handleActions<IAppSettingState, any>({
  [appSettingType.setRealTimeTranslationFlag]: (state, action: Action<boolean>) => {
    return {
      ...state,
      realTimeTranslationFlag: action.payload
    }
  }
}, initState);

export default reducer;