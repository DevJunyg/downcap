import { DowncapHelper } from 'DowncapHelper';
import { handleActions, createAction, Action, ActionFunction1, ActionFunction2 } from 'redux-actions';
import * as store from 'storeV2';
import popupActionType from './popupActionType';

interface IPopupOpenPayloadSnippet {
  name: store.PopupNameType;
  data?: store.PopupPayloadValueType;
}

type OpenAction1Type = ActionFunction1<store.PopupNameType, Action<IPopupOpenPayloadSnippet>>;
type OpenAction2Type = ActionFunction2<store.PopupNameType, store.PopupPayloadValueType, Action<IPopupOpenPayloadSnippet>>;

export const open = createAction(popupActionType.open, (name: store.PopupNameType, payload: store.PopupPayloadValueType) => ({
  name: name,
  data: payload
})) as OpenAction1Type & OpenAction2Type;
export const close = createAction(popupActionType.close);

const initialState: store.IPopupState = {};

const reducer = handleActions<store.IPopupState, any>({
  [popupActionType.open]: (state, action: Action<IPopupOpenPayloadSnippet>) => {
    return {
      ...state,
      name: action.payload.name,
      payload: action.payload.data
    }
  },
  [popupActionType.close]: state => {
    const { name, payload, ...nextState } = state;
    return { ...nextState };
  }
}, { ...initialState });

export default reducer;