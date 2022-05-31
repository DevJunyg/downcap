import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import { render, unmountComponentAtNode } from 'react-dom';
import * as downcapStore from 'storeV2';
import WordSplitContainer from "./WordSplitContainer";
import { fireEvent } from "@testing-library/dom";
import { loadJson } from "test/utility";
import { configureStore } from 'storeV2/store';
import reduUndoCreatorActions from "storeV2/reduUndoCreatorActions";
import IpcSender from 'lib/IpcSender';

const wordSplitValue20 = loadJson<downcapStore.RootState['present']>('./src/test/resources/WordSplitContainer.test/wordSplit_origin_value20.json');
const wordSplitValue25 = loadJson<downcapStore.RootState['present']>('./src/test/resources/WordSplitContainer.test/wordSplit_origin_value20.json');
const wordSplitInTranslatedValue40 = loadJson<downcapStore.RootState['present']>('./src/test/resources/WordSplitContainer.test/wordSplit_translated_value40.json');
const wordSplitIndual = loadJson<downcapStore.RootState['present']>('./src/test/resources/WordSplitContainer.test/wordSplit_dual.json');

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container?.remove();
  container = null;
  jest.useRealTimers();
});

function actInputEvent(element: Element | null | undefined, value: number) {
  if (!container || !element) return;

  const inputEvent = new InputEvent("input", { bubbles: true });
  act(() => {
    fireEvent(element, inputEvent)
    const splitValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )!.set!;

    splitValueSetter.call(element, value);

    element.dispatchEvent(inputEvent);
  });
}

describe('Input value change test', () => {
  it("Change the number of letters from 20 to 25 in origin", () => {
    const originWordSplitValue20 = configureStore({
      future: [],
      past: [],
      present: wordSplitValue20
    });
    let store = originWordSplitValue20;
    act(() => {
      render((
        <Provider store={store!}>
          <WordSplitContainer />
        </Provider>
      ), container);
    });

    expect(container).not.toBeNull();

    let wordSplitNumber = container!.querySelector('.word-split-number') as HTMLInputElement;
    actInputEvent(wordSplitNumber, 25);

    const afterWordSplit = container!.querySelector('.word-split-number')?.getAttribute("value");
    expect(afterWordSplit).toEqual("25");
  });

  it("split value can be undo at once to the state before the change, after spliting word.", async () => {
    let store = configureStore({
      future: [],
      past: [],
      present: wordSplitInTranslatedValue40
    });

    act(() => {
      render((
        <Provider store={store!}>
          <WordSplitContainer />
        </Provider>
      ), container);
    });

    const originTranslatedCaption = store.getState().present.translatedCaption.captions;
    const originTranslatedSplitValue = store.getState().present.project.wordSplits.translated;

    actInputEvent(container!.querySelector('.word-split-number'), 10);
    expect(store.getState().present.project.wordSplits.translated).toBe(10);
    expect(store.getState().present.translatedCaption.captions).not.toBe(originTranslatedCaption);

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.project.wordSplits.translated).toBe(originTranslatedSplitValue);
    expect(store.getState().present.translatedCaption.captions).toBe(originTranslatedCaption);
  });
});

describe('Click the increase the number of letters button', () => {
  const originWordSplitValue25 = configureStore({
    future: [],
    past: [],
    present: wordSplitValue25
  });

  const translatedWordSplitValue40 = configureStore({
    future: [],
    past: [],
    present: wordSplitInTranslatedValue40
  });
  
  const dualWordSplit = configureStore({
    future: [],
    past: [],
    present: wordSplitIndual
  });

  it("Click the button to increase the number of letters in Origin", () => {
    let store = originWordSplitValue25;

    act(() => {
      render((
        <Provider store={store!}>
          <WordSplitContainer />
        </Provider>
      ), container);
    });

    let wordSplitNumber = container!.querySelector('.word-split-number') as HTMLInputElement;

    act(() => {
      const upButton = container!.querySelector('.test-updown-buttons-box') as HTMLDivElement;
      fireEvent.click(upButton.children[0].children[0] as HTMLDivElement);
    });

    expect(wordSplitNumber.value).toEqual("21");
  });

  it("Click the button to increase the number of letters in translated", () => {
    let store = translatedWordSplitValue40;

    act(() => {
      render((
        <Provider store={store!}>
          <WordSplitContainer />
        </Provider>
      ), container);
    });

    let wordSplitNumber = container!.querySelector('.word-split-number') as HTMLInputElement;

    act(() => {
      const upButton = container!.querySelector('.test-updown-buttons-box') as HTMLDivElement;
      fireEvent.click(upButton.children[0].children[0] as HTMLDivElement);
    });

    expect(wordSplitNumber.value).toEqual("41");
  });

  it("In dual subtitles edit tab, the value will not change.", () => {
    let store = dualWordSplit;

    act(() => {
      render((
        <Provider store={store!}>
          <WordSplitContainer />
        </Provider>
      ), container);
    });

    let wordSplitNumber = container!.querySelector('.word-split-number') as HTMLInputElement;
    act(() => {
      const upButton = container!.querySelector('.test-updown-buttons-box') as HTMLDivElement;
      fireEvent.click(upButton.children[0].children[0] as HTMLDivElement);
    });

    expect(wordSplitNumber.value).not.toEqual(wordSplitNumber.value + 1);
  });

});