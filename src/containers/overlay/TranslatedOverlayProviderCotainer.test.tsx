import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import * as downcapStore from 'storeV2';
import TranslatedOverlayProviderCotainer from './TranslatedOverlayProviderCotainer';
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';

const initialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/TranslatedCaptionListContainer.test/initialState.json'
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

it("TranslatedOverlayProviderContainer, render null when player is none", () => {
  let store = configureStore({
    future: [],
    present: initialState,
    past: []
  });

  act(() => {
    render(
      (
        <Provider store={store!}>
          <TranslatedOverlayProviderCotainer />
        </Provider>
      ),
      container
    );
  });

  expect(container?.querySelector('.caption-ovleray')).toBeNull();
})