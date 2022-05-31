import "test/testPreload";
import FormatControlPanel from "./FormatControlPanel";
import * as downcapStore from "storeV2";
import { loadJson } from "test/utility";
import { unmountComponentAtNode } from "react-dom";
import { configureStore } from "storeV2/store";
import { Provider } from "react-redux";
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from "@testing-library/dom";

const firstLineSeletedState = loadJson<downcapStore.RootState['present']>('./src/test/resources/FormatControlPanel.test/firstLineSeletedState.json');

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

it("Select option1 with nothing selected state, option1.selected is true ", async () => {
  let store = configureStore({
    past: [],
    present: firstLineSeletedState,
    future: []
  });

  const onStyleChange = jest.fn();

  await act(async () => {
    render((
      <Provider store={store!}>
        <FormatControlPanel onStyleChange={onStyleChange} />
      </Provider>
    ), container);
  });

  const fontSelect = container?.querySelectorAll('select')[1];
  
  act(() => {
    fireEvent.change(fontSelect!, { target: { value: "1" } });
  });
  
  const options = fontSelect?.querySelectorAll('option');
  expect(options![0].selected).toBeFalsy();
  expect(options![1].selected).toBeTruthy();
  expect(options![2].selected).toBeFalsy();
})

it("local font that starts with a string is selected, the font  as string pass to onStyleChange", async () => {
  let store = configureStore({
    past: [],
    present: firstLineSeletedState,
    future: []
  });

  const onStyleChange = jest.fn();

  await act(async () => {
    render((
      <Provider store={store!}>
        <FormatControlPanel onStyleChange={onStyleChange} />
      </Provider>
    ), container);
  });

  const fontSelect = container?.querySelectorAll('select')[1];

  fireEvent.change(fontSelect!, { target: { value: "fontStartingWithString" } });
  expect(onStyleChange).toBeCalledWith("font", "fontStartingWithString")
})

it("local font that starts with a number is selected, the font  as string pass to onStyleChange", async () => {
  let store = configureStore({
    past: [],
    present: firstLineSeletedState,
    future: []
  });

  const onStyleChange = jest.fn();

  await act(async () => {
    render((
      <Provider store={store!}>
        <FormatControlPanel onStyleChange={onStyleChange} />
      </Provider>
    ), container);
  });

  const fontSelect = container?.querySelectorAll('select')[1];

  fireEvent.change(fontSelect!, { target: { value: "123fontStartingWithNumber" } });
  expect(onStyleChange).toBeCalledWith("font", "123fontStartingWithNumber")
})

it("youtubefont is selected, the font as number pass to onStyleChange", async () => {
  let store = configureStore({
    past: [],
    present: firstLineSeletedState,
    future: []
  });

  const onStyleChange = jest.fn();

  await act(async () => {
    render((
      <Provider store={store!}>
        <FormatControlPanel onStyleChange={onStyleChange} />
      </Provider>
    ), container);
  });

  const fontSelect = container?.querySelectorAll('select')[1];

  fireEvent.change(fontSelect!, { target: { value: "1" } });
  expect(onStyleChange).toBeCalledWith("font", 1)
})
