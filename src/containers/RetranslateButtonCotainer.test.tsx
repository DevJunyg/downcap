import RetranslateButtonCotainer from './RetranslateButtonCotainer';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "storeV2/store";
import { loadJson } from "test/utility";
import * as downcapStore from 'storeV2';
import { cloneDeep } from "lodash";

const TranslatedCaptionState = loadJson<downcapStore.RootState['present']>('./src/test/resources/RetranslateButtonCotainer.test/originCaptionAndTranslatedCaptionExistState.json');

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it("render retranslate-button when captions and translatedCaption are all exist", () => {
  const captoinsAreExistStore = configureStore({
    future: [],
    past: [],
    present: TranslatedCaptionState
  });

  act(()=>{
    render(
      <Provider store={captoinsAreExistStore!}>
          <RetranslateButtonCotainer />
      </Provider>
    , container)
  });

  expect(container?.children[0]).not.toBeUndefined();
})

it("return null when captions is not exist", () => {
  const originCaptionDeletedTranslatedCaptionState = cloneDeep(TranslatedCaptionState);
  delete originCaptionDeletedTranslatedCaptionState.originCaption.captions;
  const originDeletedStore = configureStore({
    future: [],
    past: [],
    present: originCaptionDeletedTranslatedCaptionState
  });

  act(()=>{
    render(
      <Provider store={originDeletedStore!}>
          <RetranslateButtonCotainer />
      </Provider>
    , container)
  })  

  expect(container?.children[0]).toBeUndefined();
})

it("return null when translatedCaption is not exist", () => {
  const originCaptionDeletedTranslatedCaptionState = cloneDeep(TranslatedCaptionState);
  delete originCaptionDeletedTranslatedCaptionState.translatedCaption.captions;
  const originDeletedStore = configureStore({
    future: [],
    past: [],
    present: originCaptionDeletedTranslatedCaptionState
  });

  act(()=>{
    render(
      <Provider store={originDeletedStore!}>
          <RetranslateButtonCotainer />
      </Provider>
    , container)
  })

  expect(container?.children[0]).toBeUndefined();
})
