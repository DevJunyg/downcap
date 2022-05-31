import "test/testPreload";
import * as downcapStore from 'storeV2';
import { render, unmountComponentAtNode } from "react-dom";
import MultilineListContainer from "./MultilineListContainer"
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { fireEvent } from "@testing-library/dom";
import { configureStore } from "storeV2/store";
import { loadJson } from "test/utility";


const multilineState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/multiline.json'
);

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  store = configureStore({
    past: [],
    present: multilineState,
    future: []
  })
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;

  store = null;
});

it('multilineListContainer', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <MultilineListContainer />
        </Provider>
      ),
      container
    );
  });

  const multilines = container!.querySelectorAll('.subtitles');
  expect(multilines?.length).toBe(4);
})

it('multilineListContainer, test line click event', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <MultilineListContainer />
        </Provider>
      ),
      container
    );
  });

  const multilines = container!.querySelectorAll('.subtitles');

  for (let index = 0; index < multilines.length; index++) {
    const element = multilines[index];
    
    fireEvent(
      element,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )
    
    expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.paragraphIndex).toBe(index);
  }
})


it('multilineListContainer, test word click event', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <MultilineListContainer />
        </Provider>
      ),
      container
    );
  });

  const multilines = container!.querySelectorAll('.subtitles');

  fireEvent(
    multilines[0].children[1].children[0].children[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.wordIndex).toBe(0);
})