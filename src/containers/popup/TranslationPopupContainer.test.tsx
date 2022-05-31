import { act } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { Provider } from "react-redux";
import { loadJson } from "test/utility";
import TranslationPopupContainer from "./TranslationPopupContainer"
import * as downcapStore from 'storeV2'
import { configureStore } from "storeV2/store";

const originCaptionWithoutVideo = loadJson<downcapStore.RootState['present']>(
  'src/test/resources/TranslationPopupContainer.test/beforeTranslation.json'
);

let container: HTMLDivElement | null = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container?.remove();
  container = null;
});

it('When the total text length of originCaption is 105 and the total text length of the multi-line is 24, the total lettet consumption estimate is  4', () => {
  const store = configureStore({
    future: [],
    past: [],
    present: originCaptionWithoutVideo
  });

  const mockCloseFunc = jest.fn();

  act(() => {
    render((
      <Provider store={store!}>
        <TranslationPopupContainer onCloseClick={mockCloseFunc}/>
      </Provider>
    ), container);
  });

  const letter = container?.querySelectorAll('.translation-popup-title')[0].children[1].textContent;
  expect(parseInt(letter!)).toBe(4);
});
