import { render, unmountComponentAtNode } from "react-dom";
import CaptionsExportPopup from "./CaptionsExportPopup"
import { act } from "react-dom/test-utils";
import * as downcapStore from 'storeV2';
import { loadJson } from 'test/utility';
import { configureStore } from "storeV2/store";
import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { cloneDeep } from "lodash";

const originCaptionWithoutVideo = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/CaptionExportPopup.test/originCaptionWithoutVideo.json'
);

const captionsWithoutVideo = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/CaptionExportPopup.test/captionsWithoutVideo.json'
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

it('The exportLanguage radio button of CaptionsExportPopup is disabled in translated captions no exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: originCaptionWithoutVideo
  });

  const state = cloneDeep(store.getState().present);
  const translatedCaptions = state.translatedCaption.captions;

  const handleAcceptClick = jest.fn();
  const handleExportLanguageChange = jest.fn();
  const handleFormatChange = jest.fn();
  const handleXmlChange = jest.fn()
  act(() => {
    render((
      <Provider store={store!}>
        <CaptionsExportPopup
          enIsEmptyOrNull={!translatedCaptions?.any() || translatedCaptions?.length === 0}
          onAcceptClick={handleAcceptClick}
          onExportLanguageChange={handleExportLanguageChange}
          onFormatChange={handleFormatChange}
          onXmlChange={handleXmlChange}
        />
      </Provider>
    ), container);
  });

  let SelectLanguageDom = container!.querySelector('.selectable-elements') as HTMLDivElement;
  for (let index = 1; index < 3; index++) {
    const radioInput = SelectLanguageDom.children[index].children[0] as HTMLInputElement;
    radioInput.click();
    expect(radioInput.getAttribute('disabled')?.length).not.toBe(undefined);
    expect(handleExportLanguageChange).not.toBeCalled();
  }
});

it('The accept button of CaptionsExportPopup is enabled in video no exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: captionsWithoutVideo
  });

  const handleAcceptClick = jest.fn();
  const handleExportLanguageChange = jest.fn();
  const handleFormatChange = jest.fn();
  const handleXmlChange = jest.fn()
  act(() => {
    render((
      <Provider store={store!}>
        <CaptionsExportPopup
          enIsEmptyOrNull
          onAcceptClick={handleAcceptClick}
          onExportLanguageChange={handleExportLanguageChange}
          onFormatChange={handleFormatChange}
          onXmlChange={handleXmlChange}
        />
      </Provider>
    ), container);
  });

  (await screen.findByTestId("test-id-acceptclose-popup-accept-btn") as HTMLDivElement).click();
  expect(handleAcceptClick).toBeCalled();
});