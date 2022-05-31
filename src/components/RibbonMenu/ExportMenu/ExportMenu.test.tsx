import { render, unmountComponentAtNode } from "react-dom";
import ExportMenu from "./ExportMenu"
import { act } from "react-dom/test-utils";
import * as downcapStore from 'storeV2';
import { loadJson } from 'test/utility';
import { configureStore } from "storeV2/store";
import { Provider } from 'react-redux';
import { cloneDeep } from "lodash";

const originCaptionWithoutVideo = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ExportMenu.test/originCaptionWithoutVideo.json'
);

const emptyCaptions = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ExportMenu.test/emptyCaptions.json'
);

const multilinesWithoutVideo = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ExportMenu.test/multilinesWithoutVideo.json'
);

let container: HTMLDivElement | null = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container?.remove();
  container = null;
  jest.useRealTimers();
});

it('The ExportMenuButton of ExportMenu is enabled in only origin caption exist', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: originCaptionWithoutVideo
  });

  const state = cloneDeep(store.getState().present);
  const existOriginAndTranslatedCaption = state.originCaption.captions?.any() || state.translatedCaption.captions?.any();

  const handleCaptionExportClick = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <ExportMenu
          selected={true}
          captionsExportDisabled={!existOriginAndTranslatedCaption}
          onCaptionsExportClick={handleCaptionExportClick}
        />
      </Provider>
    ), container);
  });

  (container!.children[0].children[2].children[0] as HTMLDivElement).click();
  expect(handleCaptionExportClick).toBeCalled();
});

it('The ExportMenuButton of ExportMenu is disabled in only mutiline caption exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: multilinesWithoutVideo
  });
  
  const state = cloneDeep(store.getState().present);
  const existOriginAndTranslatedCaption = state.originCaption.captions?.any() || state.translatedCaption.captions?.any();
  
  const handleCaptionExportClick = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <ExportMenu
          selected={true}
          captionsExportDisabled={!existOriginAndTranslatedCaption}
          onCaptionsExportClick={handleCaptionExportClick}
        />
      </Provider>
    ), container);
  });

  let ExportMenuButtonDom = (container!.children[0].children[2].children[0] as HTMLDivElement);
  (ExportMenuButtonDom).click();
  expect(ExportMenuButtonDom).toHaveClass('disabled');
  expect(handleCaptionExportClick).not.toBeCalled();
});

it('The ExportMenuButton of ExportMenu is disabled in captions no exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: emptyCaptions
  });
  
  const state = cloneDeep(store.getState().present);
  const existOriginAndTranslatedCaption = state.originCaption.captions?.any() || state.translatedCaption.captions?.any();
  
  const handleCaptionExportClick = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <ExportMenu
          selected={true}
          captionsExportDisabled={!existOriginAndTranslatedCaption}
          onCaptionsExportClick={handleCaptionExportClick}
        />
      </Provider>
    ), container);
  });

  let ExportMenuButtonDom = (container!.children[0].children[2].children[0] as HTMLDivElement);
  ExportMenuButtonDom.click();
  expect(ExportMenuButtonDom).toHaveClass('disabled');
  expect(handleCaptionExportClick).not.toBeCalled();
});