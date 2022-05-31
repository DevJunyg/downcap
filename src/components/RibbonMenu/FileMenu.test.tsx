import { render, unmountComponentAtNode } from "react-dom";
import FileMenu from "./FileMenu"
import { act } from "react-dom/test-utils";
import * as downcapStore from 'storeV2';
import { loadJson } from 'test/utility';
import { configureStore } from "storeV2/store";
import { Provider } from 'react-redux';
import { cloneDeep } from "lodash";

const captionsWithoutVideo = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/FileMenu.test/captionsWithoutVideo.json'
);

const emptyCaptions = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/FileMenu.test/emptyCaptions.json'
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

it('The ProjectSaveButton of FileMenu is enabled in video no exist and captions exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: captionsWithoutVideo
  });

  const state = cloneDeep(store.getState().present);
  const videoPath = state.project.videoPath;
  const existAnyCaption = state.originCaption.captions?.any()
    || state.translatedCaption.captions?.any()
    || state.multiline.captions?.any()
    || state.translatedMultiline.captions?.any();

  const handleProjectSaveClick = jest.fn();
  const handleProjectSaveAsClick = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <FileMenu
          selected={true}
          projectSaveDisabled={!videoPath && !existAnyCaption}
          onProjectSaveClick={handleProjectSaveClick}
          onProjectSaveAsClick={handleProjectSaveAsClick} />
      </Provider>
    ), container);
  });

  let fileMenuButtonsDom = (container!.children[0].children[2] as HTMLDivElement);
  (fileMenuButtonsDom.children[2] as HTMLDivElement).click();
  expect(handleProjectSaveClick).toBeCalled();

  (fileMenuButtonsDom.children[3] as HTMLDivElement).click();
  expect(handleProjectSaveAsClick).toBeCalled();
});

it('The ProjectSaveButton of FileMenu is disabled in video and captions no exist.', async () => {
  const store = configureStore({
    future: [],
    past: [],
    present: emptyCaptions
  });

  const state = cloneDeep(store.getState().present);
  const videoPath = state.project.videoPath;
  const existAnyCaption = state.originCaption.captions?.any()
    || state.translatedCaption.captions?.any()
    || state.multiline.captions?.any()
    || state.translatedMultiline.captions?.any();

  const handleProjectSaveClick = jest.fn();
  const handleProjectSaveAsClick = jest.fn();
  act(() => {
    render((
      <Provider store={store!}>
        <FileMenu
          selected={true}
          projectSaveDisabled={!videoPath && !existAnyCaption}
          onProjectSaveClick={handleProjectSaveClick}
          onProjectSaveAsClick={handleProjectSaveAsClick} />
      </Provider>
    ), container);
  });

  let fileMenuButtonsDom = (container!.children[0].children[2] as HTMLDivElement);
  let saveButtonDom = fileMenuButtonsDom.children[2] as HTMLDivElement;
  let saveAsButtonDom = fileMenuButtonsDom.children[3] as HTMLDivElement;

  saveButtonDom.click();
  expect(saveButtonDom).toHaveClass("disabled")
  expect(handleProjectSaveClick).not.toBeCalled();

  saveAsButtonDom.click();
  expect(saveAsButtonDom).toHaveClass("disabled")
  expect(handleProjectSaveAsClick).not.toBeCalled();
});