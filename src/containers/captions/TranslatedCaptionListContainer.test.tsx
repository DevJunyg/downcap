import "test/testPreload";
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import { render, unmountComponentAtNode } from 'react-dom';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';
import TranslatedCaptionListContainer from './TranslatedCaptionListContainer';
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import { loadJson } from "test/utility";
import { fireEvent, screen } from "@testing-library/dom";
import reduUndoCreatorActions from "storeV2/reduUndoCreatorActions";

const initialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedCaptionListContainer.test/initialState.json'
);

const topFocusState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedCaptionListContainer.test/topFocusState.json'
);

const bottomFocusState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedCaptionListContainer.test/bottomFocusState.json'
);

const firstLineFocusedState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedCaptionListContainer.test/firstLineFocusedState.json'
);

const captionLoadedState = loadJson<downcapStore.RootState>('./src/test/resources/TranslatedCaptionListContainer.test/captionLoadedState.json');

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
  jest.useRealTimers();
});

it("no control buttons when there is no focus.", () => {
  let store = configureStore({
    future: [],
    present: initialState,
    past: []
  });

  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedCaptionListContainer />
      </Provider>
    ), container);
  });

  const buttons = container!.querySelector('.subtitles-control-buttons');
  expect(buttons).toBeNull()
});

it("only one combine-button control in the top caption focus.", () => {
  let store = configureStore({
    future: [],
    present: topFocusState,
    past: []
  });
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedCaptionListContainer />
      </Provider>
    ), container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  const buttons = container!.querySelectorAll('.combine-button');
  expect(buttons.length).toBe(1);
});

it("only one combine-button control in the bottom caption focus.", () => {
  let store = configureStore({
    future: [],
    present: bottomFocusState,
    past: []
  });
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedCaptionListContainer />
      </Provider>
    ), container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  const buttons = container!.querySelectorAll('.combine-button');
  expect(buttons.length).toBe(1);
});

it("if playerHighlightMeta is a null object, return the focus object.", () => {
  const path = {
    lineIndex: 0,
    paragraphIndex: 1
  }

  const highlightMeta = undefined ?? path
  expect(highlightMeta).toEqual(path)
});

it("if playerHighlightMeta exist, return the playerHighlightMeta object.", () => {
  const path = {
    lineIndex: 0,
    paragraphIndex: 1
  }
  const currentTime = initialState.translatedCaption.captions!.first().paragraphs[path.paragraphIndex!].lines.first().words.first().start;
  const playHighlightMeta = TranslatedCaptionHelper.findCaptionIndexByTime(initialState.translatedCaption.captions!, currentTime)
  const highlightMeta = playHighlightMeta ?? path;

  expect(highlightMeta).toEqual(playHighlightMeta)
});

function setUpWithFirstLineFocused() {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  let store = configureStore({
    future: [],
    present: firstLineFocusedState,
    past: []
  });
  act(() => {
    render((
      <Provider store={store}>
        <TranslatedCaptionListContainer />
      </Provider>), container)
  });

  let index = 0;
  while (index++ < 5) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
  }

  return store;
}

function actKeyDown(focusedSubtitle: Element | null | undefined, code: string) {
  if (!container) return;

  act(() => {
    const keyDownEvent = new KeyboardEvent('keydown', {
      code: code,
      bubbles: true
    })
    focusedSubtitle!.dispatchEvent(keyDownEvent);
  });
}

function updateSubtitleVar() {
  let nextSubtitleList = container?.querySelectorAll('.subtitles');
  let nextFocusedSubtitle = container?.querySelector('.highlight-subtitle');
  return {
    subtitleList: nextSubtitleList,
    focusedSubtitle: nextFocusedSubtitle
  };
}

it('test arrow up and arrow down keyboard event works correctly', () => {
  let store = setUpWithFirstLineFocused();

  let subtitleList = container?.querySelectorAll('.subtitles');
  let focusedSubtitle = container?.querySelector('.highlight-subtitle');
  expect(focusedSubtitle === subtitleList![0]).toBe(true);

  actKeyDown(focusedSubtitle, 'ArrowDown');
  ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  expect(focusedSubtitle === subtitleList![1]).toBe(true);

  actKeyDown(focusedSubtitle, 'ArrowUp');
  ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  expect(focusedSubtitle === subtitleList![0]).toBe(true);
});


it('The line focus should not be defocused using the arrow up and arrow down keys.', () => {
  setUpWithFirstLineFocused();
  let subtitleList = container?.querySelectorAll('.subtitles');
  let focusedSubtitle = container?.querySelector('.highlight-subtitle');
  expect(focusedSubtitle).toEqual(subtitleList![0]);

  const length = subtitleList?.length ?? 0;
  for (let idx = 0; idx < length - 1; idx++) {
    actKeyDown(focusedSubtitle, 'ArrowDown');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  }
  expect(focusedSubtitle).toEqual(subtitleList![length - 1]);

  for (let idx = length; idx > 0; idx--) {
    actKeyDown(focusedSubtitle, 'ArrowUp');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  }
  expect(focusedSubtitle).toEqual(subtitleList![0]);
});


it('test line focus should not move out of the subtitle list with arrow up key and arrow down key', () => {
  let store = setUpWithFirstLineFocused();

  let subtitleList = container?.querySelectorAll('.subtitles');
  let focusedSubtitle = container?.querySelector('.highlight-subtitle');
  const listLen = subtitleList?.length ?? 0;
  expect(focusedSubtitle === subtitleList![0]).toBe(true);

  actKeyDown(focusedSubtitle, 'ArrowUp');
  ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  expect(focusedSubtitle === subtitleList![0]).toBe(true);

  for (let idx = 0; idx < listLen; idx++) {
    actKeyDown(focusedSubtitle, 'ArrowDown');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  }
  expect(focusedSubtitle === subtitleList![listLen - 1]).toBe(true);

  for (let idx = 0; idx < listLen; idx++) {
    actKeyDown(focusedSubtitle, 'ArrowUp');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
  }
  expect(focusedSubtitle === subtitleList![0]).toBe(true);
});

function setUpCaptionLoadedState() {
  let store = configureStore(captionLoadedState);
  act(() => {
    render((
      <Provider store={store}>
        <TranslatedCaptionListContainer />
      </Provider>
    ), container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  return store;
}

it('test topCombineButton should combine focused caption with target caption when clicked', () => {
  setUpCaptionLoadedState();

  let subtitleList = container?.querySelectorAll('.subtitles');
  fireEvent.click(subtitleList![2]);

  const originalSubtitleLen = subtitleList!.length;
  let topCombineButton = container?.querySelectorAll('.combine-button')[0];
  fireEvent.click(topCombineButton!);

  const changedSubtitleLen = container?.querySelectorAll('.subtitles').length;
  expect(changedSubtitleLen).toBe(originalSubtitleLen! - 1);
});

it('test bottomCombineButton should combine focused caption with target caption when clicked', () => {
  setUpCaptionLoadedState();

  let subtitleList = container?.querySelectorAll('.subtitles');
  fireEvent.click(subtitleList![2]);

  const originalSubtitleLen = subtitleList!.length;
  const bottomCombineButton = container?.querySelectorAll('.combine-button')[1];
  fireEvent.click(bottomCombineButton!);

  const changedSubtitleLen = container?.querySelectorAll('.subtitles').length;
  expect(changedSubtitleLen).toBe(originalSubtitleLen! - 1);
});

it('test _handleStartTimeTextBlur should work correctly when focused out', async () => {
  setUpWithFirstLineFocused();

  let timebox = await screen.findByTestId("timebox-start-input") as HTMLInputElement;

  fireEvent.change(timebox, { target: { value: '0.09' } });
  expect(timebox.value).toEqual('0.09');

  fireEvent.focusOut(timebox);
  expect(timebox.value).toEqual('00:00.090');
});

it('test _handleEndTimeTextBlur should work correctly when focused out', async () => {
  setUpWithFirstLineFocused();

  let timebox = await screen.findByTestId("timebox-end-input") as HTMLInputElement;

  fireEvent.change(timebox, { target: { value: '2.19' } });
  expect(timebox.value).toEqual('2.19');

  fireEvent.focusOut(timebox);
  expect(timebox.value).toEqual('00:02.190');
});

it('checks clicking a line should change a project control information and add the highlight class to the lien', () => {
  let store = setUpCaptionLoadedState();

  const originalFocus = store.getState().present.projectCotrol.focusParagraphMetas;
  const originalSubtitle = container?.querySelectorAll('.subtitles')[0];
  expect(originalFocus === undefined).toBe(true);
  expect(originalSubtitle?.classList.contains('highlight-subtitle')).toBe(false);

  fireEvent.click(originalSubtitle!);
  const focusedSubtitle = container?.querySelectorAll('.subtitles')[0];
  const changedFocus = store.getState().present.projectCotrol.focusParagraphMetas;
  expect(changedFocus === undefined).toBe(false);
  expect(focusedSubtitle?.classList.contains('highlight-subtitle')).toBe(true);
});

it('checks clicking a word should change a project control information', () => {
  let store = setUpCaptionLoadedState();

  const originalFocus = store.getState().present.projectCotrol.focusParagraphMetas;
  expect(originalFocus === undefined).toBe(true);

  let words = container?.querySelectorAll('.words-box');
  let targetWord = words![0];
  fireEvent.focus(targetWord);
  fireEvent.click(targetWord);

  const changedFocus = store.getState().present.projectCotrol.focusParagraphMetas;
  expect(changedFocus === undefined).toBe(false);
});

it('test captionRemoveButton works correctly', () => {
  let store = setUpWithFirstLineFocused();

  const originalLen = container?.querySelectorAll('.en-subtitles').length!;
  let captionRemoveButton = container?.querySelectorAll('.exit')[0]!;
  fireEvent.click(captionRemoveButton);

  const changedLen = container?.querySelectorAll('.en-subtitles').length;
  expect(changedLen).toBe(originalLen - 1);
});

it('test translatedCaptionRemoveButton works correctly', () => {
  let store = setUpWithFirstLineFocused();

  const originalLen = container?.querySelectorAll('.subtitles').length!;
  let translatedCaptionRemoveButton = container?.querySelectorAll('.exit')[0]!;
  fireEvent.click(translatedCaptionRemoveButton);

  const changedLen = container?.querySelectorAll('.subtitles').length;
  expect(changedLen).toBe(originalLen - 1);
});

it('test handleWordChange function works correctly', async () => {
  setUpWithFirstLineFocused();

  let inputs = await screen.findAllByTestId('caption-input');
  let input = inputs[0] as HTMLInputElement;

  fireEvent.click(input);
  fireEvent.change(input, { target: { value: 'change,체인지1' } });
  expect(input.value).toBe('change,체인지1');
});

it('test handleWordChange function works correctly', async () => {
  setUpWithFirstLineFocused();

  let removeButtons = await screen.findAllByTestId('line-remove-btn');
  let removeButton = removeButtons[0];

  const originalLen = container?.querySelectorAll('.subtitles').length!;

  fireEvent.click(removeButton);

  const changedLen = container?.querySelectorAll('.subtitles').length;
  expect(changedLen).toBe(originalLen - 1);
});

it('The translated caption can be undo at once before the split, after spliting caption.', async () => {
  const store = setUpWithFirstLineFocused();
  const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first();

  let textAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  let textArea = textAreas[0];
  const originValue = textArea.value;

  textArea.focus();
  textArea.setSelectionRange(5, 5);

  actKeyDown(textArea, 'Enter');
  expect(textAreas[0].value).toBe(originValue.slice(0, 5));
  expect(textAreas[1].value).toBe(originValue.slice(5, originValue.length));

  reduUndoCreatorActions(store.dispatch).undo();
  expect((await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[])[0].value).toBe(originValue);
  expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toStrictEqual(originParagraph);
});

it('The translated caption can be undo at once before the combine, after combining caption with delete key down.', async () => {
  const store = setUpWithFirstLineFocused();
  const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first();

  let textAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  let firstTextArea = textAreas[0];
  let secondTextArea = textAreas[1];
  const originFirstValue = firstTextArea.value;
  const originSecondValue = secondTextArea.value;

  firstTextArea.focus();
  firstTextArea.setSelectionRange(originFirstValue.length, originFirstValue.length);

  actKeyDown(firstTextArea, 'Delete');
  expect((await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[])[0].value)
    .toBe(originFirstValue.concat(' ', originSecondValue));

  reduUndoCreatorActions(store.dispatch).undo();
  
  let changedTextAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  expect(changedTextAreas[0].value).toBe(originFirstValue);
  expect(changedTextAreas[1].value).toBe(originSecondValue);
  expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toStrictEqual(originParagraph);
});

it('The translated caption can be undo at once before the combine, after combining caption with backspace key down.', async () => {
  const store = setUpWithFirstLineFocused();
  const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first();

  let textAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  let firstTextArea = textAreas[0];
  let secondTextArea = textAreas[1];
  const originFirstValue = firstTextArea.value;
  const originSecondValue = secondTextArea.value;

  secondTextArea.focus();
  secondTextArea.setSelectionRange(0, 0);

  actKeyDown(secondTextArea, 'Backspace');
  expect(textAreas[0].value).toBe(originFirstValue.concat(' ', originSecondValue));

  reduUndoCreatorActions(store.dispatch).undo();

  let changedTextAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  expect(changedTextAreas[0].value).toBe(originFirstValue);
  expect(changedTextAreas[1].value).toBe(originSecondValue);
  expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toStrictEqual(originParagraph);
});

it('The translated caption can be undo at once before the combine, after combining caption with click combine button.', async () => {
  const store = setUpWithFirstLineFocused();
  const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first();

  let textAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  let firstTextArea = textAreas[0];
  let secondTextArea = textAreas[1];
  const originFirstValue = firstTextArea.value;
  const originSecondValue = secondTextArea.value;

  firstTextArea.focus();
  const bottomCombineButton = container?.querySelectorAll('.subtitles-control-buttons .combine-button')[0] as HTMLButtonElement;
  
  fireEvent.click(bottomCombineButton);
  expect((await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[])[0].value)
    .toBe(originFirstValue.concat(' ', originSecondValue));

  reduUndoCreatorActions(store.dispatch).undo();

  let changedTextAreas = await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[];
  expect(changedTextAreas[0].value).toBe(originFirstValue);
  expect(changedTextAreas[1].value).toBe(originSecondValue);
  expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toStrictEqual(originParagraph);
});

it('The translated caption can be undo at once before the change origin text, after changing caption.', async () => {
  const store = setUpWithFirstLineFocused();
  const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first();

  let textArea = (await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[])[0];
  const originValue = textArea.value;

  textArea.focus();

  const inputEvent = new InputEvent("input", { bubbles: true });
  act(() => {
    fireEvent(textArea, inputEvent)
    Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    )!.set!.call(textArea, 'test');

    textArea.dispatchEvent(inputEvent);
  });

  expect(textArea.value).toBe('test');

  reduUndoCreatorActions(store.dispatch).undo();
  expect((await screen.findAllByTestId("test-id-auto-resize-textarea") as HTMLTextAreaElement[])[0].value).toBe(originValue);
  expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toStrictEqual(originParagraph);
});