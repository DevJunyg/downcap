import "test/testPreload";
import { render, unmountComponentAtNode } from "react-dom";
import TranslatedMultilineListContainer from "./TranslatedMultilineListContainer"
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import * as downcapStore from 'storeV2';
import { fireEvent } from "@testing-library/dom";
import { configureStore } from "storeV2/store";
import { loadJson } from "test/utility";

const noneFocusedTranslatedState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedMultilineListContainer.text/noneFocuseTranslatedMultiline.json'
);

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  store = configureStore({
    past: [],
    present: noneFocusedTranslatedState,
    future: []
  })
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;

  store = null;
});

it('line is click, the value corresponding to the line index is save in focusParagraphMetas of the store.', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <TranslatedMultilineListContainer />
        </Provider>
      ),
      container
    );
  });

  const multilines = container!.querySelectorAll('.subtitles');

  for (let index = 0; index < multilines.length; index++) {
    const element = multilines[index].children[1].children[0];

    fireEvent(
      element,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.paragraphIndex).toBe(index);
  }
  expect(store!.getState().present.projectCotrol.selectedStyleEditType).toBe('line')
})


it('word is click, the value corresponding to the line and word index is save in focusParagraphMetas of the store.', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <TranslatedMultilineListContainer />
        </Provider>
      ),
      container
    );
  });

  const multilines = container!.querySelectorAll('.subtitles');

  for (let index = 0; index < multilines.length; index++) {
    const element = multilines[index].children[1].children[0];
    for (let wordIndex = 0; wordIndex < element.children.length; wordIndex++) {
      const word = element.children[wordIndex];

      fireEvent(
        word,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )

      expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.wordIndex).toBe(wordIndex);
    }
  }
  expect(store!.getState().present.projectCotrol.selectedStyleEditType).toBe('word')
})