const warnJestFn = jest.fn();
const warn = console.warn;
console.warn = (...args) => {
  warnJestFn(...args);
  warn(...args)
}
import "test/testPreload";
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import * as Redux from 'redux'
import { render, unmountComponentAtNode } from 'react-dom';
import { screen, fireEvent } from "@testing-library/react";
import { configureStore } from 'storeV2/store';
import OriginCaptionListContainer from "./OriginCaptionListContainer";
import * as downcapStore from 'storeV2';
import { loadJson } from "test/utility";
import LoggerFactoryHelper from "electron/logging/LoggerFactoryHelper";

const firstLineFocusedState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/OriginCaptionListContainer.test/firstLineFocusedState.json'
);

const captionLoadedState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/OriginCaptionListContainer.test/captionLoadedState.json'
);

function renderOriginCaptionListContainer(storeState: downcapStore.RootState['present']) {
  const store = configureStore({
    future: [],
    past: [],
    present: storeState
  });

  act(() => {
    render((
      <Provider store={store}>
        <OriginCaptionListContainer />
      </Provider>
    ), container);
  });

  let index = 0
  while (index++ < 5) {
    act(() => {
      jest.advanceTimersByTime(100);
    });
  }

  return store;
}

function renderOriginCaptionListContainerToCaptionLoadState() {
  return renderOriginCaptionListContainer(captionLoadedState);
}

function renderOriginCaptionListContainerToFirstLineFocusedState() {
  return renderOriginCaptionListContainer(firstLineFocusedState);
}

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof renderOriginCaptionListContainer> | null = null;

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

function fireKeydownEvent(focusedSubtitle: Element | null | undefined, code: string) {
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

describe('When the first line has focus', () => {
  beforeEach(() => {
    store = renderOriginCaptionListContainerToFirstLineFocusedState();
  });

  afterEach(() => {
    store = null;
  })

  test('FocusSubtitle movement with Arrow Up and Down', () => {
    let subtitleList = container?.querySelectorAll('.subtitles');
    let focusedSubtitle = container?.querySelector('.highlight-subtitle');
    expect(focusedSubtitle === subtitleList![0]).toBe(true);

    fireKeydownEvent(focusedSubtitle, 'ArrowDown');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
    expect(focusedSubtitle === subtitleList![1]).toBe(true);

    fireKeydownEvent(focusedSubtitle, 'ArrowUp');
    ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
    expect(focusedSubtitle === subtitleList![0]).toBe(true);
  });

  it('The line focus should not be defocused using the arrow up and arrow down keys.', () => {
    let subtitleList = container?.querySelectorAll('.subtitles');
    let focusedSubtitle = container?.querySelector('.highlight-subtitle');
    expect(focusedSubtitle).toEqual(subtitleList![0]);

    const length = subtitleList?.length ?? 0;
    for (let idx = 0; idx < length; idx++) {
      fireKeydownEvent(focusedSubtitle, 'ArrowDown');
      ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
    }
    expect(focusedSubtitle).toEqual(subtitleList![length - 1]);

    for (let idx = length; idx > 0; idx--) {
      fireKeydownEvent(focusedSubtitle, 'ArrowUp');
      ({ subtitleList, focusedSubtitle } = updateSubtitleVar());
    }
    expect(focusedSubtitle).toEqual(subtitleList![0]);
  });

  it('The line focus should not move out of the subtitle list with arrow up key and arrow down key', () => {
    let subtitleList = container?.querySelectorAll('.subtitles');
    let focusedSubtitle = container?.querySelector('.highlight-subtitle');
    const listLen = subtitleList?.length ?? 0;
    expect(focusedSubtitle === subtitleList![0]).toBe(true);

    fireEvent.keyDown(focusedSubtitle!, { code: 'ArrowUp' });
    subtitleList = container?.querySelectorAll('.subtitles');
    focusedSubtitle = container?.querySelector('.highlight-subtitle');
    expect(focusedSubtitle).toEqual(subtitleList![0]);

    for (let id = 0; id < listLen; id++) {
      fireEvent.keyDown(focusedSubtitle!, { code: 'ArrowDown' });
      subtitleList = container?.querySelectorAll('.subtitles');
      focusedSubtitle = container?.querySelector('.highlight-subtitle');
    }
    expect(focusedSubtitle).toEqual(subtitleList![listLen - 1]);
  });

  it('Clicking the remove button should remove the target caption from the list', () => {
    let subtitleList = container?.querySelectorAll('.subtitles');
    let focusedSubtitle = container?.querySelector('.highlight-subtitle');
    let removeButton = focusedSubtitle?.querySelector('.exit') as HTMLElement;
    const originalLen = subtitleList?.length;

    fireEvent.click(removeButton);

    ({ subtitleList } = updateSubtitleVar());
    const changedLen = subtitleList?.length;

    expect(changedLen).toEqual(originalLen! - 1);
  });

  test("The start timebox's value change", async () => {
    let timebox = await screen.findByTestId("timebox-start-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    expect(timebox.value).toEqual('1');

    fireEvent.focusOut(timebox);
    expect(timebox.value).toEqual('00:01.000');
  });

  test("The end timebox's value change", async () => {
    let timebox = await screen.findByTestId("timebox-end-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1.8' } });
    expect(timebox.value).toEqual('1.8');

    fireEvent.focusOut(timebox);
    expect(timebox.value).toEqual('00:01.800');
  });
});

describe('When the caption load state', () => {
  beforeEach(() => {
    store = renderOriginCaptionListContainerToCaptionLoadState();
  });

  afterEach(() => {
    store = null;
  });

  it('TopCombineButton should combine focused caption with target caption when clicked', () => {
    const targetSubtitle = container?.querySelectorAll('.subtitles')[1]!;
    fireEvent.click(targetSubtitle);

    const originalSubtitleLen = store?.getState().present.originCaption.captions?.length;
    const topCombineButton = container?.querySelectorAll('.combine-button')[0] as HTMLElement;
    fireEvent.click(topCombineButton);

    const changedSubtitleLen = store?.getState().present.originCaption.captions?.length;
    expect(changedSubtitleLen).toBe(originalSubtitleLen! - 1);
  });

  it('BottomCombineButton should combine focused caption with target caption when clicked', () => {
    const targetSubtitle = container?.querySelectorAll('.subtitles')[1]!;
    fireEvent.click(targetSubtitle);

    const originalSubtitleLen = store?.getState().present.originCaption.captions?.length;
    const bottomCombineButton = container?.querySelectorAll('.combine-button')[1]!;
    fireEvent.click(bottomCombineButton);

    const changedSubtitleLen = store?.getState().present.originCaption.captions?.length;
    expect(changedSubtitleLen).toBe(originalSubtitleLen! - 1);
  });

  it('Clicking a line should change focusParagraphMetas in projectControl', () => {
    const originalFocus = store!.getState().present.projectCotrol.focusParagraphMetas;

    expect(originalFocus).toEqual(undefined);

    let firstSubtitle = container?.querySelector('.subtitles') as HTMLElement;

    act(() => {
      firstSubtitle.click();
    });

    const changedFocus = store!.getState().present.projectCotrol.focusParagraphMetas![0];
    const expectedValue = {
      path: { lineIndex: 0, paragraphIndex: 0 },
      source: 'list',
      type: 'originCaption'
    }
    expect(changedFocus).toEqual(expectedValue);
  });

  it('Change the text, the text in the store is also changed', () => {
    const firstSubtitle = container?.querySelectorAll('.subtitles')[0];
    const targetWord = firstSubtitle?.querySelectorAll('.input-label')[0].firstChild;

    fireEvent.change(targetWord!, { target: { value: '이건 바뀐 글자예요' } });
    const changedText = store!.getState().present.originCaption.captions![0].lines[0].words[0].text;
    expect(changedText).toEqual('이건 바뀐 글자예요');
  });

  it('When clicking on the input of the subtitles, the focusParagraphMetas will change to the index of the selected input', () => {
    const originalFocusParagraphMeta = store!.getState().present.projectCotrol.focusParagraphMetas;
    expect(originalFocusParagraphMeta).toEqual(undefined);

    const firstSubtitle = container?.querySelectorAll('.subtitles')[0];
    const targetWord = firstSubtitle?.querySelectorAll('.input-label')[0].firstChild;

    fireEvent.click(targetWord!);
    const changedFocusParagraphMeta = store!.getState().present.projectCotrol.focusParagraphMetas;
    const paragraphIndex = changedFocusParagraphMeta![0].path.paragraphIndex;
    const lineIndex = changedFocusParagraphMeta![0].path.lineIndex;
    const wordIndex = changedFocusParagraphMeta![0].path.wordIndex;

    expect(paragraphIndex).toEqual(0);
    expect(lineIndex).toEqual(0);
    expect(wordIndex).toEqual(0);
  });

  it('ArrowUp after clicking, focusParagraphMeta will change.', () => {
    let targetWord = container?.querySelectorAll('.subtitles')![1].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.click(targetWord);
    const originalPath = store!.getState().present.projectCotrol.focusParagraphMetas![0].path;

    targetWord = container?.querySelectorAll('.subtitles')![1].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(targetWord, { code: 'ArrowUp' });
    const changedPath = store!.getState().present.projectCotrol.focusParagraphMetas![0].path;
    expect(originalPath.paragraphIndex).not.toEqual(changedPath.paragraphIndex);
  });

  it('ArrowDown after clicking, focusParagraphMeta will change.', () => {
    let targetWord = container?.querySelectorAll('.subtitles')![1].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.click(targetWord);
    const originalPath = store!.getState().present.projectCotrol.focusParagraphMetas![0].path;
    targetWord = container?.querySelectorAll('.subtitles')![1].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(targetWord, { code: 'ArrowDown' });
    const changedPath = store!.getState().present.projectCotrol.focusParagraphMetas![0].path;
    expect(originalPath.paragraphIndex === changedPath.paragraphIndex).toBe(false);
  });

  it('Checks clicking a line should change a project control information and add the highlight class to the lien', () => {
    const originalFocus = store!.getState().present.projectCotrol.focusParagraphMetas;
    const originalSubtitle = container?.querySelectorAll('.subtitles')[0];
    expect(originalFocus).toBeUndefined();
    expect(originalSubtitle?.classList.contains('highlight-subtitle')).toBe(false);

    fireEvent.click(originalSubtitle!);
    const focusedSubtitle = container?.querySelectorAll('.subtitles')[0];
    const changedFocus = store!.getState().present.projectCotrol.focusParagraphMetas;
    expect(changedFocus).not.toBeUndefined();
    expect(focusedSubtitle?.classList.contains('highlight-subtitle')).toBe(true);
  });

  it('checks whether arrow down key event should keep the selected edit type', () => {
    const targetWord = container?.querySelector('.input-label')?.firstChild!;
    fireEvent.click(targetWord);
    fireEvent.keyDown(targetWord, { code: 'ArrowDown' });

    const selectedEditType = store?.getState().present.projectCotrol.selectedStyleEditType;
    expect(selectedEditType).toBe('word');
  });

  it('checks selected edit type should change properly according to user events', () => {
    const targetWord = container?.querySelector('.input-label')?.firstChild!;
    fireEvent.click(targetWord);
    let selectedEditType = store?.getState().present.projectCotrol.selectedStyleEditType;
    expect(selectedEditType).toBe('word');

    const subtitle = container?.querySelector('.subtitles')!;
    fireEvent.click(subtitle);
    selectedEditType = store?.getState().present.projectCotrol.selectedStyleEditType;
    expect(selectedEditType).toBe('line');
  });

  it('checks delete key down on last selection in last word should not works', async () => {
    warnJestFn.mockReset();
    let words: HTMLInputElement[] = await screen.findAllByTestId('caption-input');
    let lastWordElement: HTMLInputElement = words[words.length - 1];

    fireEvent.focus(lastWordElement);
    lastWordElement.selectionStart = -1;

    lastWordElement.selectionEnd = -1;
    fireEvent.keyDown(lastWordElement, { code: 'Delete' });
    expect(warnJestFn).toBeCalledTimes(0);
  });
});

it('checks keydown event for word should not propagate', () => {
  const store = configureStore({
    future: [],
    past: [],
    present: captionLoadedState
  });
  const handleClick = jest.fn();

  act(() => {
    render((
      <Provider store={store}>
        <div onClick={handleClick}>
          <OriginCaptionListContainer />
        </div>
      </Provider>
    ), container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  const targetWord = container?.querySelector('.input-label')?.firstChild!;
  fireEvent.click(targetWord);
  fireEvent.keyDown(targetWord, { code: 'ArrowDown' });

  expect(handleClick).toBeCalledTimes(0);
});