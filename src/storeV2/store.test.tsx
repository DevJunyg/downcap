import "test/testPreload";
import * as downcapStore from 'storeV2';
import { configureStore } from "storeV2/store";
import { loadJson } from 'test/utility';
import * as Redux from 'redux';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as multilineActions from 'storeV2/modules/multiline';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline';
import reduUndoCreatorActions from "storeV2/reduUndoCreatorActions";

const allCaptionsWithStyle = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/store.test/allCaptionsWithStyle.json'
);

const store = configureStore({
  future: [],
  past: [],
  present: allCaptionsWithStyle
});

const rgbaTestValues = [
  {
    r: 255,
    g: 255,
    b: 255,
    a: 0
  },
  {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  },
  {
    r: 100,
    g: 100,
    b: 100,
    a: 0.5
  },
  {
    r: 50,
    g: 150,
    b: 250,
    a: 0
  },
];

const path = {
  captionIndex: 0,
  paragraphIndex: 0,
  lineIndex: 0,
  wordIndex: 0
}

describe('Test grouping by color change action of origin caption', () => {
  it('The line background of origin caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.originCaption.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['background'] = rgbaTestValues[i];
      OriginCaptionActions.setLineBackground({ path: path, style: style });
      expect(
        store.getState().present.originCaption.captions?.first().lines[path.lineIndex].style?.background
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.originCaption.captions?.first()).toEqual(originParagraph);
  });

  it('The line color of origin caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.originCaption.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      OriginCaptionActions.setLineColor({ path: path, style: style });
      expect(
        store.getState().present.originCaption.captions?.first().lines[path.lineIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.originCaption.captions?.first()).toEqual(originParagraph);
  });

  it('The line outlineColor of origin caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.originCaption.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      OriginCaptionActions.setLineOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.originCaption.captions?.first().lines[path.lineIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.originCaption.captions?.first()).toEqual(originParagraph);
  });

  it('The word color of origin caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.originCaption.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      OriginCaptionActions.setWordColor({ path: path, style: style });
      expect(
        store.getState().present.originCaption.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.originCaption.captions?.first()).toEqual(originParagraph);
  });

  it('The word outlineColor of origin caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.originCaption.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      OriginCaptionActions.setWordOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.originCaption.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.originCaption.captions?.first()).toEqual(originParagraph);
  });
});


describe('Test grouping by color change action of translated caption', () => {
  it('The line background of translated caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['background'] = rgbaTestValues[i];
      TranslatedCaptionActions.setLineBackground({ path: path, style: style });
      expect(
        store.getState().present.translatedCaption.captions?.first().paragraphs.first().lines[path.lineIndex].style?.background
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toEqual(originParagraph);
  });

  it('The line color of translated caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      TranslatedCaptionActions.setLineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedCaption.captions?.first().paragraphs.first().lines[path.lineIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toEqual(originParagraph);
  });

  it('The line outlineColor of translated caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      TranslatedCaptionActions.setLineOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedCaption.captions?.first().paragraphs.first().lines[path.lineIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toEqual(originParagraph);
  });

  it('The word color of translated caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      TranslatedCaptionActions.setWordColor({ path: path, style: style });
      expect(
        store.getState().present.translatedCaption.captions?.first().paragraphs.first().lines[path.lineIndex].words[path.wordIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toEqual(originParagraph);
  });

  it('The word outlineColor of translated caption can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedCaption.captions?.first().paragraphs.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      TranslatedCaptionActions.setWordOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedCaption.captions?.first().paragraphs.first().lines[path.lineIndex].words[path.wordIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedCaption.captions?.first().paragraphs.first()).toEqual(originParagraph);
  });
});


describe('Test grouping by color change action of multiline caption', () => {
  it('The line background of multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.multiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['background'] = rgbaTestValues[i];
      MultilineActions.setLineBackground({ path: path, style: style });
      expect(
        store.getState().present.multiline.captions?.first().lines[path.lineIndex].style?.background
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.multiline.captions?.first()).toEqual(originParagraph);
  });

  it('The line color of multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.multiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      MultilineActions.setLineColor({ path: path, style: style });
      expect(
        store.getState().present.multiline.captions?.first().lines[path.lineIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.multiline.captions?.first()).toEqual(originParagraph);
  });

  it('The line outlineColor of multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.multiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      MultilineActions.setLineOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.multiline.captions?.first().lines[path.lineIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.multiline.captions?.first()).toEqual(originParagraph);
  });

  it('The word color of multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.multiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      MultilineActions.setWordColor({ path: path, style: style });
      expect(
        store.getState().present.multiline.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.multiline.captions?.first()).toEqual(originParagraph);
  });

  it('The word outlineColor of multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.multiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const MultilineActions = Redux.bindActionCreators(multilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      MultilineActions.setWordOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.multiline.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.multiline.captions?.first()).toEqual(originParagraph);
  });
});

describe('Test grouping by color change action of translated multiline caption', () => {
  it('The line background of translated multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedMultiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['background'] = rgbaTestValues[i];
      TranslatedMultilineActions.setLineBackground({ path: path, style: style });
      expect(
        store.getState().present.translatedMultiline.captions?.first().lines[path.lineIndex].style?.background
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedMultiline.captions?.first()).toEqual(originParagraph);
  });

  it('The line color of translated multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedMultiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      TranslatedMultilineActions.setLineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedMultiline.captions?.first().lines[path.lineIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedMultiline.captions?.first()).toEqual(originParagraph);
  });

  it('The line outlineColor of translated multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedMultiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].style };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      TranslatedMultilineActions.setLineOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedMultiline.captions?.first().lines[path.lineIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedMultiline.captions?.first()).toEqual(originParagraph);
  });

  it('The word color of translated multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedMultiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['color'] = rgbaTestValues[i];
      TranslatedMultilineActions.setWordColor({ path: path, style: style });
      expect(
        store.getState().present.translatedMultiline.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.color
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedMultiline.captions?.first()).toEqual(originParagraph);
  });

  it('The word outlineColor of translated multiline can be undo at once to the state before the changing color, even after changing a color multiple times.', async () => {
    const originParagraph = store.getState().present.translatedMultiline.captions?.first() as Readonly<downcapStore.ICaptionsParagraph>;
    let style = { ...originParagraph.lines[path.lineIndex].words[path.wordIndex].style };

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, store.dispatch);
    for (let i = 0; i < rgbaTestValues.length; i++) {
      style['outlineColor'] = rgbaTestValues[i];
      TranslatedMultilineActions.setWordOutlineColor({ path: path, style: style });
      expect(
        store.getState().present.translatedMultiline.captions?.first().lines[path.lineIndex].words[path.wordIndex].style?.outlineColor
      ).toEqual(rgbaTestValues[i]);
    }

    reduUndoCreatorActions(store.dispatch).undo();
    expect(store.getState().present.translatedMultiline.captions?.first()).toEqual(originParagraph);
  });
});