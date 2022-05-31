import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import TranslatedMultilineOverlayProviderContainer from 'containers/overlay/TranslatedMultilineOverlayProviderContainer';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';

const unFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/unFocusedState.json');
const translatedMultilineFocusedState = loadJson<downcapStore.RootState>('./src/test/resources/OverlayProviderTestDummys/translatedMultilineFocusedState.json');

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

it("TranslatedMultilineOverlayProviderContainer rendering when out of no focus.", () => {
  let store = configureStore(unFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedMultilineOverlayProviderContainer />
      </Provider>
    ), container);
  });
  const captionOverlayArr = container!.children;
  let inputLabelValueArr = [];

  for (let index = 0; index < captionOverlayArr.length; index++) {
    const captionOverlay = captionOverlayArr[index];
    const inputLabel = (captionOverlay!.querySelector('.input-label') as HTMLDivElement).children[0] as HTMLInputElement;
    const inputLabelValue = inputLabel.value;
    
    inputLabelValueArr.push(inputLabelValue);
  }

  const result = inputLabelValueArr.includes('This is a newly created line1');
  const result2 = inputLabelValueArr.includes('This is a newly created line2');

  expect(result && result2).toBe(true);
});

it("TranslatedMultilineOverlayProviderContainer rendering when translated multiline focus.", () => {
  let store = configureStore(translatedMultilineFocusedState);
  act(() => {
    render((
      <Provider store={store!}>
        <TranslatedMultilineOverlayProviderContainer />
      </Provider>
    ), container);
  });
  
  const captionOverlayArr = container!.children;
  let inputLabelValueArr = [];

  for (let index = 0; index < captionOverlayArr.length; index++) {
    const captionOverlay = captionOverlayArr[index];
    const inputLabel = (captionOverlay!.querySelector('.input-label') as HTMLDivElement).children[0] as HTMLInputElement;
    const inputLabelValue = inputLabel.value;
    inputLabelValueArr.push(inputLabelValue);
  }
  
  const result = inputLabelValueArr.includes('This is a newly created line3');

  expect(result).toBe(true);
});