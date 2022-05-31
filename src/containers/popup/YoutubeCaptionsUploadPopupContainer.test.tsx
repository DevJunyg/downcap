import "test/testPreload";
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from "react-dom";
import YoutubeCaptionsUploadPopupContainer from './YoutubeCaptionsUploadPopupContainer';
import { loadJson } from 'test/utility';
import * as downcapStore from 'storeV2';
import { configureStore } from 'storeV2/store';

const youtubeCaptionsUploadState = loadJson<downcapStore.RootState['present']>('./src/test/resources/YoutubeCaptionsUploadPopupContainer.test/youtubeCaptionsUploadState.json');

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

it("YoutubeCaptionsUploadPopupContainer is rendering container has youtube-captions-upload-contents element.", () => {
  const store = configureStore({
    future: [],
    past: [],
    present: youtubeCaptionsUploadState
  });
  act(() => {
    render((
      <Provider store={store!}>
        <YoutubeCaptionsUploadPopupContainer />
      </Provider>
    ), container);  
  });

  expect(container?.getElementsByClassName('youtube-captions-upload-contents')).not.toBe(null);
});