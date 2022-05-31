import { unmountComponentAtNode } from "react-dom";
import * as downcapStore from 'storeV2';
import ParagraphCaptionsHelper from './ParagraphCaptionsHelper';
import { loadJson } from "test/utility";

const originInitialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ParagraphCaptionsHelper.test/originInitialState.json',
);

const translatedCaptionInitialState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ParagraphCaptionsHelper.test/translatedCaptionInitialState.json',
);

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

describe("update updateParagraphValues set undefined location value", () => {
  it("updateParagraphValues remove key when passed values is null", () => {
    const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
      paragraphIndex: 0
    }
    const caption = ParagraphCaptionsHelper.updateParagraphValues(
      originInitialState.originCaption.captions!,
      path,
      { vertical: null, horizontal: null })

    expect(caption![0]).not.toHaveProperty("vertical");
    expect(caption![0]).not.toHaveProperty("horizontal");
  });

  it("get caption what tohave location when pass location to updateParagraphValues", () => {
    const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
      paragraphIndex: 0
    }
    const caption = ParagraphCaptionsHelper.updateParagraphValues(originInitialState.originCaption.captions!,
      path,
      { vertical: 0.5, horizontal: 0.1 }
    )

    expect(caption![0]).toHaveProperty("vertical");
    expect(caption![0]).toHaveProperty("horizontal");
  });


  it("translatedCaption updateParagraphValues function to have not location property", () => {
    const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
      paragraphIndex: 0
    }
    const caption = ParagraphCaptionsHelper.updateParagraphValues(
      translatedCaptionInitialState.translatedCaption.captions![0].paragraphs,
      path,
      { vertical: null, horizontal: null }
    )

    expect(caption![0]).not.toHaveProperty("vertical");
    expect(caption![0]).not.toHaveProperty("horizontal");
  });

  it("translatedCaption updateParagraphValues function to have location property ", () => {
    const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
      paragraphIndex: 0
    }

    const caption = ParagraphCaptionsHelper.updateParagraphValues(
      translatedCaptionInitialState.translatedCaption.captions![0].paragraphs,
      path,
      { vertical: 0.5, horizontal: 0.1 }
    )

    expect(caption![0]).toHaveProperty("vertical");
    expect(caption![0]).toHaveProperty("horizontal");
  });
})

it("getDefaultStyleState return initState when style is null", () => {
  const path: Readonly<Required<Pick<downcapStore.IIndexPath, 'paragraphIndex'>>> = {
    paragraphIndex: 0
  }

  const captions = ParagraphCaptionsHelper.getDefaultStyleState(originInitialState.originCaption, { path, style: null })

  expect(captions!).toEqual(originInitialState.originCaption)
});

it("getDefaultStyleState style value exists and the path value does not exist, set defualt style and other value is inital value return", () => {
  const firstLineStyle = translatedCaptionInitialState.translatedCaption.captions![0].paragraphs[0].lines[0].style;

  const captions = ParagraphCaptionsHelper.getDefaultStyleState(originInitialState.originCaption, { path: undefined, style: firstLineStyle });

  expect(captions.defaultStyle!).toEqual(firstLineStyle);
  expect(captions.captions!).toEqual(originInitialState.originCaption.captions);
});
