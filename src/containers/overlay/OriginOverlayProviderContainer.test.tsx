import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import OriginOverlayProviderCotainer from 'containers/overlay/OriginOverlayProviderContainer';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';
import { fireEvent } from '@testing-library/dom';
import { cloneDeep } from 'lodash';

const unFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/unFocusedState.json');
const originFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/originFocusedState.json');
const unFocusedOriginEmptyState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/unFocusedOriginEmpty.json');
const multilineFocusedOriginEmptyState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/multilineFocusedOriginEmpty.json');
const originOverlayArrowkeyPushTestState = loadJson<downcapStore.RootState['present']>('./src/test/resources/OverlayProviderTestDummys/originOverlayArrowkeyPushTestState.json');

let container: HTMLDivElement | null = null;

function extractPresent(storeState: downcapStore.RootState['present']) {
  const store = configureStore({
    future: [],
    past: [],
    present: storeState
  });

  return store;
}

function overlayFocusUpdate(storeState: downcapStore.RootState['present'], focusLocation:{paragraphIndex: number, wordIndex: number, startIndex: number, endIndex: number}) {
  storeState.projectCotrol.focusParagraphMetas![0].path = {
    ...storeState.projectCotrol.focusParagraphMetas![0].path,
    paragraphIndex: focusLocation.paragraphIndex,
    wordIndex: focusLocation.wordIndex,
    selection: {
      start: focusLocation.startIndex,
      end: focusLocation.endIndex
    }
  }
}

function getLineByChangeDurationZero(storeState: downcapStore.RootState['present'], paragraphIndex: number) {
  let setTime: number
  const targetLine = storeState.originCaption.captions![paragraphIndex].lines.first();
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
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it("OriginOverlayProviderContainer does not render when out of no focus.", () => {
  let store = configureStore(unFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <OriginOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

it("OriginOverlayProviderContainer rendering when origin focus.", () => {
  let store = configureStore(originFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <OriginOverlayProviderCotainer />
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

  expect(inputLabelArr.join(' ')).toBe('아 아 여러분 아직 눈을 못 들어가셨구나');
});

it("OriginOverlayProviderContainer does not render when out of no focus and empty origin caption.", () => {
  let store = configureStore(unFocusedOriginEmptyState);
  act(() => {
    render((
      <Provider store={store!}>
        <OriginOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

it("OriginOverlayProviderContainer does not render when multiline focus and empty origin caption.", () => {
  let store = configureStore(multilineFocusedOriginEmptyState);
  act(() => {
    render((
      <Provider store={store!}>
        <OriginOverlayProviderCotainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.input-label') as HTMLDivElement).toBe(null);
});

describe("press ArrowUp on the overlay", () => {
  it("Focus on the second paragraph whose duration is not 0 seconds, and if the duration of the first paragraph is not 0 seconds, press the ArrowUp key to move to the first paragraph", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 1,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);
    
    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });
    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.paragraphIndex! - 1).toEqual(arrowUpPath.paragraphIndex);
  });

  it("If the duration of the third paragraph is not 0 seconds, the duration of the second paragraph is 0 seconds, and the duration of the first paragraph is non-zero, focus on the third paragraph, ArrowUp Press the key to go to the first paragraph.", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![1].lines.first().words = getLineByChangeDurationZero(originCloneStore, 1);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 2,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });
    
    let store = extractPresent(originCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.paragraphIndex! - 2).toEqual(arrowUpPath.paragraphIndex);
  });

  it("When the duration of the second paragraph is not 0 seconds and the duration of the first paragraph is 0 seconds, focus on the second paragraph and don't press the ArrowUp key to move the paragraph, and first Word highlight", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![0].lines.first().words = getLineByChangeDurationZero(originCloneStore, 0);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 1,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowUpBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowUp' });

    const arrowUpPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowUpBeforePath.paragraphIndex!).toEqual(arrowUpPath.paragraphIndex);
    expect(arrowUpPath.wordIndex).toEqual(0);
  });
});

describe("press ArrowDown on the overlay", () => {
  it("If you press the ArrowDown key at the last paragraph, the highlight moves to the last word of the paragraph", () =>{
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 4,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });
    
    let store = extractPresent(originCloneStore);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownPath.wordIndex).toEqual(-1);
  });

  it("When the duration of the third paragraph is not 0 seconds and the duration time of the second paragraph is not 0 seconds, focus on the second paragraph and press the ArrowDown key to move to the third paragraph", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 1,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.paragraphIndex! + 1).toEqual(arrowDownPath.paragraphIndex);
  });

  it("If the first and third paragraphs don't have a duration of 0 seconds and the second paragraph has a duration of 0 seconds, focus on the first paragraph and press the ArrowDown key to move to the third paragraph", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![1].lines.first().words = getLineByChangeDurationZero(originCloneStore, 1);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 0,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });
    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.paragraphIndex! + 2).toEqual(arrowDownPath.paragraphIndex);
  });

  it("When the duration of the last paragraph is 0 seconds, pressing the ArrowDown key on the previous paragraph moves the highlight to the last word of that paragraph", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![4].lines.first().words = getLineByChangeDurationZero(originCloneStore, 4);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 3,
      wordIndex: 1,
      startIndex: 0,
      endIndex: 0
    });
    
    let store = extractPresent(originCloneStore);
    const arrowDownBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[1].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowDown' });

    const arrowDownPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowDownBeforePath.paragraphIndex).toEqual(arrowDownPath.paragraphIndex);
    expect(arrowDownPath.wordIndex).toEqual(-1);
  });
});

describe("press ArrowLeft on the overlay", () => {
  it("When the duration of the third and fourth paragraphs is not 0 seconds focus on the first word of the fourth paragraph and move to the third paragraph by pressing the ArrowLeft key", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 3,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.paragraphIndex! - 1).toEqual(arrowLeftPath.paragraphIndex);
  });

  it("When the duration of the first and third paragraph is not 0 seconds, and the duration of the second paragraph is 0 seconds, if focus on the first word of the third paragraph and press the ArrowLeft key, jump to the last word of the first paragraph.", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![1].lines.first().words = getLineByChangeDurationZero(originCloneStore, 1);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 2,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.paragraphIndex! - 2).toEqual(arrowLeftPath.paragraphIndex);

  });

  it("When the duration of the second paragraph is not 0 seconds and the duration of the first paragraph is 0 seconds, focus on the first word of the second paragraph and press the ArrowLeft key, to the paragraph do not move", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![0].lines.first().words = getLineByChangeDurationZero(originCloneStore, 0);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 1,
      wordIndex: 0,
      startIndex: 0,
      endIndex: 0
    });

    let store = extractPresent(originCloneStore);
    const arrowLeftBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[0].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowLeft' });

    const arrowLeftPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowLeftBeforePath.paragraphIndex!).toEqual(arrowLeftPath.paragraphIndex);
    expect(arrowLeftPath.selection!.end).toEqual(-1);
  });
});

describe("press ArrowRight on the overlay", () => {
  it("When the duration of the third and fourth paragraphs is not 0 seconds, focus on the last word of the third paragraph and press the ArrowRiht key to move to the first word of the fourth paragraph", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 2,
      wordIndex: 4,
      startIndex: 3,
      endIndex: 3
    });

    let store = extractPresent(originCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[4].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.paragraphIndex! + 1).toEqual(arrowRightPath.paragraphIndex);
  });

  it("When the duration of the 3rd and 5th paragraphs is not 0 seconds, and the duration of the 4th paragraph is 0 seconds, focus on the last word of the 3rd paragraph and press the ArrowRiht key to Go to the first word of the 5th paragraph.", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![3].lines.first().words = getLineByChangeDurationZero(originCloneStore, 3);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 2,
      wordIndex: 4,
      startIndex: 3,
      endIndex: 3
    });

    let store = extractPresent(originCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[4].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.paragraphIndex! + 2).toEqual(arrowRightPath.paragraphIndex);
  });

  it("When the advance time of the last paragraph is 0 seconds and the advance time of the last previous paragraph is not 0 seconds, focus on the last word of the last previous paragraph and press the ArrowRight key does not change paragraph.", () => {
    const originCloneStore = cloneDeep(originOverlayArrowkeyPushTestState);
    originCloneStore.originCaption.captions![4].lines.first().words = getLineByChangeDurationZero(originCloneStore, 4);

    overlayFocusUpdate(originCloneStore, {
      paragraphIndex: 3,
      wordIndex: 7,
      startIndex: 4,
      endIndex: 4
    });

    let store = extractPresent(originCloneStore);
    const arrowRightBeforePath = cloneDeep(store.getState().present.projectCotrol.focusParagraphMetas![0].path);

    act(() => {
      render((
        <Provider store={store!}>
          <OriginOverlayProviderCotainer />
        </Provider>
      ), container);
    });

    const children = container!.querySelectorAll('.caption-ovleray')![0].querySelectorAll('.cursor-default')[0].querySelectorAll('.input-label')[7].querySelector('input') as HTMLInputElement;

    fireEvent.keyDown(children, { code: 'ArrowRight' });

    const arrowRightPath = store.getState().present.projectCotrol.focusParagraphMetas![0].path;

    expect(arrowRightBeforePath.paragraphIndex!).toEqual(arrowRightPath.paragraphIndex);
    expect(arrowRightPath.wordIndex).toEqual(-1);
    expect(arrowRightPath.selection!.end).toEqual(-1);
  });
});