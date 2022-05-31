import { Action, createAction, handleActions } from 'redux-actions';
import * as store from 'storeV2';
import "JsExtensions";
import dualCaptionActionType from './dualCaptionActionType';

interface IDualCaptionState {
  captions?: store.IEventParagraph[];
}

const initState: IDualCaptionState = {};

export const setCaptions = createAction<store.IEventParagraph[]>(dualCaptionActionType.setCaptions);

const reducer = handleActions<IDualCaptionState, any>({
  [dualCaptionActionType.setCaptions]: (state, action: Action<store.IEventParagraph[]>) => {
    return {
      ...state,
      captions: [...action.payload]
    }
  }
}, { ...initState });

export default reducer;