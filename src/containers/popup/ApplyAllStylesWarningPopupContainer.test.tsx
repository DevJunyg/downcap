import ApplyAllStylesWarningPopupContainer from './ApplyAllStylesWarningPopupContainer';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux'
import { act } from "react-dom/test-utils";
import { fireEvent } from '@testing-library/react'
import * as downcapStore from 'storeV2';
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';

const initialoriginCaptionState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ApplyAllStylesWarningPopupContainer.test/originCaptions.json',
);

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  store = configureStore({
    future: [],
    past: [],
    present: initialoriginCaptionState
  });
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;

  store = null;
});

it("ApplyAllStylesWarningPopupContainer render popup which have class which caption-style-apply-contents", () => {
  act(() => {
    render(
      <Provider store={store!}>
        <ApplyAllStylesWarningPopupContainer type={"originCaption"} />
      </Provider>
      , container)
  })
  const styleApplyPopup = container!.querySelector('.caption-style-apply-contents');
  expect(styleApplyPopup).not.toBeNull();
})

it("accept-button click, onCloseClick function becalled", () => {
  const onCloseClick = jest.fn();

  act(() => {
    render(
      <Provider store={store!}>
        <ApplyAllStylesWarningPopupContainer type={"originCaption"} onCloseClick={onCloseClick} />
      </Provider>
      , container)
  })
  const styleAcceptButton = container!.querySelector('.ok-btn') as HTMLElement;

  fireEvent(styleAcceptButton,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }))

  expect(onCloseClick).toBeCalled();
})