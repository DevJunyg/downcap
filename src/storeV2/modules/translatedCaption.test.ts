import * as downcapStore from 'storeV2';
import * as translatedCaptionActions from './translatedCaption';
import { configureStore } from 'storeV2/store';
import * as Redux from 'redux';
import { loadJson } from 'test/utility';

const translatedCaptionState = Object.freeze(loadJson<downcapStore.RootState['present']>('./src/test/resources/TranslatedCaptionListContainer.test/initialState.json'));

it("after run clearDefaultStyle, translatedCaption defaultStyle is not exist", () => {
  const store = configureStore({
    past: [],
    present: translatedCaptionState,
    future: []
  });
  const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
  TranslatedCaptionActions.clearDefaultStyle();
  const { defaultStyle, ...nextState } = store.getState().present.translatedCaption;

  expect(defaultStyle).toBeUndefined();
  expect(nextState).toBeTruthy();
})

it("after run clearDefaultLocation, translatedCaption defaultLocation is not exist", () => {
  const store = configureStore({
    past: [],
    present: translatedCaptionState,
    future: []
  });
  const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
  TranslatedCaptionActions.clearDefaultLocation();
  const { defaultLocation, ...nextState } = store.getState().present.translatedCaption;

  expect(defaultLocation).toBeUndefined();
  expect(nextState).toBeTruthy();
})