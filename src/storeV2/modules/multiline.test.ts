import reducer from "./multiline";
import * as downcapStore from 'storeV2';
import * as multilineActions from './multiline';
import * as Redux from 'redux';
import { configureStore } from 'storeV2/store';
import { loadJson } from 'test/utility';

const multilineState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/multiline.json'
);

it("Set the style of the word in the path value to the set style value by setWordStyle action", async () => {
  const style = { ...multilineState.multiline.captions![0].lines[0].style };
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0,
    lineIndex: 0,
    captionIndex: 0,
    wordIndex: 0
  }
  const store = configureStore({
    future: [],
    past: [],
    present: multilineState
  });
  const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);

  MultilineActions.setWordStyle({ path, style });

  expect(store.getState().present.multiline.captions![0].lines[0].words[0].style).toEqual(style);
})

it("set the default style and default loaction by setDefaultStyle action", async () => {
  const style = { ...multilineState.multiline.captions![0].lines[0].style };
  const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
    paragraphIndex: 0
  }

  const state = reducer(multilineState.multiline, multilineActions.setDefaultStyle({ path, style }));

  expect(state.defaultStyle).toEqual(style);
})

it("set the default style and default loaction by setDefaultStyle action", async () => {
  const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
    paragraphIndex: 0
  }
  const location: downcapStore.ILocation = {
    vertical: 0.5,
    horizontal: 0.5
  }

  const state = reducer(multilineState.multiline, multilineActions.setDefaultLocation({ path, location }));

  expect(state.defaultLocation).toEqual(location);
})

it("after run clearDefaultStyle, multiline defaultStyle is not exist", async () => {
  const state = reducer(multilineState.multiline, multilineActions.clearDefaultStyle());
  const { defaultStyle, ...nextState } = state;

  expect(defaultStyle).toBeNull;
  expect(nextState).toBeTruthy();
})

it("after run clearDefaultLocation, multiline defaultLoaction is not exist", async () => {
  const state = reducer(multilineState.multiline, multilineActions.clearDefaultLocation());
  const { defaultLocation, ...nextState } = state;

  expect(defaultLocation).toBeNull;
  expect(nextState).toBeTruthy();
})