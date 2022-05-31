import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import * as downcapStore from 'storeV2';
import TranslatedMultilineOverlayContainer from './TranslatedMultilineOverlayContainer';
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';

const translatedMultilineInitialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/translatedMultiline.json'
);

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it("render translated-multilineline when caption is exist", () => {
  let store = configureStore({
    future: [],
    present: translatedMultilineInitialState,
    past: []
  });

  act(() => {
    render(
      (
        <Provider store={store!}>
          <TranslatedMultilineOverlayContainer caption={translatedMultilineInitialState.translatedMultiline.captions?.first()} />
        </Provider>
      ),
      container
    );
  });

  expect(container).toContainHTML('This is a newly created line');
})