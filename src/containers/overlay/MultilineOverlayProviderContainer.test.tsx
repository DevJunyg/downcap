import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import MultilineOverlayProviderContainer from 'containers/overlay/MultilineOverlayProviderContainer';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';

const unFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/MultilineOverlayProviderContainer.test/unFocusedState.json');

const multilineFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/MultilineOverlayProviderContainer.test/multilineFocusedState.json');

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

it("MultilineOverlayProviderContainer does not render when out of no focus.", () => {
  let store = configureStore(unFocusedState);
  
  act(() => {
    render((
      <Provider store={store!}>
        <MultilineOverlayProviderContainer />
      </Provider>
    ), container);
  });
  
  expect(container?.querySelector('.input-label') as HTMLDivElement).toBeNull();
});

it("MultilineOverlayProviderContainer rendering when multiline focus.", () => {
  let store = configureStore(multilineFocusedState);
  
  act(() => {
    render((
      <Provider store={store!}>
        <MultilineOverlayProviderContainer />
      </Provider>
    ), container);
  });

  expect(container).toContainHTML('새로 생성한 줄입니다');
});