import downcapOptions from "downcapOptions";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import { Action, createAction, handleActions } from "redux-actions";
import * as store from "storeV2";
import projectActionType from './projectActionType'

interface IWordSplitPalyoad {
  type: 'origin' | 'translated';
  value: number;
}

interface IVideoMeta {
  width: number;
  height: number;
}

export interface IProjectStoreState {
  selectedEditType: store.EditType;
  selectedPreviewType: store.PreviewType;
  sequence: store.SequenceType[];
  wordSplits: {
    origin: number;
    translated: number;
  }
  youtubeVideoId?: string;
  projectName?: string;
  videoPath?: string;
  projectDefaultStyle?: store.ICaptionsStyle;
  totalTranslateTaskLength?: number;
  nowTranslateTaskLength?: number;
  videoMeta?: IVideoMeta;
  translateGuideOpen?: boolean;
}

const logger = ReactLoggerFactoryHelper.build('project');

export const removeVideoPath = createAction(projectActionType.removeVideoPath);
export const setSelectedEditType = createAction<store.EditType>(projectActionType.setSelectedEditType);
export const setSequence = createAction<store.SequenceType[]>(projectActionType.setSequence);
export const setProjectName = createAction<string | null>(projectActionType.setProjectName);
export const setVideoPath = createAction<string | null>(projectActionType.setVideoPath);
export const setSelectedPreviewName = createAction<store.PreviewType>(projectActionType.setSelectedPreviewName);
export const setProjectDefaultStlye = createAction<store.ICaptionsStyle>(projectActionType.setProjectDefaultStlye);
export const setWordSplitValue = createAction<IWordSplitPalyoad>(projectActionType.setWordSplitValue);
export const setTotalTranlsateTaskLength = createAction<number | null>(projectActionType.setTotalTranlsateTaskLength);
export const setNowTranslateTaskLength = createAction<number | null>(projectActionType.setNowTranslateTaskLength);
export const increaseNowTranslateTaskLength = createAction<void>(projectActionType.increaseNowTranslateTaskLength);
export const closeTranslatedGuide = createAction<void>(projectActionType.closeTranslatedGuide);
export const openTranslatedGuide = createAction<void>(projectActionType.openTranslatedGuide);
export const reset = createAction<void>(projectActionType.reset, () => ({ ...initState }));
export const setYoutubeVideoId = createAction<string | null>(projectActionType.setYoutubeVideoId);
export const setVideoMeta = createAction<IVideoMeta | null>(projectActionType.setVideoMeta);

const initState: Readonly<IProjectStoreState> = Object.freeze({
  selectedEditType: "origin",
  selectedPreviewType: "web",
  wordSplits: {
    origin: downcapOptions.defaultSplitValue.origin,
    translated: downcapOptions.defaultSplitValue.translated
  },
  sequence: ['origin', 'translated'],
  translateGuideOpen: false
});

const reducer = handleActions<IProjectStoreState, any>({
  [projectActionType.reset]: (state, action: Action<IProjectStoreState>) => {
    return {
      ...action.payload
    };
  },
  [projectActionType.setProjectName]: (state, action: Action<string | null>) => {
    const name = action.payload;
    if (name === null) {
      const { projectName, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      projectName: name
    };
  },
  [projectActionType.setVideoPath]: (state, action: Action<string | null>) => {
    const path = action.payload;
    if (path === null) {
      const { videoPath, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      videoPath: path
    };
  },
  [projectActionType.removeVideoPath]: state => {
    const { videoPath, ...nextState } = state
    return nextState;
  },
  [projectActionType.setSequence]: (state, action: Action<store.SequenceType[]>) => {
    return {
      ...state,
      sequence: action.payload
    }
  },
  [projectActionType.setSelectedEditType]: (state, action: Action<store.EditType>) => {
    return {
      ...state,
      selectedEditType: action.payload
    }
  },
  [projectActionType.setSelectedPreviewName]: (state, action: Action<store.PreviewType>) => {
    return {
      ...state,
      selectedPreviewType: action.payload
    }
  },
  [projectActionType.setProjectDefaultStlye]: (state, action: Action<store.ICaptionsStyle>) => {
    return {
      ...state,
      projectDefaultStyle: action.payload
    }
  },
  [projectActionType.setWordSplitValue]: (state, action: Action<IWordSplitPalyoad>) => {
    return {
      ...state,
      wordSplits: {
        ...state.wordSplits,
        [action.payload.type]: action.payload.value
      }
    }
  },
  [projectActionType.setTotalTranlsateTaskLength]: (state, action: Action<number | null>) => {
    const length = action.payload;
    if (length === null) {
      const { totalTranslateTaskLength, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      totalTranslateTaskLength: length
    }
  },
  [projectActionType.closeTranslatedGuide]: state => {
    return {
      ...state,
      translateGuideOpen: false
    }
  },
  [projectActionType.setNowTranslateTaskLength]: (state, action: Action<number | null>) => {
    const length = action.payload;
    if (length === null) {
      const { nowTranslateTaskLength, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      nowTranslateTaskLength: length
    }
  },
  [projectActionType.setYoutubeVideoId]: (state, action: Action<string | null>) => {
    const youtubeVideoId = action.payload;
    if (youtubeVideoId === null) {
      const { youtubeVideoId, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      youtubeVideoId: youtubeVideoId
    }
  },
  [projectActionType.setVideoMeta]: (state, action: Action<IVideoMeta>) => {
    const videoMeta = action.payload;
    if (videoMeta === null) {
      const { videoMeta, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      videoMeta: videoMeta
    }
  },
  [projectActionType.openTranslatedGuide]: state => {
    return {
      ...state,
      translateGuideOpen: true
    }
  },
  [projectActionType.increaseNowTranslateTaskLength]: state => {
    const { nowTranslateTaskLength, ...nextState } = state;
    if (nowTranslateTaskLength === undefined) {
      logger.variableIsUndefined('nowTranslateTaskLength', projectActionType.increaseNowTranslateTaskLength)
      return state;
    }
    return {
      ...nextState,
      nowTranslateTaskLength: nowTranslateTaskLength + 1
    };
  }
}, initState as IProjectStoreState);

export default reducer;