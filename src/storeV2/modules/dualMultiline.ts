import { Action, createAction, handleActions } from 'redux-actions';
import * as store from 'storeV2';
import "JsExtensions";
import dualMultilineActionType from './dualMultilineActionType';

interface IDualMultilineState {
  captions?: store.IEventParagraph[];
}

const initState: IDualMultilineState = {};

export const setCaptions = createAction<store.IEventParagraph[]>(dualMultilineActionType.setCaptions);

const reducer = handleActions<IDualMultilineState, any>({
  [dualMultilineActionType.setCaptions]: (state, action: Action<store.IEventParagraph[]>) => {
    return {
      ...state,
      captions: [...action.payload]
    }
  }
}, { ...initState });

export default reducer;