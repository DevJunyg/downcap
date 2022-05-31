import IpcSender from 'lib/IpcSender';
import { Action } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';
import * as store from 'storeV2';

import * as translateMultiLineActions from './modules/translatedMultiline';
import * as segaActionTypes from "./sagaActionTypes";
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import IdGenerator from 'storeV2/IdGenerator';
import i18n from 'i18n';

export interface ITranslateMultilineUpdatePayload {
  originCaption: store.ICaptionsParagraph;
  translatedCaption: store.ITranslatedMultilineCaption;
}

function* createTranslatedMultilineByOriginMultiline(action: Action<store.ICaptionsParagraph>) {
  const originCaption = action.payload;
  const text = ParagraphCaptionsHelper.toText([originCaption]);
  if (text === undefined) {
    return;
  }

  const start = ParagraphCaptionsHelper.getParagraphStartTime(originCaption);
  const end = ParagraphCaptionsHelper.getParagraphEndTime(originCaption);
  const paragraphId = IdGenerator.getNextId('translatedMultiline', 'paragraph');
  let translatedLine: store.ITranslatedMultilineCaption = {
    id: paragraphId,
    lines: [{
      id: IdGenerator.getNextId('translatedMultiline', 'line'),
      words: [{
        start: start,
        id: IdGenerator.getNextId('translatedMultiline', 'word'),
        end: end,
        text: i18n.t('TranslateMultiLine_Translate_Pending_Description')
      }]
    }],
    meta: {
      sourceId: originCaption.id,
      sourceText: text,
      status: 'Pending'
    }
  };

  if (originCaption.horizontal) {
    translatedLine.horizontal = originCaption.horizontal;
  }

  if (originCaption.vertical) {
    translatedLine.vertical = originCaption.vertical;
  }

  yield put(
    translateMultiLineActions.addCaption(translatedLine)
  );

  const translatedResult = (yield call(IpcSender.invokeTranslateKoToEn, text)) as string;
  const translatedSuceessed = translatedResult !== null;
  const translatedText = translatedSuceessed ?
    translatedResult : i18n.t('TranslateMultiLine_Translate_Failed_Description');

  let lines: store.ICaptionsLine[] = [...translatedLine.lines];
  let line = { ...lines.first() };
  let words: store.ICaptionsWord[] = [...line.words];
  let word: store.ICaptionsWord = {
    ...words.first(),
    text: translatedText
  };

  words = [word];
  line.words = words;
  lines = [line];

  translatedLine = {
    ...translatedLine,
    lines: lines,
    meta: {
      ...translatedLine.meta,
      status: translatedSuceessed ? 'Successed' : 'Failed'
    }
  }

  if (translatedSuceessed) {
    translatedLine = {
      ...translatedLine,
      meta: {
        ...translatedLine.meta,
        translatedText: translatedText
      }
    }
  }

  yield put(translateMultiLineActions.updateCaptionById(translatedLine));
}

function* updateTranslateMultiLine(action: Action<ITranslateMultilineUpdatePayload>) {
  const { originCaption, translatedCaption } = action.payload
  const text = ParagraphCaptionsHelper.toText([originCaption]);
  if (text === undefined) {
    return;
  }

  const tranlsatedText = ParagraphCaptionsHelper.toText([translatedCaption]);
  let nextCaption: store.ITranslatedMultilineCaption = { ...translatedCaption };
  if (translatedCaption.meta?.translatedText === tranlsatedText
    && translatedCaption.meta?.sourceText !== text
  ) {
    let lines = [...nextCaption.lines];
    let line: store.ICaptionsLine = { ...lines.first() }
    let words = [...line.words];
    let word: store.ICaptionsWord = {
      ...words.first(),
      text: i18n.t('TranslateMultiLine_Translate_Pending_Description')
    };

    words[0] = word;
    line.words = words;
    lines[0] = line;

    nextCaption = {
      ...nextCaption,
      lines: lines,
      meta: {
        ...nextCaption.meta,
        sourceText: text,
        status: 'Pending',
      }
    }

    yield put(translateMultiLineActions.updateCaptionById(nextCaption));
    const translatedResult = (yield call(IpcSender.invokeTranslateKoToEn, text)) as string;
    const translatedSuceessed = translatedResult !== null;
    const nextTranslatedText = translatedSuceessed ?
      translatedResult : i18n.t('TranslateMultiLine_Translate_Failed_Description');
    lines = [...nextCaption.lines];
    line = { ...lines.first() }
    words = [...line.words];
    word = {
      ...words.first(),
      text: nextTranslatedText
    };

    words[0] = word;
    line.words = words;
    lines[0] = line;

    nextCaption = {
      ...nextCaption,
      lines: lines,
      meta: {
        ...nextCaption.meta,
        sourceText: text,
        status: translatedSuceessed ? 'Successed' : 'Failed',
      }
    }

    if (translatedSuceessed) {
      nextCaption = {
        ...nextCaption,
        meta: {
          ...nextCaption.meta,
          translatedText: nextTranslatedText
        }
      }
    }
  }

  yield put(translateMultiLineActions.updateCaptionById(nextCaption));
}

function* addTranslateMultiLine(action: Action<store.ITranslatedMultilineCaption>) {
  const caption = action.payload;
  const text = ParagraphCaptionsHelper.toText([caption]);

  if (text === undefined) {
    return;
  }

  const start = ParagraphCaptionsHelper.getParagraphStartTime(caption);
  const end = ParagraphCaptionsHelper.getParagraphEndTime(caption);
  const paragraphId = IdGenerator.getNextId('translatedMultiline', 'paragraph');
  let translatedLine: store.ITranslatedMultilineCaption = {
    id: paragraphId,
    lines: [{
      id: IdGenerator.getNextId('translatedMultiline', 'line'),
      words: [{
        id: IdGenerator.getNextId('translatedMultiline', 'word'),
        start: start,
        end: end,
        text: i18n.t('TranslateMultiLine_Translate_Pending_Description')
      }]
    }],
    meta: {
      sourceId: caption.id,
      sourceText: text,
      status: 'Pending'
    }
  };

  yield put(translateMultiLineActions.addCaption(translatedLine));

  const translatedResult = (yield call(IpcSender.invokeTranslateKoToEn, text)) as string;
  const translatedSuceessed = translatedResult !== null;
  const translatedText = translatedSuceessed ? translatedResult : i18n.t('TranslateMultiLine_Translate_Failed_Description');

  let lines: store.ICaptionsLine[] = [...translatedLine.lines];
  let line = { ...lines.first() };
  let words: store.ICaptionsWord[] = [...line.words];
  let word: store.ICaptionsWord = {
    ...words.first(),
    text: translatedText
  };

  words = [word];
  line.words = words;
  lines = [line];

  translatedLine = {
    ...translatedLine,
    lines: lines,
    meta: {
      ...translatedLine.meta,
      status: translatedSuceessed ? 'Successed' : 'Failed'
    }
  }

  if (translatedSuceessed) {
    translatedLine = {
      ...translatedLine,
      meta: {
        ...translatedLine.meta,
        translatedText: translatedText
      }
    }
  }

  yield put(translateMultiLineActions.updateCaptionById(translatedLine));
}

// Starts fetchUser on each dispatched USER_FETCH_REQUESTED action
// Allows concurrent fetches of user
export default function* sagas() {
  yield takeEvery(segaActionTypes.CREATE_TRANSLATE_MULTILINE, createTranslatedMultilineByOriginMultiline);
  yield takeEvery(segaActionTypes.ADD_TRANSLATE_MULTILINE, addTranslateMultiLine);
  yield takeEvery(segaActionTypes.UPDATE_TRANSLATE_MULTILINE, updateTranslateMultiLine);
}
