import { handleActions, createAction, Action } from 'redux-actions';
import * as store from 'storeV2';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import multilineActionType from './multilineActionType';

interface IMultiLineState {
  captions?: store.ICaptionsParagraph[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
}

interface IParagraphUpdatePayload {
  paragraphIndex: number;
  paragraph: store.ICaptionsParagraph;
}

const logger = ReactLoggerFactoryHelper.build('multiline');

export const setCaptions = createAction(
  multilineActionType.setCaptions,
  (captions => ParagraphCaptionsHelper.giveIdToCaptions('multiline', captions, { overwrite: false })) as {
    (captions: store.ICaptionsParagraph[]): store.ICaptionsParagraph[]
  }
);

export const addParagraph = createAction(
  multilineActionType.addParagraph,
  (paragraph => ParagraphCaptionsHelper.giveIdToCaptionsParagraph('multiline', paragraph, { overwrite: false })) as {
    (paragraph: store.ICaptionsParagraph): store.ICaptionsParagraph
  }
);

export const clearCaptions = createAction<void>(multilineActionType.clearCaptions);


export const updateParagraph = createAction(
  multilineActionType.updateParagraph,
  (payload: store.IUpdateParagraphPayload): IParagraphUpdatePayload => ({
    paragraphIndex: payload.path.paragraphIndex!,
    paragraph: ParagraphCaptionsHelper.giveIdToCaptionsParagraph(
      'multiline',
      payload.paragraph,
      { overwrite: false }
    )
  })
);

export const removeParagraph = createAction<number>(multilineActionType.removeParagraph);
export const setText = createAction<store.ISetTextPayload>(multilineActionType.setText);
export const setStartTime = createAction<store.ISetValueWidthIndexPath<number>>(multilineActionType.setStartTime);
export const setEndTime = createAction<store.ISetValueWidthIndexPath<number>>(multilineActionType.setEndTime);
export const setWordStyle = createAction<store.ISetStylePayload>(multilineActionType.setWordStyle);
export const setWordColor = createAction<store.ISetStylePayload>(multilineActionType.setWordColor);
export const setWordOutlineColor = createAction<store.ISetStylePayload>(multilineActionType.setWordOutlineColor);
export const setLineStyle = createAction<store.ISetStylePayload>(multilineActionType.setLineStyle);
export const setLineBackground = createAction<store.ISetStylePayload>(multilineActionType.setLineBackground);
export const setLineColor = createAction<store.ISetStylePayload>(multilineActionType.setLineColor);
export const setLineOutlineColor = createAction<store.ISetStylePayload>(multilineActionType.setLineOutlineColor);
export const setDefaultStyle = createAction<Partial<store.ISetStylePayload>>(multilineActionType.setDefaultStyle);
export const setDefaultLocation = createAction<Partial<store.ISetLocationPayload>>(multilineActionType.setDefaultLocation);
export const clearDefaultStyle = createAction<void>(multilineActionType.clearDefaultStyle);
export const clearDefaultLocation = createAction<void>(multilineActionType.clearDefaultLocation);

function _setLineStyle(state: IMultiLineState, action: Action<store.ISetStylePayload>) {
  const { path, style } = action.payload;

  if (path.lineIndex === undefined) {
    return state;
  }

  if (path.paragraphIndex === undefined) {
    return state;
  }

  const linePath = {
    lineIndex: path.lineIndex,
    paragraphIndex: path.paragraphIndex,
  };

  return {
    ...state,
    captions: ParagraphCaptionsHelper.updateLineValue(
      state.captions!,
      linePath,
      'style',
      style
    )
  };
}

function _setWordStyle(state: IMultiLineState, action: Action<store.ISetStylePayload>) {
  return ParagraphCaptionsHelper.setWordStyle(state, action.payload);
}

const initialState: IMultiLineState = {}

const reducer = handleActions<IMultiLineState, any>({
  [multilineActionType.addParagraph]: (state, action: Action<store.ICaptionsParagraph>) => {
    const captions = [...(state.captions ?? [])];
    const paragraph = { ...action.payload };
    const insertIndex = BinarySearchHelper.findInsertIndex(
      captions,
      paragraph,
      (left, right) => -ComparerHelper.multitlieCompare(left, right)
    );
    captions.splice(insertIndex, 0, paragraph);
    return { ...state, captions: captions }
  },
  [multilineActionType.clearCaptions]: state => {
    const { captions, ...nextState } = state
    return nextState;
  },
  [multilineActionType.removeParagraph]: (state, action: Action<number>) => {
    let nextCaptions = [...(state.captions ?? [])];
    nextCaptions.splice(action.payload, 1);

    return {
      ...state,
      captions: nextCaptions
    };
  },
  [multilineActionType.updateParagraph]: (state, action: Action<IParagraphUpdatePayload>) => {
    const { paragraphIndex, paragraph } = action.payload;

    let nextCaptions = [...state.captions!];
    let nextParagraph = { ...paragraph };
    nextCaptions[paragraphIndex] = nextParagraph;

    return {
      ...state,
      captions: nextCaptions
    };
  },
  [multilineActionType.setText]: (state, action: Action<store.ISetTextPayload>) => {
    const { paragraphIndex, lineIndex, wordIndex } = action.payload.path;
    let nextCaptions = [...state.captions!];
    let nextParagraph = { ...nextCaptions[paragraphIndex] };
    let nextLines = [...nextParagraph.lines ?? []];
    let nextLine = { ...nextLines[lineIndex] };
    let nextWords = [...nextLine.words ?? []];
    let nextWord = {
      ...nextWords[wordIndex],
      text: action.payload.text
    }

    nextWords.splice(wordIndex, 1, nextWord);
    nextLine.words = nextWords;
    nextLines.splice(lineIndex, 1, nextLine);
    nextParagraph.lines = nextLines;
    nextCaptions.splice(paragraphIndex, 1, nextParagraph);

    return {
      ...state,
      captions: nextCaptions
    };
  },
  [multilineActionType.setStartTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', multilineActionType.setStartTime);
      return state;
    }

    const { paragraphIndex, lineIndex } = action.payload;
    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', multilineActionType.setStartTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', multilineActionType.setStartTime);
      return state;
    }

    let nextCaptions = [...state.captions];
    let nextParagraph = {
      ...nextCaptions[paragraphIndex]
    }

    if (nextParagraph.lines === undefined) {
      logger.variableIsUndefined('lines', multilineActionType.setStartTime);
      return state;
    }

    let nextLines = [...nextParagraph.lines];
    let nextLine = {
      ...nextLines[lineIndex]
    };

    if (nextLine?.words === undefined) {
      logger.variableIsUndefined('line.words', multilineActionType.setStartTime);
      return state;
    }

    const setTime = action.payload.value;

    let nextWords: store.ICaptionsWord[] = nextLine.words.map(word => ({
      ...word,
      start: setTime
    }));

    nextLine.words = nextWords;
    nextLines.splice(lineIndex, 1, nextLine);
    nextParagraph.lines = nextLines;
    nextCaptions.splice(paragraphIndex, 1, nextParagraph);

    nextCaptions.sort(ComparerHelper.multitlieCompare);

    return {
      ...state,
      captions: nextCaptions
    }
  },
  [multilineActionType.setEndTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', multilineActionType.setEndTime);
      return state;
    }

    const { paragraphIndex, lineIndex } = action.payload;
    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', multilineActionType.setEndTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', multilineActionType.setEndTime);
      return state;
    }

    let nextCaptions = [...state.captions];
    let nextParagraph = {
      ...nextCaptions[paragraphIndex]
    }

    if (nextParagraph.lines === undefined) {
      logger.variableIsUndefined('lines', multilineActionType.setEndTime);
      return state;
    }

    let nextLines = [...nextParagraph.lines];
    let nextLine = {
      ...nextLines[lineIndex]
    };

    if (nextLine?.words === undefined) {
      logger.variableIsUndefined('line.words', multilineActionType.setEndTime);
      return state;
    }

    const setTime = action.payload.value;

    let nextWords: store.ICaptionsWord[] = nextLine.words.map(word => ({
      ...word,
      end: setTime
    }));

    nextLine.words = nextWords;
    nextLines.splice(lineIndex, 1, nextLine);
    nextParagraph.lines = nextLines;
    nextCaptions.splice(paragraphIndex, 1, nextParagraph);
    nextCaptions.sort(ComparerHelper.multitlieCompare);

    return {
      ...state,
      captions: nextCaptions
    }
  },
  [multilineActionType.setWordStyle]: _setWordStyle,
  [multilineActionType.setWordColor]: _setWordStyle,
  [multilineActionType.setWordOutlineColor]: _setWordStyle,

  [multilineActionType.setLineStyle]: _setLineStyle,
  [multilineActionType.setLineBackground]: _setLineStyle,
  [multilineActionType.setLineColor]: _setLineStyle,
  [multilineActionType.setLineOutlineColor]: _setLineStyle,
  [multilineActionType.setDefaultStyle]: (state, action: Action<Partial<store.ISetStylePayload>>) => {
    const { path, style } = action.payload;
    return ParagraphCaptionsHelper.getDefaultStyleState(state, { path, style });
  },
  [multilineActionType.setDefaultLocation]: (state, action: Action<Partial<store.ISetLocationPayload>>) => {
    const { path, location } = action.payload;
    return ParagraphCaptionsHelper.getDefaultLocationState(state, { path, location });
  },
  [multilineActionType.setCaptions]: (state, action: Action<store.ICaptionsParagraph[]>) => {
    return {
      ...state,
      captions: action.payload
    }
  },
  [multilineActionType.clearDefaultStyle]: (state) => {
    const { defaultStyle, ...nextState } = state;
    return nextState;
  },
  [multilineActionType.clearDefaultLocation]: (state) => {
    const { defaultLocation, ...nextState } = state;
    return nextState;
  }
}, { ...initialState })

export default reducer;
