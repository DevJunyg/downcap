import { Action, createAction, handleActions } from 'redux-actions';
import * as store from 'storeV2';
import "JsExtensions";
import TranslatedCaptionHelper from 'helpers/TranslatedCaptionHelper';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import MathExtensions from 'MathExtensions';
import translatedCaptionActionType from './translatedCaptionActionType';

interface ITranslatedCaptionsState {
  captions?: store.ICaptionTranslatedParagraphWithId[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
}

interface ITranslatedCaptionsUpdateCaptionPayload {
  index: number;
  caption: store.ICaptionTranslatedParagraph
}

interface ITranslatedCaptionsUpdateCaptionMiddlewareResult {
  index: number;
  caption: store.ICaptionTranslatedParagraphWithId
}

interface ITranslatedCaptionsWordIndexPayload {
  captionIndex: number;
  paragraphIndex: number;
  lineIndex: number;
  wordIndex: number;
}

interface ITranslatedCaptionsIndexPayload {
  captionIndex: number;
}

interface ITranslatedCaptionsSetTextPayload {
  path: ITranslatedCaptionsWordIndexPayload;
  text: string;
}

interface ITranslatedCaptionsSetOriginTextPayload {
  path: ITranslatedCaptionsIndexPayload;
  text: string;
}

const logger = ReactLoggerFactoryHelper.build('translatedCaption');

const initState: ITranslatedCaptionsState = {};

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

export const addCaptions = createAction(
  translatedCaptionActionType.addCaptions,
  (captions: store.ICaptionTranslatedParagraph[]) => TranslatedCaptionHelper.giveIdToCaptions('translated', captions, { overwrite: false })
);

export const updateCaptions = createAction(
  translatedCaptionActionType.updateCaptions,
  (payload: ITranslatedCaptionsUpdateCaptionPayload): ITranslatedCaptionsUpdateCaptionPayload => ({
    index: payload.index,
    caption: TranslatedCaptionHelper.giveIdToCaption('translated', payload.caption, { overwrite: false })
  })
);

export const updateParagraph = createAction(
  translatedCaptionActionType.updateParagraph,
  (payload: store.IUpdateParagraphPayload): store.IUpdateParagraphPayload => ({
    path: payload.path,
    paragraph: ParagraphCaptionsHelper.giveIdToCaptionsParagraph('translated', payload.paragraph, { overwrite: false })
  })
);
export const removeParagraph = createAction(translatedCaptionActionType.removeParagraph);

export const clearCaptions = createAction(translatedCaptionActionType.clearCaptions);

export const setCaptions = createAction(
  translatedCaptionActionType.setCaptions,
  (captions: store.ICaptionTranslatedParagraph[]) => TranslatedCaptionHelper.giveIdToCaptions('translated', captions, { overwrite: false })
);

export const setText = createAction<ITranslatedCaptionsSetTextPayload>(translatedCaptionActionType.setText);
export const setOriginText = createAction<ITranslatedCaptionsSetOriginTextPayload>(translatedCaptionActionType.setOriginText);
export const updateCaptionById = createAction(
  translatedCaptionActionType.updateCaptionById,
  (captions: store.ICaptionTranslatedParagraph) => TranslatedCaptionHelper.giveIdToCaption('translated', captions, { overwrite: false })
);

export const setTextByCaptionId = createAction<store.ICaptionTranslatedParagraph>(translatedCaptionActionType.setTextByCaptionId);
export const setWordStyle = createAction<store.ISetStylePayload>(translatedCaptionActionType.setWordStyle);
export const setWordColor = createAction<store.ISetStylePayload>(translatedCaptionActionType.setWordColor);
export const setWordOutlineColor = createAction<store.ISetStylePayload>(translatedCaptionActionType.setWordOutlineColor);
export const setLineStyle = createAction<store.ISetStylePayload>(translatedCaptionActionType.setLineStyle);
export const setLineBackground = createAction<store.ISetStylePayload>(translatedCaptionActionType.setLineBackground);
export const setLineColor = createAction<store.ISetStylePayload>(translatedCaptionActionType.setLineColor);
export const setLineOutlineColor = createAction<store.ISetStylePayload>(translatedCaptionActionType.setLineOutlineColor);
export const setDefaultStyle = createAction<Partial<store.ISetStylePayload>>(translatedCaptionActionType.setDefaultStyle);
export const setDefaultLocation = createAction<Partial<store.ISetLocationPayload>>(translatedCaptionActionType.setDefaultLocation);
export const setStartTime = createAction<store.ISetValueWidthIndexPath<number>>(translatedCaptionActionType.setStartTime);
export const setEndTime = createAction<store.ISetValueWidthIndexPath<number>>(translatedCaptionActionType.setEndTime);
export const clearDefaultStyle = createAction<void>(translatedCaptionActionType.clearDefaultStyle);
export const clearDefaultLocation = createAction<void>(translatedCaptionActionType.clearDefaultLocation);

function _updateCaptionById(state: ITranslatedCaptionsState, action: Action<store.ICaptionTranslatedParagraphWithId>) {
  let captions = [...state.captions!];
  let captionIndex = TranslatedCaptionHelper.getCaptionIndexById(captions, action.payload.id);
  if (captionIndex < 0) {
    logger.logWarning('The caption corresponding to the Id could not be found.')
    return state;
  }

  captions[captionIndex] = { ...action.payload };
  return { ...state, captions: captions };
}

function _setLineStyle(state: ITranslatedCaptionsState, action: Action<store.ISetStylePayload>) {
  const { path, style } = action.payload;

  if (path.captionIndex === undefined) {
    return state;
  }

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

  let captions = [...state.captions!];
  let caption = state.captions![path.captionIndex];

  const paragraphs = ParagraphCaptionsHelper.updateLineValue(
    state.captions![path.captionIndex].paragraphs,
    linePath,
    'style',
    style
  )

  caption = {
    ...caption,
    paragraphs: paragraphs
  }
  captions[path.captionIndex!] = caption;

  return {
    ...state,
    captions: captions
  };
}

function _setWordStyle(state: ITranslatedCaptionsState, action: Action<store.ISetStylePayload>) {
  const { path, style } = action.payload;

  if (path.captionIndex === undefined) {
    return state;
  }

  if (path.lineIndex === undefined) {
    return state;
  }

  if (path.paragraphIndex === undefined) {
    return state;
  }

  if (path.wordIndex === undefined) {
    return state;
  }

  const wordPath = {
    lineIndex: path.lineIndex,
    paragraphIndex: path.paragraphIndex,
    wordIndex: path.wordIndex
  };

  let captions = [...state.captions!];
  let caption = state.captions![path.captionIndex];

  const paragraphs = ParagraphCaptionsHelper.updateWordValue(
    state.captions![path.captionIndex].paragraphs,
    wordPath,
    'style',
    style
  )

  caption = {
    ...caption,
    paragraphs: paragraphs
  }

  captions[path.captionIndex!] = caption;
  return {
    ...state,
    captions: captions
  };
}

const reducer = handleActions<ITranslatedCaptionsState, any>({
  [translatedCaptionActionType.addCaptions]: (state, action: Action<store.ICaptionTranslatedParagraphWithId[]>) => {
    let captions = state.captions ? [...state.captions] : [];
    captions = [...captions, ...action.payload];
    return {
      ...state,
      captions: captions
    };
  },
  [translatedCaptionActionType.clearCaptions]: state => {
    const { captions, ...nextState } = state;
    return nextState;
  },
  [translatedCaptionActionType.updateCaptions]: (state, action: Action<ITranslatedCaptionsUpdateCaptionMiddlewareResult>) => {
    let { caption, index } = action.payload;
    let captions = [...state.captions ?? []];
    captions[index] = caption;

    return {
      ...state,
      captions: captions
    };
  },
  [translatedCaptionActionType.setCaptions]: (state, action: Action<store.ICaptionTranslatedParagraphWithId[]>) => {
    return {
      ...state,
      captions: [...action.payload]
    }
  },
  [translatedCaptionActionType.updateParagraph]: (state, action: Action<store.IUpdateParagraphPayload>) => {
    const { path, paragraph } = action.payload;
    const { captionIndex, paragraphIndex } = path;

    let captions = [...state.captions!];
    let caption = { ...captions[captionIndex!] };
    let paragraphs = [...caption.paragraphs];

    paragraphs[paragraphIndex!] = { ...paragraph };
    caption.paragraphs = paragraphs;
    captions[captionIndex!] = caption;

    return {
      ...state,
      captions: captions
    };
  },
  [translatedCaptionActionType.removeParagraph]: (state, action: Action<store.IUpdateParagraphPayload>) => {
    const { path } = action.payload;
    const { captionIndex, paragraphIndex } = path;

    let captions = [...state.captions!];
    let caption = { ...captions[captionIndex!] };
    let paragraphs = [...caption.paragraphs];

    paragraphs.splice(paragraphIndex!, 1);
    caption.paragraphs = paragraphs;
    captions[captionIndex!] = caption;

    return {
      ...state,
      captions: captions
    };
  },
  [translatedCaptionActionType.setText]: (state, action: Action<ITranslatedCaptionsSetTextPayload>) => {
    const {
      path: { captionIndex, wordIndex, lineIndex, paragraphIndex },
      text
    } = action.payload;

    let captions = [...state.captions!];
    let caption = { ...captions[captionIndex] };
    let paragraphs = [...caption.paragraphs];
    let paragraph = { ...paragraphs[paragraphIndex] };
    let lines = [...paragraph.lines];
    let line = { ...lines[lineIndex] };
    let words = [...line.words];
    let word = { ...words[wordIndex], text: text };

    words[wordIndex] = word
    line.words = words;
    lines[lineIndex] = line;
    paragraph.lines = lines;
    paragraphs[paragraphIndex] = paragraph;
    caption.paragraphs = paragraphs;
    captions[captionIndex] = caption;

    return { ...state, captions: captions };
  },
  [translatedCaptionActionType.setOriginText]: (state, action: Action<ITranslatedCaptionsSetOriginTextPayload>) => {
    const {
      path: { captionIndex },
      text
    } = action.payload;


    let captions = [...state.captions!];
    let caption = { ...captions[captionIndex], origin: text };

    captions[captionIndex] = caption;

    return { ...state, captions: captions };
  },
  [translatedCaptionActionType.updateCaptionById]: _updateCaptionById,
  [translatedCaptionActionType.setTextByCaptionId]: _updateCaptionById,  
  [translatedCaptionActionType.setWordStyle]: _setWordStyle,
  [translatedCaptionActionType.setWordColor]: _setWordStyle,
  [translatedCaptionActionType.setWordOutlineColor]: _setWordStyle,

  [translatedCaptionActionType.setLineStyle]: _setLineStyle,
  [translatedCaptionActionType.setLineBackground]: _setLineStyle,
  [translatedCaptionActionType.setLineColor]: _setLineStyle,
  [translatedCaptionActionType.setLineOutlineColor]: _setLineStyle,
  [translatedCaptionActionType.setDefaultStyle]: (state, action: Action<Partial<store.ISetStylePayload>>) => {
    const { path, style } = action.payload;
    return TranslatedCaptionHelper.getDefaultStyleState(state, { path, style });
  },
  [translatedCaptionActionType.setDefaultLocation]: (state, action: Action<Partial<store.ISetLocationPayload>>) => {
    const { path, location } = action.payload;
    return TranslatedCaptionHelper.getDefaultLocationState(state, { path, location });
  },
  [translatedCaptionActionType.setStartTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', translatedCaptionActionType.setStartTime);
      return state;
    }

    const { captionIndex, paragraphIndex, lineIndex } = action.payload;
    if (captionIndex === undefined) {
      logger.variableIsUndefined('captionIndex', translatedCaptionActionType.setStartTime);
      return state;
    }

    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', translatedCaptionActionType.setStartTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', translatedCaptionActionType.setStartTime);
      return state;
    }

    let captions = [...state.captions];
    let caption = {
      ...captions[captionIndex]
    }

    let paragraphs = caption.paragraphs;
    if (paragraphs === undefined) {
      logger.variableIsUndefined('paragraphs', translatedCaptionActionType.setStartTime);
      return state;
    }

    paragraphs = [...paragraphs];
    let paragraph = {
      ...paragraphs[paragraphIndex]
    };

    let lines = paragraph.lines;
    if (lines === undefined) {
      logger.variableIsUndefined('lines', translatedCaptionActionType.setStartTime);
      return state;
    }

    lines = [...lines];
    let line = {
      ...lines[lineIndex]
    };

    if (line?.words === undefined) {
      logger.variableIsUndefined('line?.words', translatedCaptionActionType.setStartTime);
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
    paragraphs.splice(paragraphIndex, 1, paragraph);
    caption.paragraphs = paragraphs;
    captions.splice(captionIndex, 1, caption);

    return {
      ...state,
      captions: captions
    }
  },
  [translatedCaptionActionType.setEndTime]: (state, action: Action<store.ISetValueWidthIndexPath<number>>) => {
    if (state.captions === undefined) {
      logger.variableIsUndefined('state.captions', translatedCaptionActionType.setEndTime);
      return state;
    }

    const { captionIndex, paragraphIndex, lineIndex } = action.payload;
    if (captionIndex === undefined) {
      logger.variableIsUndefined('captionIndex', translatedCaptionActionType.setEndTime);
      return state;
    }

    if (paragraphIndex === undefined) {
      logger.variableIsUndefined('paragraphIndex', translatedCaptionActionType.setEndTime);
      return state;
    }

    if (lineIndex === undefined) {
      logger.variableIsUndefined('lineIndex', translatedCaptionActionType.setEndTime);
      return state;
    }

    let captions = [...state.captions];
    let caption = {
      ...captions[captionIndex]
    }

    let paragraphs = caption.paragraphs;
    if (paragraphs === undefined) {
      logger.variableIsUndefined('paragraphs', translatedCaptionActionType.setEndTime);
      return state;
    }

    paragraphs = [...paragraphs];
    let paragraph = {
      ...paragraphs[paragraphIndex]
    };

    let lines = paragraph.lines;
    if (lines === undefined) {
      logger.variableIsUndefined('lines', translatedCaptionActionType.setEndTime);
      return state;
    }

    lines = [...lines];
    let line = {
      ...lines[lineIndex]
    };

    if (line?.words === undefined) {
      logger.variableIsUndefined('line?.words', translatedCaptionActionType.setEndTime);
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
    paragraphs.splice(paragraphIndex, 1, paragraph);
    caption.paragraphs = paragraphs;
    captions.splice(captionIndex, 1, caption);

    return {
      ...state,
      captions: captions
    }
  },
  [translatedCaptionActionType.clearDefaultStyle]: state => {
    const { defaultStyle, ...nextState } = state;
    return nextState;
  },
  [translatedCaptionActionType.clearDefaultLocation]: state => {
    const { defaultLocation, ...nextState } = state;
    return nextState;
  }
}, { ...initState });

export default reducer;