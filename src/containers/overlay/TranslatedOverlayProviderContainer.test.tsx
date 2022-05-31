import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import TranslatedOverlayProviderCotainer from 'containers/overlay/TranslatedOverlayProviderCotainer';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';
import { cloneDeep } from 'lodash';
import { fireEvent } from '@testing-library/dom';

const unFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/unFocusedState.json')
const translatedFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/translatedFocusedState.json');
const unFocusedTranslatedEmptyState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/unFocusedTranslatedEmpty.json');
const translatedMultilineFocusedTranslatedEmptyState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/translatedMultilineFocusedTranslatedEmpty.json');
const translatedOverlayArrowkeyPushTestState = loadJson<downcapStore.RootState['present']>('./src/test/resources/OverlayProviderTestDummys/translatedOverlayArrowkeyPushTestState.json');

let container: HTMLDivElement | null = null;

function extractPresent(storeState: downcapStore.RootState['present']) {
  const store = configureStore({
    future: [],
    past: [],
    present: storeState
  });

  return store;
}

function overlayFocusUpdate(storeState: downcapStore.RootState['present'], focusLocation: { captionIndex: number, paragraphIndex: number, wordIndex: number, startIndex: number, endIndex: number }) {
  storeState.projectCotrol.focusParagraphMetas![0].path = {
    ...storeState.projectCotrol.focusParagraphMetas![0].path,
    captionIndex: focusLocation.captionIndex,
    paragraphIndex: focusLocation.paragraphIndex,
    wordIndex: focusLocation.wordIndex,
    selection: {
      start: focusLocation.startIndex,
      end: focusLocation.endIndex
    }
  }
}

function getLineByChangeDurationZero(storeState: downcapStore.RootState['present'], zeroDurationLineLocation: { captionIndex: number, paragraphIndex: number }) {
  let setTime: number
  const targetLine = storeState.translatedCaption.captions![zeroDurationLineLocation.captionIndex].paragraphs[zeroDurationLineLocation.paragraphIndex].lines.first();
  const zeroDurationLine = targetLine.words.map(word => {
    setTime = targetLine.words.first().start;

    return {
      ...word,
      start: setTime,
      end: setTime
    };
  });

  return zeroDurationLine;
}

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

it("TranslatedOverlayProviderContainer does not render when out of no focus.", () => {
  let store = configureStore(unFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

it("TranslatedOverlayProviderContainer rendering when translated focus.", () => {
  let store = configureStore(translatedFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  const children = (container!.querySelector('.cursor-default') as HTMLDivElement).children;
  let inputLabelArr = [];

  for (let index = 0; index < children.length; index++) {
    const inputLabel = (children[index] as HTMLDivElement).children[0] as HTMLInputElement;
    const inputLabelValue = inputLabel.value;
    inputLabelArr.push(inputLabelValue);
  }

  expect(inputLabelArr.join(' ')).toBe("Ah, everyone, you haven't opened your eyes yet.");
});

it("TranslatedOverlayProviderContainer does not render when out of no focus and empty translated caption.", () => {
  let store = configureStore(unFocusedTranslatedEmptyState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

it("TranslatedOverlayProviderContainer does not render when translated multiline focus and empty translated caption.", () => {
  let store = configureStore(translatedMultilineFocusedTranslatedEmptyState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

describe("put focus on the overlay and press ArrowUp key.", () => {
  it("When the progress time of the first paragraph of the caption is 0 seconds, focus on the second paragraph of the caption and press the ArrowUp key to move to the caption above", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });
    
    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.captionIndex! - 1).toEqual(arrowUpPath.captionIndex);
  });

  it("When the progress time of the first paragraph is more than 0 seconds, focus on the second paragraph and press the ArrowUp key to keep the caption intact, but the paragraph goes up", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.captionIndex).toEqual(arrowUpPath.captionIndex);
    expect(arrowUpBeforePath.paragraphIndex! - 1).toEqual(arrowUpPath.paragraphIndex);
  });

  it("When the progress time of the first caption is 0 seconds, pressing the ArrowUp key in the first parograph of the second caption does not change, and word moves to the first", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![0].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 0,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.captionIndex).toEqual(arrowUpPath.captionIndex);
    expect(arrowUpPath.wordIndex).toEqual(0);
  });

  it("When the last paragraph of caption has a duration of more than 0 seconds, focus on the first paragraph of the next caption and press the ArrowUp key to move caption up", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.captionIndex! - 1).toEqual(arrowUpPath.captionIndex);
  });

  it("When the progression time of the second paragraph of caption is 0 seconds, focus on the third paragraph and press the ArrowUp key to move to the first paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 0,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.paragraphIndex! - 2).toEqual(arrowUpPath.paragraphIndex);
  });

  it("When the three paragrams of the second caption are 0 seconds, focus on the first paragrams of the third caption and press the ArrowUp key to move to the first caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
    });

    translatedCloneStore.translatedCaption.captions![1].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![1].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 2,
      paragraphIndex: 0,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.captionIndex! - 2).toEqual(arrowUpPath.captionIndex);
  });
});

describe("put focus on the overlay and press ArrowLeft key.", () => {
  it("When the progress time of the first paragraph of caption is 0 seconds, focus on the first word of the second paragraph and press the ArrowLeft key to move to the previous caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.captionIndex! - 1).toEqual(arrowLeftPath.captionIndex);
    expect(arrowLeftPath.wordIndex).toEqual(-1);
    expect(arrowLeftPath.selection).toEqual({ start: 0, end: -1 });
  });

  it("When the progression time of the first paragraph of caption is not 0 seconds, focus on the first word of the second paragraph and press the ArrowLeft key to move to the first paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;
    const focusParagraphWordLength = store.getState().present.translatedCaption.captions![arrowLeftPath.captionIndex!].paragraphs[arrowLeftPath.paragraphIndex!].lines[0].words.length

    expect(arrowLeftBeforePath.captionIndex).toEqual(arrowLeftPath.captionIndex);
    expect(arrowLeftBeforePath.paragraphIndex! - 1).toEqual(arrowLeftPath.paragraphIndex);
    expect(arrowLeftPath.wordIndex).toEqual(focusParagraphWordLength - 1);
  });

  it("When the progression time of the first caption is 0 seconds, pressing the arrow key to the left of the first word of the second caption does not change and highlights the word", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![0].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 0,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.captionIndex).toEqual(arrowLeftPath.captionIndex);
    expect(arrowLeftBeforePath.wordIndex).toEqual(arrowLeftPath.wordIndex);
    expect(arrowLeftPath.selection?.end).toEqual(-1);
  });

  it("If the progression time of caption is more than 0 seconds, press the ArrowLeft key to the left of the first word in the next caption to move to the previous caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;
    const focusParagraphWordLength = store.getState().present.translatedCaption.captions![arrowLeftPath.captionIndex!].paragraphs[arrowLeftPath.paragraphIndex!].lines[0].words.length

    expect(arrowLeftBeforePath.captionIndex! - 1).toEqual(arrowLeftPath.captionIndex);
    expect(arrowLeftPath.wordIndex).toEqual(focusParagraphWordLength - 1);
  });

  it("When the first paragraph is not 0 seconds, and the second paragraph is 0 seconds, press the ArrowLeft at the left end of the first word of the third paragraph to go to the first paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.paragraphIndex! - 2).toEqual(arrowLeftPath.paragraphIndex);
    expect(arrowLeftPath.wordIndex).toEqual(-1);
  });

  it("When the duration of the first caption is not 0 seconds and the duration of three paragraphs of the second caption is 0 seconds, if you press the arrow key to the left of the first word of the third caption Go to the first caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![1].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 0,
    });

    translatedCloneStore.translatedCaption.captions![1].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![1].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 1,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 2,
      paragraphIndex: 0,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });


    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.captionIndex! - 2).toEqual(arrowLeftPath.captionIndex);
    expect(arrowLeftPath.wordIndex).toEqual(-1);
  });
});

describe("put focus on the overlay and press ArrowDown key.", () => {
  it("When the first paragraph of caption is not 0 seconds, but the next paragraphs are 0 seconds, press the ArrowDown key to move to the next caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);

    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);
    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.captionIndex! + 1).toEqual(arrowDownPath.captionIndex);
  });

  it("When the first paragraph and the second paragraph of caption are less than 0 seconds, press the ArrowDown key in the first paragraph to move to the second paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);
    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.captionIndex).toEqual(arrowDownPath.captionIndex);
    expect(arrowDownBeforePath.paragraphIndex! + 1).toEqual(arrowDownPath.paragraphIndex);
  });

  it("When caption was running for 0 seconds, press the ArrowDown key at the last paragraph of the second caption at the end, the caption does not move and the last word has the highlight", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![4].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 4,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.captionIndex).toEqual(arrowDownPath.captionIndex);
    expect(arrowDownPath.wordIndex).toEqual(-1);
  });

  it("When the progression time of the next caption is not 0 seconds, press the ArrowDown key at the last paragraph of the previous caption to move to the next caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.captionIndex! + 1).toEqual(arrowDownPath.captionIndex);
  });

  it("When the progression time of the second paragraph of caption is 0 seconds, pressing the ArrowDown key in the first paragraph moves to the third paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.paragraphIndex! + 2).toEqual(arrowDownPath.paragraphIndex);
  });

  it("When the length of the last caption is not 0 seconds and the length of 3 paragraphs of the second last caption is 0 seconds, press the down arrow key in last paragraph of the third caption to move to the last caption do", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 2,
      paragraphIndex: 0,
      wordIndex: 7,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(translatedCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[7].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.captionIndex! + 2).toEqual(arrowDownPath.captionIndex);
  });
});

describe("put focus on the overlay and press ArrowRight key.", () => {
  it("When the first paragraph of caption is not 0 seconds and the other paragraph is 0 seconds, press the ArrowRight key at the right end of the last word of the first caption to move to the next caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 2,
      endIndex: 2
    });

    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.captionIndex! + 1).toEqual(arrowRightPath.captionIndex);
    expect(arrowRightPath.wordIndex).toEqual(0);
  });

  it("When the progression time of the second paragraph of caption is not 0 seconds, press the ArrowRight key at the right end of the last word of the first paragraph to move to the second paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 2,
      endIndex: 2
    });

    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.captionIndex).toEqual(arrowRightPath.captionIndex);
    expect(arrowRightBeforePath.paragraphIndex! + 1).toEqual(arrowRightPath.paragraphIndex);
  });

  it("When the progression time of the last caption is 0 seconds, focus on the last word in the second caption from the end and press the ArrowRight key to get the highlight", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![4].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 4,
      paragraphIndex: 0,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 6,
      endIndex: 6
    });

    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.captionIndex).toEqual(arrowRightPath.captionIndex);
    expect(arrowRightPath.wordIndex).toEqual(-1);
  });

  it("When the progression time of the last caption is not 0 seconds, focus on the last word at the end of the second last caption and press the ArrowRight key to move to the last caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 6,
      endIndex: 6
    });

    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.captionIndex! + 1).toEqual(arrowRightPath.captionIndex);
    expect(arrowRightPath.wordIndex).toEqual(0);
  });

  it("When the second paragraph is 0 seconds and the third paragraph is not 0 seconds, pressing the ArrowRight key at the last word of the first paragraph moves to the third paragraph", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
      wordIndex: 2,
      startIndex: 2,
      endIndex: 2
    });

    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });


    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[2].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.paragraphIndex! + 2).toEqual(arrowRightPath.paragraphIndex);
  });

  it("If the last caption is not 0 seconds and the second last caption is 3 paragraphs 0 seconds, pressing the ArrowRight key in the last paragraph of the last third caption moves to the last caption", () => {
    const translatedCloneStore = cloneDeep(translatedOverlayArrowkeyPushTestState);
    translatedCloneStore.translatedCaption.captions![3].paragraphs[0].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 0,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[1].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 1,
    });

    translatedCloneStore.translatedCaption.captions![3].paragraphs[2].lines.first().words = getLineByChangeDurationZero(translatedCloneStore, {
      captionIndex: 3,
      paragraphIndex: 2,
    });

    overlayFocusUpdate(translatedCloneStore, {
      captionIndex: 2,
      paragraphIndex: 0,
      wordIndex: 7,
      startIndex: 4,
      endIndex: 4
    });
    
    let store = extractPresent(translatedCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ), container);
    });


    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[7].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.captionIndex! + 2).toEqual(arrowRightPath.captionIndex);
    expect(arrowRightPath.wordIndex).toEqual(0);
  });
});
