import "test/testPreload";
import IpcSender from "lib/IpcSender";
import MultilineTitleBarContainer from "./MultilineTitleBarContainer"
import * as downcapStore from 'storeV2';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { fireEvent } from "@testing-library/dom";
import { configureStore } from "storeV2/store";
import { loadJson } from "test/utility";
import { cloneDeep } from "lodash";

const multilineState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/multiline.json'
);

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  store = configureStore({
    past: [],
    present: multilineState,
    future: []
  })
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;

  store = null;
});

it('MultilineTitleBarContainer create new multiline button click', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <MultilineTitleBarContainer selectedEditType="origin"/>
        </Provider>
      ),
      container
    );
  });

  const sendMultiLineWarning = jest.spyOn(IpcSender, 'sendMultiLineWarning');

  const multilines = container!.querySelectorAll('.pointer');
  fireEvent(
    multilines[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  
  expect(sendMultiLineWarning).toBeCalled();
  expect(store!.getState().present.multiline.captions?.length).toBe(5);
  expect(multilines[0]).toBeTruthy();
})

it('MultilineTitleBarContainer create new multiline button click', () => {
  act(() => {
    render(
      (
        <Provider store={store!}>
          <MultilineTitleBarContainer selectedEditType="origin"/>
        </Provider>
      ),
      container
    );
  });

  const sendMultiLineWarning = jest.spyOn(IpcSender, 'sendMultiLineWarning');

  const multilines = container!.querySelectorAll('.pointer');
  fireEvent(
    multilines[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  
  expect(sendMultiLineWarning).toBeCalled();
  expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.paragraphIndex).toBe(0);
  expect(store!.getState().present.projectCotrol.focusParagraphMetas![0].path.paragraphIndex).not.toBe(1);
})

it('MultilineTitleBarContainer, check multilinecaption is null ', () => {
  const captionDeletedmultilineState = cloneDeep(multilineState);
  delete captionDeletedmultilineState.multiline.captions;

  const deletedStore = configureStore({
    past: [],
    present: captionDeletedmultilineState,
    future: []
  })
  
  act(() => {
    render(
      (
        <Provider store={deletedStore!}>
          <MultilineTitleBarContainer />
        </Provider>
      ),
      container
    );
  });

  const sendMultiLineWarning = jest.spyOn(IpcSender, 'sendMultiLineWarning');

  const multilines = container!.querySelectorAll('.pointer');
  fireEvent(
    multilines[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(sendMultiLineWarning).toBeCalled();
  expect(deletedStore!.getState().present.multiline.captions?.length).toBe(1)
})
