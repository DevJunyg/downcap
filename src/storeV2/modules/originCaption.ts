import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import MathExtensions from 'MathExtensions';
import { Action, createAction, handleActions } from 'redux-actions';
import * as store from 'storeV2';
import "JsExtensions";
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import originCaptionActionType from './originCaptionActionType';

interface ICaptionWithIndexPayload {
  index: number;
  caption: store.ICaptionsParagraph;
}

interface IOriginCaptionState {
  captions?: store.ICaptionsParagraph[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
}

const logger = ReactLoggerFactoryHelper.build('originCaption');

const initState: IOriginCaptionState = {};

function setStartTimeWithTimeResetByTimeProportional(words: readonly store.ICaptionsWord[], nextStartTime: number) {
  const prevStart = words.first().start;
  const prevEnd = words.last().end;
  const prevDuration = prevEnd - prevStart;
  const nextDuration = prevEnd - nextStartTime;

  const proportion = nextDuration / prevDuration;

  return words.map(word => ({
    ...word,
    start: MathExtensions.round(((word.start - prevStart) * proportion) + nextStartTime, 3),
    end: MathExtensions.round(((word.end - prevStart) * proportion) + nextStartTime, 3)
  }));
}

function setStartTimeWithTimeResetByTextProportional(words: readonly store.ICaptionsWord[], nextStartTime: number) {
  const totalLength = words.reduce((acc, current) => acc += (current.text.length + 1), 0);
  const end = words.last().end;
  const prevDuration = end - nextStartTime;
  let prevStart, prevEnd = nextStartTime;

  return words.map(word => {
    prevStart = prevEnd;
    prevEnd = prevStart + (prevDuration * ((word.text.length + 1) / totalLength));

    return {
      ...word,
      start: MathExtensions.round(prevStart, 3),
      end: MathExtensions.round(prevEnd, 3)
    };
  });
}

function setEndTimeWithTimeResetByTimeProportional(words: readonly store.ICaptionsWord[], nextEndTime: number) {
  const prevStart = words.first().start;
  const prevEnd = words.last().end;
  const prevDuration = prevEnd - prevStart;
  const nextDuration = nextEndTime - prevStart;

  const proportion = nextDuration / prevDuration;

  return words.map(word => ({
    ...word,
    start: MathExtensions.round(((word.start - prevStart) * proportion) + prevStart, 3),
    end: MathExtensions.round(((word.end - prevStart) * proportion) + prevStart, 3)
  }));
}

function setEndTimeWithTimeResetByTextProportional(words: readonly store.ICaptionsWord[], nextEndTime: number) {
  const totalLength = words.reduce((acc, current) => acc += (current.text.length + 1), 0);
  const start = words.first().start;
  const prevDuration = nextEndTime - start;
  let prevStart, prevEnd = start;

  return words.map(word => {
    prevStart = prevEnd;
    prevEnd = prevStart + (prevDuration * ((word.text.length + 1) / totalLength));

    return {
      ...word,
      start: MathExtensions.round(prevStart, 3),
      end: MathExtensions.round(prevEnd, 3)
    };
  });
}

export const setCaptions = createAction(
  originCaptionActionType.setCaptions,
  (captions => ParagraphCaptionsHelper.giveIdToCaptions('origin', captions, { overwrite: false })) as {
    (captions: store.ICaptionsParagraph[]): store.ICaptionsParagraph[]
  }
);

export const addCaptions = createAction(
  originCaptionActionType.addCaptions,
  (captions => ParagraphCaptionsHelper.giveIdToCaptions('origin', captions, { overwrite: false })) as {
    (captions: store.ICaptionsParagraph[]): store.ICaptionsParagraph[]
  }
);

export const insertCaption = createAction(
  originCaptionActionType.insertCaption,
  (index: number, caption: store.ICaptionsParagraph) => ({
    index: index,
    caption: ParagraphCaptionsHelper.giveIdToCaptionsParagraph('origin', caption, { overwrite: false })
  }));

export const updateCaption = createAction(
  originCaptionActionType.updateCaption,
  (index: number, caption: store.ICaptionsParagraph) => ({
    index: index,
    caption: ParagraphCaptionsHelper.giveIdToCaptionsParagraph('origin', caption, { overwrite: false })
  })
);

export const updateParagraph = createAction(
  originCaptionActionType.updateCaption,
  (payload: store.IUpdateParagraphPayload): ICaptionWithIndexPayload => ({
    index: payload.path.paragraphIndex!,
    caption: ParagraphCaptionsHelper.giveIdToCaptionsParagraph(
      'origin',
      payload.paragraph,
      { overwrite: false }
    )
  })
);

export const removeCaption = createAction<number>(originCaptionActionType.removeCaption);
export const setText = createAction<store.ISetTextPayload>(originCaptionActionType.setText);
export const clearCaptions = createAction(originCaptionActionType.clearCaptions);
export const setStartTime = createAction<store.ISetValueWidthIndexPath<number>>(originCaptionActionType.setStartTime);
export const setEndTime = createAction<store.ISetValueWidthIndexPath<number>>(originCaptionActionType.setEndTime);
export const setWordStyle = createAction<store.ISetStylePayload>(originCaptionActionType.setWordStyle);
export const setWordColor = createAction<store.ISetStylePayload>(originCaptionActionType.setWordColor);
export const setWordOutlineColor = createAction<store.ISetStylePayload>(originCaptionActionType.setWordOutlineColor);
export const setLineStyle = createAction<store.ISetStylePayload>(originCaptionActionType.setLineStyle);
export const setLineBackground = createAction<store.ISetStylePayload>(originCaptionActionType.setLineBackground);
export const setLineColor = createAction<store.ISetStylePayload>(originCaptionActionType.setLineColor);
export const setLineOutlineColor = createAction<store.ISetStylePayload>(originCaptionActionType.setLineOutlineColor);
export const setDefaultStyle = createAction<Partial<store.ISetStylePayload>>(originCaptionActionType.setDefaultStyle);
export const setDefaultLocation = createAction<Partial<store.ISetLocationPayload>>(originCaptionActionType.setDefaultLocation);
export const clearDefaultStyle = createAction<void>(originCaptionActionType.clearDefaultStyle);
export const clearDefaultLocation = createAction<void>(originCaptionActionType.clearDefaultLocation);

function _setLineStyle(state: IOriginCaptionState, action: Action<store.ISetStylePayload>) {
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

function _setWordStyle(state: IOriginCaptionState, action: Action<store.ISetStylePayload>) {
  return ParagraphCaptionsHelper.setWordStyle(state, action.payload);
}

const reducer = handleActions<IOriginCaptionState, any>({
  [originCaptionActionType.setCaptions]: (state, action: Action<store.ICaptionsParagraph[]>) => {
    return {
      ...state,
      captions: [...action.payload]
    }
  },
  [originCaptionActionType.insertCaption]: (state, action: Action<ICaptionWithIndexPayload>) => {
    let captions = state.captions ? [...state.captions] : [];
    captions.splice(action.payload.index, 0, action.payload.caption);
    return {
      ...state,
      captions: captions
    };
  },
  [originCaptionActionType.updateCaption]: (state, action: Action<ICaptionWithIndexPayload>) => {
    let captions = state.captions ? [...state.captions] : [];
    captions[action.payload.index] = { ...action.payload.caption };

    return {
      ...state,
      captions: captions
    };
  },
  [originCaptionActionType.removeCaption]: (state, action: Action<number>) => {
    if (state.captions === undefined) {
      return state;
    }

    let captions = [...state.captions];
    captions.splice(action.payload, 1);

    if (captions.length === 0) {
      const { captions, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      captions: captions
    };
  },
  [originCaptionActionType.addCaptions]: (state, action: Action<store.ICaptionsParagraph[]>) => {
    let captions = state.captions ? [...state.captions] : [];
    captions = [...captions, ...action.payload];
    return {
      ...state,
      captions: captions
    };
  },
  [originCaptionActionType.setText]: (state, action: Action<store.ISetTextPayload>) => {
    return {
      ...state,
      captions: ParagraphCaptionsHelper.updateWordValues(
        state.captions!,
        action.payload.path,
        {
          confidence: 1,
          text: action.payload.text
        })
    }
  },
  [originCaptionActionType.clearCaptions]: state => {
    const { captions, ...nextState } = state;
    return nextState;
  },
  [originCaptionActionType.setStartTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', originCaptionActionType.setStartTime);
      return state;
    }

    const { paragraphIndex, lineIndex } = action.payload;
    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', originCaptionActionType.setStartTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', originCaptionActionType.setStartTime);
      return state;
    }

    let captions = [...state.captions];
    let paragraph = {
      ...captions[paragraphIndex]
    }

    let lines = paragraph.lines;
    if (lines === undefined) {
      logger.variableIsUndefined('lines', originCaptionActionType.setStartTime);
      return state;
    }

    lines = [...lines];
    let line = {
      ...lines[lineIndex]
    };

    if (line?.words === undefined) {
      logger.variableIsUndefined('line?.words', originCaptionActionType.setStartTime);
      return state;
    }

    const setTime = action.payload.value;
    const startTime = line.words.first().start;
    const endTime = line.words.last().end;

    let nextWords: store.ICaptionsWord[];
    if (endTime - startTime < 1) {
      nextWords = setStartTimeWithTimeResetByTextProportional(line.words, setTime);
    }
    else {
      nextWords = setStartTimeWithTimeResetByTimeProportional(line.words, setTime);
    }

    line.words = nextWords;
    lines.splice(lineIndex, 1, line);
    paragraph.lines = lines;
    captions.splice(paragraphIndex, 1, paragraph);

    return {
      ...state,
      captions: captions
    }
  },
  [originCaptionActionType.setEndTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', originCaptionActionType.setEndTime);
      return state;
    }

    const { paragraphIndex, lineIndex } = action.payload;
    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', originCaptionActionType.setEndTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', originCaptionActionType.setEndTime);
      return state;
    }

    let captions = [...state.captions];
    let paragraph = {
      ...captions[paragraphIndex]
    }

    let lines = paragraph.lines;
    if (lines === undefined) {
      logger.variableIsUndefined('lines', originCaptionActionType.setEndTime);
      return state;
    }

    lines = [...lines];
    let line = {
      ...lines[lineIndex]
    };

    if (line?.words === undefined) {
      logger.variableIsUndefined('line?.words', originCaptionActionType.setEndTime);
      return state;
    }

    const setTime = action.payload.value;
    const startTime = line.words.first().start;
    const endTime = line.words.last().end;

    let nextWords: store.ICaptionsWord[];
    if (endTime - startTime < 1) {
      nextWords = setEndTimeWithTimeResetByTextProportional(line.words, setTime);
    }
    else {
      nextWords = setEndTimeWithTimeResetByTimeProportional(line.words, setTime);
    }

    line.words = nextWords;
    lines.splice(lineIndex, 1, line);
    paragraph.lines = lines;
    captions.splice(paragraphIndex, 1, paragraph);

    return {
      ...state,
      captions: captions
    }
  },
  [originCaptionActionType.setWordStyle]: _setWordStyle,
  [originCaptionActionType.setWordColor]: _setWordStyle,
  [originCaptionActionType.setWordOutlineColor]: _setWordStyle,

  [originCaptionActionType.setLineStyle]: _setLineStyle,
  [originCaptionActionType.setLineBackground]: _setLineStyle,
  [originCaptionActionType.setLineColor]: _setLineStyle,
  [originCaptionActionType.setLineOutlineColor]: _setLineStyle,
  [originCaptionActionType.setDefaultStyle]: (state, action: Action<Partial<store.ISetStylePayload>>) => {
    const { path, style } = action.payload;
    return ParagraphCaptionsHelper.getDefaultStyleState(state, { path, style });
  },
  [originCaptionActionType.setDefaultLocation]: (state, action: Action<Partial<store.ISetLocationPayload>>) => {
    const { path, location } = action.payload;
    return ParagraphCaptionsHelper.getDefaultLocationState(state, { path, location });
  },
  [originCaptionActionType.clearDefaultStyle]: state => {
    const { defaultStyle, ...nextState } = state;
    return nextState;
  },
  [originCaptionActionType.clearDefaultLocation]: state => {
    const { defaultLocation, ...nextState } = state;
    return nextState;
  }
}, { ...initState });

export default reducer;