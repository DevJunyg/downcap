import "test/testPreload";
import * as downcapStore from 'storeV2';
import StylesControlContainer from './StylesControlContainer'
import { Provider } from "react-redux";
import { render, unmountComponentAtNode } from "react-dom";
import { act, fireEvent } from "@testing-library/react";
import { loadJson } from "test/utility";
import PopupManager from "managers/PopupManager";
import { configureStore } from "storeV2/store";
import { cloneDeep } from "lodash";

const haveDefaultValuesState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/StylesControlContainer.test/haveDefaultValuesState.json'
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

it("click ApplyAllStylesButton, openApplyAllStylesWarningPopup to be called", () => {
  const enParagrphSelectedState = cloneDeep(haveDefaultValuesState);
  enParagrphSelectedState.projectCotrol = {
    selectedStyleEditType: 'line',
    focusParagraphMetas: [
      {
        path: {
          captionIndex: 0,
          paragraphIndex: 0
        },
        source: 'list',
        type: 'translatedCaption'
      }
    ]
  };

  PopupManager.openApplyAllStylesWarningPopup = jest.fn();

  const store = configureStore({
    past: [],
    present: enParagrphSelectedState,
    future: []
  });

  act(() => {
    render((
      <Provider store={store!}>
        <StylesControlContainer />
      </Provider>
    ), container);
  })

  const applyAllButton = container?.querySelectorAll('.caption-style-apply-button');

  fireEvent(applyAllButton![0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  expect(PopupManager.openApplyAllStylesWarningPopup).toBeCalled();
})