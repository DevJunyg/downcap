import * as downcapStore from 'storeV2';
import * as originCaptionActions from './originCaption';
import * as Redux from 'redux';
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';

const originInitialState = Object.freeze(loadJson<downcapStore.RootState['present']>(
  './src/test/resources/originCaption.test/initalState.json'
));

let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  store = configureStore({
    future: [],
    past: [],
    present: originInitialState
  });
})

afterEach(() => {
  store = null;
})

it("after run setWordStyle with style and path, the word style value of the path is changed to passed style.", () => {
  const style = {
    outlineColor: {
      r: 255,
      g: 0,
      b: 0,
      a: 0.12
    },
    bold: true,
    color: {
      r: 123,
      g: 255,
      b: 2,
      a: 1
    }
  }
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0,
    lineIndex: 0,
    captionIndex: 0,
    wordIndex: 0
  };

  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch);
  OriginCaptionActions.setWordStyle({ path, style });

  expect(store!.getState().present.originCaption.captions![0].lines[0].words[0].style).toEqual(style);
})

it("after run setDefaultStyle with style, the default style value is changed to passed style.", () => {
  const style = originInitialState.originCaption.captions![0].lines[0].style;
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0,
    captionIndex: 0,
    wordIndex: 0,
    lineIndex: 0
  };

  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch)
  OriginCaptionActions.setDefaultStyle({ path, style });

  expect(store!.getState().present.originCaption.defaultStyle).toEqual(style);
})

it("after run setDefaultLocation with location, origianCaption defaultLocation is changed to passed location", () => {
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0,
    captionIndex: 0,
    wordIndex: 0,
    lineIndex: 0
  };
  const location: downcapStore.ILocation = {
    vertical: 1,
    horizontal: 1
  };

  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch)
  OriginCaptionActions.setDefaultLocation({ path, location });

  const afterCaption = store!.getState().present.originCaption.captions![path.captionIndex!]
  expect(afterCaption.horizontal).toBeUndefined()
  expect(afterCaption.vertical).toBeUndefined()
  expect(store!.getState().present.originCaption.defaultLocation).toEqual(location);
})

it("after run setDefaultLocation with path and location, change defaultLocation to passed loaction and clear location of line of passed path", () => {
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0,
    captionIndex: 0,
    wordIndex: 0,
    lineIndex: 0
  };
  const location: downcapStore.ILocation = {
    vertical: 1,
    horizontal: 1
  };

  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch)
  OriginCaptionActions.setDefaultLocation({ path, location });

  const afterCaption = store!.getState().present.originCaption.captions![path.captionIndex!]
  expect(afterCaption.horizontal).toBeUndefined()
  expect(afterCaption.vertical).toBeUndefined()
  expect(store!.getState().present.originCaption.defaultLocation).toEqual(location);
})

it("after run clearDefaultStyle, originCaption defaultStyle is not exist", () => {
  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch)
  OriginCaptionActions.clearDefaultStyle();

  expect(store!.getState().present.originCaption.defaultStyle).toBeUndefined();
})

it("after run clearDefaultLocation, originCaption defaultLocation is not exist", () => {
  const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store!.dispatch)
  OriginCaptionActions.clearDefaultLocation();

  expect(store!.getState().present.originCaption.defaultLocation).toBeUndefined();
})