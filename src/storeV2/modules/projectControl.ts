import { Action, createAction, handleActions } from "redux-actions";
import * as store from "storeV2";
import projectControlActionType from './projectControlActionType';

interface IProjectControlState {
  focusParagraphMetas?: store.IFocusParagraphMeta[];
  selectedStyleEditType?: store.StyleEditType;
  rendering?: boolean;
}

const initState: Readonly<IProjectControlState> = Object.freeze({});

export const reset = createAction(projectControlActionType.reset, () => ({ ...initState }));
export const setFocusParagraphMetas = createAction<store.IFocusParagraphMeta[] | null>(projectControlActionType.setFocusParagraphMetas);
export const setSelectedStyleEditType = createAction<store.StyleEditType | null>(projectControlActionType.setSelectedStyleEditType);
export const setVideoRendering = createAction<boolean>(projectControlActionType.setVideoRendering);

const reducer = handleActions<IProjectControlState, any>({
  [projectControlActionType.reset]: (state, action: Action<IProjectControlState>) => {
    return {
      ...action.payload
    };
  },
  [projectControlActionType.setFocusParagraphMetas]: (state, action: Action<store.IFocusParagraphMeta[] | null>) => {
    const { focusParagraphMetas, ...nextState } = state;
    if (action.payload === null) {
      return nextState;
    }

    return {
      ...nextState,
      focusParagraphMetas: [...action.payload]
    }
  },
  [projectControlActionType.setSelectedStyleEditType]: (state, action: Action<store.StyleEditType | null>) => {
    const styleEditType = action.payload;
    if (styleEditType === null) {
      const { selectedStyleEditType, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      selectedStyleEditType: styleEditType
    }
  },
  [projectControlActionType.setVideoRendering]: (state, action: Action<boolean>) => {
    return {
      ...state,
      rendering: action.payload
    };
  }
}, initState);

export default reducer;