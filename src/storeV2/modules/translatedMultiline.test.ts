import "test/testPreload";
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import reducer from "./multiline";
import * as Redux from 'redux';
import * as downcapStore from 'storeV2';
import * as translatedMultilineActions from './translatedMultiline';
import { ArgumentNullError, ArgumentUndefinedError } from 'errors';
import { configureStore } from 'storeV2/store';
import { loadJson } from 'test/utility';
import { cloneDeep } from 'lodash';

const translatedMultilineState = Object.freeze(loadJson<downcapStore.RootState['present']>(
  './src/test/resources/translatedMultiline.json'
));

let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  store = configureStore({
    past: [],
    present: translatedMultilineState,
    future: []
  });
})

afterEach(() => {
  store = null;
})

it("after reset action, defaultStyle and defaultLocation is null", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.reset();
  const { defaultStyle, defaultLocation, ...nextState } = store!.getState().present.translatedMultiline;

  expect(defaultStyle).toBeNull;
  expect(defaultLocation).toBeNull;
  expect(nextState).toBeTruthy();
})

it("checkpoint value is 0 when pass 0 to setCheckPoint", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setCheckPoint(0);

  expect(store!.getState().present.translatedMultiline.checkpoint).toBe(0)
})

it("pass caption what start time is 0.001 to updateCaptionById, set first caption to passed caption", () => {
  const firstCaption = cloneDeep(translatedMultilineState.translatedMultiline.captions![0]);
  firstCaption.lines.first().words.first().start = 0.01;

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.updateCaptionById(firstCaption);

  expect(store!.getState().present.translatedMultiline.captions?.first()).toEqual(firstCaption);
})

it("updateCaptionById return inital state when captionIndex < 0", () => {
  const firstCaption = translatedMultilineState.translatedMultiline.captions![0];
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);

  try {
    TranslatedMultilineActions.updateCaptionById(firstCaption);
  } catch (error) {
    expect(error!).toEqual(new ArgumentNullError('captions'));
  }
})

it("pass time and caption to setStartTime, set passed caption's startTime to passed time", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);

  TranslatedMultilineActions.setStartTime({ caption: translatedMultilineState.translatedMultiline.captions![0], time: 0 });
  expect(store!.getState().present.translatedMultiline.captions![0].lines.first().words.first().start).toBe(0);
})

it("pass time and caption to setEndTime, set passed caption's endTime to passed time", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);

  TranslatedMultilineActions.setEndTime({ caption: translatedMultilineState.translatedMultiline.captions![0], time: 10000 });
  expect(store!.getState().present.translatedMultiline.captions![0].lines.first().words.last().end).toBe(10000);
})

it("translatedmultiline action addCaption, ADD_CAPTION", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);

  TranslatedMultilineActions.addCaption(translatedMultilineState.translatedMultiline.captions![0]);
})

it("translatedmultiline action addCaption, captions is undefined", () => {
  const CaptionNotExistTranslatedMultilineState = cloneDeep(translatedMultilineState);
  delete CaptionNotExistTranslatedMultilineState.translatedMultiline.captions;
  const store = configureStore({
    past: [],
    present: CaptionNotExistTranslatedMultilineState,
    future: []
  });
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);

  TranslatedMultilineActions.addCaption(translatedMultilineState.translatedMultiline.captions![0]);
  expect(store.getState().present.translatedMultiline.captions![0]).toEqual(translatedMultilineState.translatedMultiline.captions![0]);
})

it("after setText action, first word text is test_dumyWord", () => {
  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);

  const path: Required<Omit<downcapStore.IIndexPath, 'captionIndex' | 'cursorIndex'>> = {
    paragraphIndex: 0,
    lineIndex: 0,
    wordIndex: 0
  }
  const testText = 'test_dumyWord';

  TranslatedMultilineActions.setText({ path, text: testText });
  expect(store!.getState().present.translatedMultiline.captions![0].lines![0].words[0].text).toEqual(testText);
})

it("getDefaultStyleState return inital state when style is null", () => {
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    lineIndex: 0,
    paragraphIndex: 0
  };

  const caption = TranslatedCaptionHelper.getDefaultStyleState(translatedMultilineState.translatedCaption, { path, style: null });

  expect(caption!).not.toBeNaN();
  expect(caption!).not.toBeUndefined();
});

it("return inital state when style is null", async () => {
  const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
    paragraphIndex: 0
  };

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setDefaultStyle({ path, style: null });

  expect(store!.getState().present.translatedMultiline.defaultStyle).toEqual(translatedMultilineState.translatedMultiline.defaultStyle);
})

describe("test setWordStyle", () => {
  it("path lineIndex undefined check, return inital state when lineIndex is undefined", () => {
    const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
    const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
      paragraphIndex: 0,
      wordIndex: 0
    };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
    TranslatedMultilineActions.setWordStyle({ path, style });

    expect(store!.getState().present.translatedMultiline).toEqual(translatedMultilineState.translatedMultiline);
  })

  it("path paragraphIndex undefined check, return inital state when paragraphIndex is undefined", () => {
    const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
    const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
      lineIndex: 0,
      wordIndex: 0
    };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
    TranslatedMultilineActions.setWordStyle({ path, style });
    expect(store!.getState().present.translatedMultiline).toEqual(translatedMultilineState.translatedMultiline);
  })

  it("path wordIndex undefined check, return inital state when wordIndex is undefined", () => {
    const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
    const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
      lineIndex: 0,
      paragraphIndex: 0
    };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
    TranslatedMultilineActions.setWordStyle({ path, style });
    expect(store!.getState().present.translatedMultiline).toEqual(translatedMultilineState.translatedMultiline);
  })

  it("correct path and style are given to setWordStyle, change word style value", () => {
    const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
    const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
      lineIndex: 0,
      paragraphIndex: 0,
      wordIndex: 0
    };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
    TranslatedMultilineActions.setWordStyle({ path, style });
    expect(store!.getState().present.translatedMultiline.captions![0].lines[0].style).toEqual(style);
  })
})

it("correct path and style are given to setLineStyle, change line style value", () => {
  const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    lineIndex: 0,
    paragraphIndex: 0
  };

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setLineStyle({ path, style });
  expect(store!.getState().present.translatedMultiline.captions![0].lines[0].style).toEqual(style);
})

it("return inital state when path.lineIndex is undefined", () => {
  const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    paragraphIndex: 0
  };

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setLineStyle({ path, style });
  expect(store!.getState()).toBeTruthy();
})

it("return inital state when path.paragraphIndex is undefined", () => {
  const style: downcapStore.ICaptionsStyle = translatedMultilineState.translatedMultiline.captions![0].lines[0].style!;
  const path: Omit<downcapStore.IIndexPath, "cursorIndex"> = {
    lineIndex: 0
  };

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setLineStyle({ path, style });
  expect(store!.getState()).toBeTruthy();
})

it("change the paragraph in path when pass paragraph and path to updateParagraph", () => {
  const path: Omit<downcapStore.IIndexPath, 'cursorIndex' | 'wordIndex' | 'lineIndex'> = {
    paragraphIndex: 0,
    captionIndex: 0
  }

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.updateParagraph({ path, paragraph: translatedMultilineState.translatedMultiline.captions![1] });

  expect(store!.getState().present.translatedMultiline.captions![0]).toEqual(translatedMultilineState.translatedMultiline.captions![1]);
})

describe("removeCaption", () => {
  it("pass testText, path to setText, set text which the passed path to testText", () => {
    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
    TranslatedMultilineActions.removeCaption(0);

    expect(store!.getState().present.translatedMultiline.captions![0].lines[0]).not.toEqual(translatedMultilineState.translatedMultiline.captions![0].lines[0]);
  })

  it("return inital state when captions is undefined", () => {
    const deletedCaptionTranslatedMultilineState = cloneDeep(translatedMultilineState);
    delete deletedCaptionTranslatedMultilineState.translatedMultiline.captions;
    const store = configureStore({
      past: [],
      present: deletedCaptionTranslatedMultilineState,
      future: []
    });

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    TranslatedMultilineActions.removeCaption(0);

    expect(store.getState()).toBeTruthy();
  })

  it("return inital state, when captions.length valuse is 0", () => {
    const deletedCaptionTranslatedMultilineState = cloneDeep(translatedMultilineState);
    deletedCaptionTranslatedMultilineState.translatedMultiline.captions = [];

    const store = configureStore({
      past: [],
      present: deletedCaptionTranslatedMultilineState,
      future: []
    });

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    TranslatedMultilineActions.removeCaption(0);

    expect(store.getState()).toBeTruthy();
  })
})

it("change the store caption to the with passed caption", () => {
  const changedCaptionState = cloneDeep(translatedMultilineState);
  changedCaptionState.translatedMultiline.captions![0].lines[0].words![0].text = changedCaptionState.translatedMultiline.captions![1].lines[0].words![0].text;

  const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store!.dispatch);
  TranslatedMultilineActions.setCaptions(changedCaptionState.translatedMultiline.captions!);

  expect(store!.getState().present.translatedMultiline.captions!).toEqual(changedCaptionState.translatedMultiline.captions!);
})

it("throw ArgumentNullError when setCatpions action with undefined", () => {
  try {
    reducer(translatedMultilineState.translatedMultiline, translatedMultilineActions.setCaptions(undefined!));
  } catch (error) {
    expect(error!).toEqual(new ArgumentUndefinedError('captions'));
  }
})

it("throw ArgumentNullError when setCatpions action with null", () => {
  try {
    reducer(translatedMultilineState.translatedMultiline, translatedMultilineActions.setCaptions(null!));
  } catch (error) {
    expect(error!).toEqual(new ArgumentNullError('captions'));
  }
})