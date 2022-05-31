import { combineReducers, StateFromReducersMapObject } from 'redux';
import * as modules from './modules';
import createSagaMiddleware from 'redux-saga'
import { configureStore } from '@reduxjs/toolkit';
import sagas from './sagas';
import undoable, { FilterFunction, GroupByFunction, StateWithHistory } from 'redux-undo';
import * as store from 'storeV2';
import { Action } from 'redux-actions';
import {
  originCaptionActionType,
  projectControlActionType,
  translatedCaptionActionType,
  projectActionType,
  popupActionType,
  multilineActionType,
  translatedMultilineActionType,
  dualCaptionActionType,
  youtubeSearchActionType,
  dualMultilineActionType
} from './modules/actionType';

type StoreState = StateFromReducersMapObject<typeof modules>;
export type RootState = StateWithHistory<StoreState>;

const groupByActionDirectory: { [name in string]?: GroupByFunction<StoreState, Action<any>> } = {
  [originCaptionActionType.setText]: (action, currentState, previousHistory) => {
    return originCaptionActionType.setText;
  },
  [originCaptionActionType.setCaptions]: (action, currentState, previousHistory) => {
    switch (previousHistory.group) {
      case projectActionType.setWordSplitValue:
        return projectActionType.setWordSplitValue;
      case originCaptionActionType.setCaptions:
        return null;
    }

    return originCaptionActionType.setCaptions;
  },
  [projectControlActionType.setFocusParagraphMetas]: (action, currentState, previousHistory) => {
    const groupSet = new Set([
      originCaptionActionType.setCaptions,
      projectActionType.setWordSplitValue,
      translatedCaptionActionType.setCaptions
    ]);

    return groupSet.has(previousHistory.group) ? previousHistory.group : projectControlActionType.setFocusParagraphMetas;
  },
  [projectControlActionType.setSelectedStyleEditType]: (action, currentState, previousHistory) => {
    const groupSet = new Set([
      projectControlActionType.setFocusParagraphMetas,
      originCaptionActionType.setText,
      originCaptionActionType.setCaptions,
      projectActionType.setWordSplitValue
    ]);

    return groupSet.has(previousHistory.group) ? previousHistory.group : null;
  },
  [translatedCaptionActionType.updateCaptionById]: (action, currentState, previousHistory) => {
    const groupSet = new Set([
      translatedCaptionActionType.setCaptions,
      projectControlActionType.setFocusParagraphMetas
    ]);

    return groupSet.has(previousHistory.group) ? previousHistory.group : null;
  },
  [translatedCaptionActionType.setCaptions]: (action, currentState, previousHistory) => {
    switch (previousHistory.group) {
      case translatedCaptionActionType.setCaptions:
        return projectControlActionType.setFocusParagraphMetas;
      case projectActionType.setWordSplitValue:
        return projectActionType.setWordSplitValue;
    }

    return translatedCaptionActionType.setCaptions;
  },
  [projectActionType.setWordSplitValue]: (action, currentState, previousHistory) => projectActionType.setWordSplitValue,
  [translatedCaptionActionType.setText]: (action, currentState, previousHistory) => translatedCaptionActionType.setText,
  [translatedCaptionActionType.setTextByCaptionId]: (action, currentState, previousHistory) => translatedCaptionActionType.setTextByCaptionId,
  [multilineActionType.setText]: (action, currentState, previousHistory) => multilineActionType.setText,
  [translatedMultilineActionType.setText]: (action, currentState, previousHistory) => translatedMultilineActionType.setText,
  [youtubeSearchActionType.setSearchText]: (action, currentState, previousHistory) => youtubeSearchActionType.setSearchText,
  [youtubeSearchActionType.setSearchItems]: (action, currentState, previousHistory) => youtubeSearchActionType.setSearchItems,
  [youtubeSearchActionType.setLastSearchRequesText]: (action, currentState, previousHistory) => youtubeSearchActionType.setSearchItems,
  [youtubeSearchActionType.setLastSearchRequesTime]: (action, currentState, previousHistory) => youtubeSearchActionType.setSearchItems,

  [originCaptionActionType.setWordColor]: (action, currentState, previousHistory) => originCaptionActionType.setWordColor,
  [originCaptionActionType.setWordOutlineColor]: (action, currentState, previousHistory) => originCaptionActionType.setWordOutlineColor,
  [originCaptionActionType.setLineBackground]: (action, currentState, previousHistory) => originCaptionActionType.setLineBackground,
  [originCaptionActionType.setLineColor]: (action, currentState, previousHistory) => originCaptionActionType.setLineColor,
  [originCaptionActionType.setLineOutlineColor]: (action, currentState, previousHistory) => originCaptionActionType.setLineOutlineColor,

  [translatedCaptionActionType.setWordColor]: (action, currentState, previousHistory) => translatedCaptionActionType.setWordColor,
  [translatedCaptionActionType.setWordOutlineColor]: (action, currentState, previousHistory) => translatedCaptionActionType.setWordOutlineColor,
  [translatedCaptionActionType.setLineBackground]: (action, currentState, previousHistory) => translatedCaptionActionType.setLineBackground,
  [translatedCaptionActionType.setLineColor]: (action, currentState, previousHistory) => translatedCaptionActionType.setLineColor,
  [translatedCaptionActionType.setLineOutlineColor]: (action, currentState, previousHistory) => translatedCaptionActionType.setLineOutlineColor,

  [multilineActionType.setWordColor]: (action, currentState, previousHistory) => multilineActionType.setWordColor,
  [multilineActionType.setWordOutlineColor]: (action, currentState, previousHistory) => multilineActionType.setWordOutlineColor,
  [multilineActionType.setLineBackground]: (action, currentState, previousHistory) => multilineActionType.setLineBackground,
  [multilineActionType.setLineColor]: (action, currentState, previousHistory) => multilineActionType.setLineColor,
  [multilineActionType.setLineOutlineColor]: (action, currentState, previousHistory) => multilineActionType.setLineOutlineColor,

  [translatedMultilineActionType.setWordColor]: (action, currentState, previousHistory) => translatedMultilineActionType.setWordColor,
  [translatedMultilineActionType.setWordOutlineColor]: (action, currentState, previousHistory) => translatedMultilineActionType.setWordOutlineColor,
  [translatedMultilineActionType.setLineBackground]: (action, currentState, previousHistory) => translatedMultilineActionType.setLineBackground,
  [translatedMultilineActionType.setLineColor]: (action, currentState, previousHistory) => translatedMultilineActionType.setLineColor,
  [translatedMultilineActionType.setLineOutlineColor]: (action, currentState, previousHistory) => translatedMultilineActionType.setLineOutlineColor,
  [translatedCaptionActionType.updateCaptions]: (action, currentState, previousHistory) => translatedCaptionActionType.updateCaptions
}

function ignoreRedo(action: Action<any>, currentState: StoreState, previousHistory: StateWithHistory<StoreState>) {
  return false;
}

const filterActionDirectory: { [name in string]?: FilterFunction<StoreState, Action<any>> } = {
  [translatedCaptionActionType.updateCaptionById]: (action, currentState, previousHistory) => {
    let payload = (action.payload as store.ICaptionTranslatedParagraphWithId);
    if (!(payload.meta?.translatStatus === "Successed" && payload.meta?.reversTranslateStatus === "Successed")) {
      return false;
    }

    return true;
  },
  [projectActionType.setVideoMeta]: ignoreRedo,
  [popupActionType.open]: ignoreRedo,
  [popupActionType.close]: ignoreRedo,
  [projectActionType.closeTranslatedGuide]: ignoreRedo,
  [dualCaptionActionType.setCaptions]: ignoreRedo,
  [dualMultilineActionType.setCaptions]: ignoreRedo,
  [projectActionType.setProjectDefaultStlye]: ignoreRedo,
  [translatedMultilineActionType.setCheckPoint]: ignoreRedo
}

function configureDowncapStore(preloadedState?: RootState) {
  const reducer = undoable(combineReducers(modules), {
    groupBy: (action, currentState, previousHistory) => {
      const act = groupByActionDirectory[action.type] ?? null;
      return act && act(action, currentState, previousHistory);
    },
    filter: (action, currentState, previousHistory) => {
      const act = filterActionDirectory[action.type];
      return act !== undefined ? act(action, currentState, previousHistory) : true;
    },
    clearHistoryType: ['@@project-load', '@@project-change-tab', '@@project-commit', '@@project-run-stc', '@@project-open'],
    limit: 50
  })
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const isDev = process.env.REACT_APP_ENVIRONMENT === 'Development';

  const store = configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middlewares),
    devTools: isDev,
    preloadedState: preloadedState
  });

  sagaMiddleware.run(sagas);

  return store;
}

export default configureDowncapStore();
export { configureDowncapStore as configureStore };
