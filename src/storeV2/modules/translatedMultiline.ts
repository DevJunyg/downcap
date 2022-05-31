import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import { handleActions, createAction, Action } from 'redux-actions';
import * as store from 'storeV2';
import translatedMultilineActionType from './translatedMultilineActionType'

interface ITranslatedMultilineState {
  captions?: store.ITranslatedMultilineCaption[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
  checkpoint?: number;
}

const logger = ReactLoggerFactoryHelper.build('Store.translatedMultiline');

const initialState: Readonly<ITranslatedMultilineState> = Object.freeze({});

const updateStartTimeAction: store.UpdateTimeActionType<store.ITranslatedMultilineCaption> = (caption, time) => {
  return ParagraphCaptionsHelper.updateWordValue(
    [caption],
    { paragraphIndex: 0, lineIndex: 0, wordIndex: 0 },
    'start',
    time
  )?.first();
}

const updateEndTimeAction: store.UpdateTimeActionType<store.ITranslatedMultilineCaption> = (caption, time) => {
  const lineIndex = caption.lines.length - 1;
  const wordIndex = caption.lines[lineIndex].words.length - 1;

  return ParagraphCaptionsHelper.updateWordValue(
    [caption],
    { paragraphIndex: 0, lineIndex: lineIndex, wordIndex: wordIndex },
    'end',
    time
  )?.first();
}

const addTimeUpdateAction = (
  payload: store.IUpdateTimePayload,
  timeUpdateAction: store.UpdateTimeActionType<store.ITranslatedMultilineCaption>
) => ({
  ...payload,
  timeUpdateAction: timeUpdateAction
} as store.IUpdateTimeInternalPayload<store.ITranslatedMultilineCaption>)

const setStartTimeUpdateAction = (payload: store.IUpdateTimePayload) => addTimeUpdateAction(payload, updateStartTimeAction);
const setEndTimeUpdateAction = (payload: store.IUpdateTimePayload) => addTimeUpdateAction(payload, updateEndTimeAction);

export const addCaption = createAction(
  translatedMultilineActionType.addCaption,
  (paragraph: store.ITranslatedMultilineCaption) => ParagraphCaptionsHelper.giveIdToCaptionsParagraph(
    'translatedMultiline',
    paragraph,
    { overwrite: false }
  )
);

export const setCaptions = createAction(
  translatedMultilineActionType.setCaptions,
  (captions => ParagraphCaptionsHelper.giveIdToCaptions('multiline', captions, { overwrite: false })) as {
    (captions: store.ITranslatedMultilineCaption[]): store.ITranslatedMultilineCaption[]
  }
);

export const removeCaption = createAction<number>(translatedMultilineActionType.removeCaption);
export const setText = createAction<store.ISetTextPayload>(translatedMultilineActionType.setText);
export const setStartTime = createAction(translatedMultilineActionType.setTime, setStartTimeUpdateAction);
export const setEndTime = createAction(translatedMultilineActionType.setTime, setEndTimeUpdateAction);
export const setCheckPoint = createAction<number>(translatedMultilineActionType.setCheckPoint);
export const updateCaptionById = createAction(
  translatedMultilineActionType.updateCaptionById,
  (captions: store.ITranslatedMultilineCaption) => ParagraphCaptionsHelper.giveIdToCaptionsParagraph(
    'translatedMultiline',
    captions,
    { overwrite: false }
  )
);
export const setWordStyle = createAction<store.ISetStylePayload>(translatedMultilineActionType.setWordStyle);
export const setWordColor = createAction<store.ISetStylePayload>(translatedMultilineActionType.setWordColor);
export const setWordOutlineColor = createAction<store.ISetStylePayload>(translatedMultilineActionType.setWordOutlineColor);
export const setLineStyle = createAction<store.ISetStylePayload>(translatedMultilineActionType.setLineStyle);
export const setLineBackground = createAction<store.ISetStylePayload>(translatedMultilineActionType.setLineBackground);
export const setLineColor = createAction<store.ISetStylePayload>(translatedMultilineActionType.setLineColor);
export const setLineOutlineColor = createAction<store.ISetStylePayload>(translatedMultilineActionType.setLineOutlineColor);
export const reset = createAction(translatedMultilineActionType.reset, () => ({ ...initialState }));
export const updateParagraph = createAction(
  translatedMultilineActionType.updateParagraph,
  (payload: store.IUpdateParagraphPayload): store.IUpdateParagraphPayload<store.ITranslatedMultilineCaption> => ({
    path: payload.path,
    paragraph: ParagraphCaptionsHelper.giveIdToCaptionsParagraph(
      'translatedMultiline',
      payload.paragraph,
      { overwrite: false }
    )
  })
);
export const setDefaultStyle = createAction<Partial<store.ISetStylePayload>>(translatedMultilineActionType.setDefaultStyle);
export const setDefaultLocation = createAction<Partial<store.ISetLocationPayload>>(translatedMultilineActionType.setDefaultLocation);

function _setLineStyle(state: ITranslatedMultilineState, action: Action<store.ISetStylePayload>) {
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

function _setWordStyle(state: ITranslatedMultilineState, action: Action<store.ISetStylePayload>) {
  return ParagraphCaptionsHelper.setWordStyle(state, action.payload);
}

const reducer = handleActions<ITranslatedMultilineState, any>({
  [translatedMultilineActionType.reset]: (state, action: Action<ITranslatedMultilineState>) => {
    return {
      ...action.payload
    }
  },
  [translatedMultilineActionType.setCheckPoint]: (state, action: Action<number>) => {
    return {
      ...state,
      checkpoint: action.payload
    }
  },
  [translatedMultilineActionType.updateCaptionById]: (state, action: Action<store.ITranslatedMultilineCaption>) => {
    let captions = [...state.captions ?? []];
    let captionIndex = ParagraphCaptionsHelper.getCaptionIndexById(captions, action.payload.id!);
    if (captionIndex < 0) {
      logger.logWarning('The caption corresponding to the Id could not be found.');
      return state;
    }

    captions[captionIndex] = { ...action.payload };
    return { ...state, captions: captions };
  },
  [translatedMultilineActionType.setTime]: (state, action: Action<store.IUpdateTimeInternalPayload<store.ITranslatedMultilineCaption>>) => {
    let captions = [...state.captions!];
    const { time, caption, timeUpdateAction } = action.payload;
    const index = ParagraphCaptionsHelper.getCaptionIndexById(captions, caption.id!);
    captions.splice(index, 1);
    const nextCaption = timeUpdateAction(caption, time);
    const insertIndex = BinarySearchHelper.findInsertIndex(
      captions,
      nextCaption,
      (left, right) => -ComparerHelper.multitlieCompare(left, right)
    );

    captions.splice(insertIndex, 0, nextCaption);
    return {
      ...state,
      captions: captions
    }
  },
  [translatedMultilineActionType.addCaption]: (state, action: Action<store.ITranslatedMultilineCaption>) => {
    const caption = action.payload;
    let captions = [...state.captions ?? []];

    const insertIndex = BinarySearchHelper.findInsertIndex(
      captions,
      caption,
      (left, right) => -ComparerHelper.multitlieCompare(left, right)
    );

    captions.splice(insertIndex, 0, caption);

    return {
      ...state,
      captions: captions
    }
  },
  [translatedMultilineActionType.setText]: (state, action: Action<store.ISetTextPayload>) => {
    const { path, text } = action.payload;

    let captions = ParagraphCaptionsHelper.updateWordValue(
      state.captions!,
      path,
      'text',
      text
    );

    return {
      ...state,
      captions: captions
    }
  },
  [translatedMultilineActionType.setWordStyle]: _setWordStyle,
  [translatedMultilineActionType.setWordColor]: _setWordStyle,
  [translatedMultilineActionType.setWordOutlineColor]: _setWordStyle,

  [translatedMultilineActionType.setLineStyle]: _setLineStyle,
  [translatedMultilineActionType.setLineBackground]: _setLineStyle,
  [translatedMultilineActionType.setLineColor]: _setLineStyle,
  [translatedMultilineActionType.setLineOutlineColor]: _setLineStyle,
  [translatedMultilineActionType.updateParagraph]: (state, action: Action<store.IUpdateParagraphPayload<store.ITranslatedMultilineCaption>>) => {
    const { path, paragraph } = action.payload;

    let nextCaptions = [...state.captions!];
    let nextParagraph = { ...paragraph };
    nextCaptions[path.paragraphIndex!] = nextParagraph;

    return {
      ...state,
      captions: nextCaptions
    };
  },
  [translatedMultilineActionType.setDefaultStyle]: (state, action: Action<Partial<store.ISetStylePayload>>) => {
    const { path, style } = action.payload;
    return ParagraphCaptionsHelper.getDefaultStyleState(state, { path, style });
  },
  [translatedMultilineActionType.setDefaultLocation]: (state, action: Action<Partial<store.ISetLocationPayload>>) => {
    const { path, location } = action.payload;
    return ParagraphCaptionsHelper.getDefaultLocationState(state, { path, location });
  },
  [translatedMultilineActionType.removeCaption]: (state, action: Action<number>) => {
    if (state.captions === undefined) {
      return { ...state };
    }

    if (state.captions.length === 0) {
      return { ...state };
    }

    let captions = [...state.captions];
    captions.splice(action.payload, 1);

    return {
      ...state,
      captions: captions
    }
  },
  [translatedMultilineActionType.setCaptions]: (state, action: Action<store.ITranslatedMultilineCaption[]>) => {
    return {
      ...state,
      captions: action.payload
    }
  }
}, initialState);

export default reducer;