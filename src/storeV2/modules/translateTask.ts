import * as store from "storeV2";
import translateTaskType from './translateTaskActionType';
import { Action, createAction, handleActions } from "redux-actions";

export interface ITranslateTask {
  originCaption?: store.ICaptionsParagraph;
  translated?: boolean;
}

export interface ITranslateTasksState {
  translateTaskList?: ITranslateTask[];
}

export const reset = createAction<void>(translateTaskType.reset, () => ({ ...initState }));
export const setTranslateTaskList = createAction<ITranslateTask[]>(translateTaskType.setTranslateTaskList);
export const updateTranslatedTask = createAction<ITranslateTask>(translateTaskType.updateTranslatedTask);

const initState: ITranslateTasksState = {
  translateTaskList: []
};

const reducer = handleActions<ITranslateTasksState, any>({
  [translateTaskType.reset]: (_state, action: Action<ITranslateTasksState>) => {
    return {
      ...action.payload
    };
  },
  [translateTaskType.setTranslateTaskList]: (state, action: Action<ITranslateTask[]>) => {
    return {
      ...state,
      translateTaskList: action.payload
    };
  },
  [translateTaskType.updateTranslatedTask]: (state, action: Action<ITranslateTask>) => {
    if (!state.translateTaskList?.any()) {
      throw new Error('Translate task not found');
    }
    
    const translateTaskList = [...state.translateTaskList];
    
    translateTaskList?.forEach((translateTask, index) => {
      const originCaptionId = translateTask.originCaption?.id;
      const translatedOriginCaptionId = action.payload.originCaption?.id;
      if (originCaptionId === translatedOriginCaptionId) {
        translateTaskList[index] = {
          ...translateTaskList[index],
          translated: action.payload.translated
        };
      }
    });

    return {
      ...state,
      translateTaskList
    };
  }
}, initState);

export default reducer;