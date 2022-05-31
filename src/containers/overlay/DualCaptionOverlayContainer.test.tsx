import DualCaptionOverlayContainer from './DualCaptionOverlayContainer';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';
import * as downcapStore from 'storeV2';

const dualInitialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/dual.json'
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

it("dualcaption overlay container, render overlay none when player is none", () => {
  const store = configureStore({
    future: [],
    present: dualInitialState,
    past: []
  });

  act(() => {
    render((
      <Provider store={store!}>
        <DualCaptionOverlayContainer />
      </Provider>
    ), container);
  });

  expect(container?.querySelector('.caption-ovleray')).toBeNull();
})
