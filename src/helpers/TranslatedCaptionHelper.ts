import { ITimeText } from "models";
import { ICaptionsParagraph } from "storeV2";
import IdGenerator, { IdFieldDictionary } from "storeV2/IdGenerator";
import ParagraphCaptionsHelper, { IGiveIdOptions, NullablePartial } from "./ParagraphCaptionsHelper";
import * as store from 'storeV2';
import { ArgumentNullError, ArgumentUndefinedError, IndexOutOfRangeError } from "errors";
import ArrayHelper from "lib/ArrayHelper";
import MathExtensions from "MathExtensions";
import downcapOptions from "downcapOptions";
import BinarySearchHelper from "lib/BinarySearchHelper";
import ComparerHelper from "lib/ComparerHelper";
import { IHighlightMeta } from "containers/captions";
import { ICaptionEventMeta } from "components/caption/CaptionInput";

interface ICaptionsConcatResult {
  nextCursorMeta: Required<store.IIndexPath>;
  captions: store.ICaptionTranslatedParagraphWithId[]
}

interface IOriginCaptionsConcatResult {
  nextCursorMeta: Required<Pick<store.IIndexPath, 'captionIndex' | 'cursorIndex'>>;
  captions: store.ICaptionTranslatedParagraphWithId[]
}

interface ITranslatedCaptionState {
  captions?: store.ICaptionTranslatedParagraphWithId[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
}

export default class TranslatedCaptionHelper {
  static updateLineValue<T extends keyof store.ICaptionsLine>(
    translatedParagraphs: store.ICaptionTranslatedParagraphWithId[],
    linePath: Required<Omit<store.IIndexPath, 'cursorIndex' | 'wordIndex'>>,
    key: T,
    value: store.ICaptionsLine[T] | null
  ): store.ICaptionTranslatedParagraphWithId[] {
    if (value !== null && typeof value === "object") {
      value = { ...(value as object) } as store.ICaptionsLine[T];
    }

    let translatedParagraph = { ...translatedParagraphs[linePath.captionIndex] };

    let paragraphs = ParagraphCaptionsHelper.updateLineValue(translatedParagraph.paragraphs, linePath, key, value);
    translatedParagraph.paragraphs = paragraphs;

    let nextTranslatedParagraphs = [...translatedParagraphs];
    nextTranslatedParagraphs[linePath.captionIndex] = translatedParagraph;

    return nextTranslatedParagraphs;
  }

  static translatedParagraphToParagraph(caption: store.ICaptionTranslatedParagraphWithId[] | undefined) {
    return caption?.map(line => line.paragraphs).flat();
  }

  static textToParagrahsCaption(text: string, start: number, end: number, spliitLength = downcapOptions.defaultSplitValue.translated): ICaptionsParagraph[] {
    const words = text.split(' ');
    const length = words.reduce((acc, word) => acc += word.length + 1, 0);
    const dt = (end - start) / length;
    let index = 0;
    const timeTexts = words.map<ITimeText>(word => {
      const wordStartTime = start + (index * dt);
      const wordEndTime = wordStartTime + (word.length + 1) * dt;
      index += (word.length + 1);

      return {
        start: MathExtensions.round(wordStartTime, 3),
        end: MathExtensions.round(wordEndTime, 3),
        text: word
      }
    });

    let wordLength = 0;
    let paragrahs: ICaptionsParagraph[] = []
    let lineWords: store.ICaptionsWord[] = [];
    for (const timeText of timeTexts) {
      lineWords.push(timeText);
      wordLength += timeText.text.length;
      if (spliitLength < wordLength) {
        paragrahs.push({
          lines: [{
            words: lineWords
          }]
        });
        lineWords = [];
        wordLength = 0;
      }
    }

    if (wordLength !== 0) {
      paragrahs.push({
        lines: [{
          words: lineWords
        }]
      });
    }

    return paragrahs;
  }

  static giveIdToCaption(id: keyof IdFieldDictionary, caption: store.ICaptionTranslatedParagraph, options: IGiveIdOptions)
    : store.ICaptionTranslatedParagraphWithId {
    if (caption === null) {
      throw new ArgumentNullError('captions')
    }

    if (caption === undefined) {
      throw new ArgumentUndefinedError('captions')
    }

    let paragrahs = caption.paragraphs.map(paragrah => {
      return ParagraphCaptionsHelper.giveIdToCaptionsParagraph(id, paragrah, options);
    });

    if (!ArrayHelper.isFastEquals(caption.paragraphs, paragrahs)) {
      caption = {
        ...caption,
        paragraphs: paragrahs
      }
    }

    if (caption.id === undefined || options.overwrite) {
      caption = {
        ...caption,
        id: IdGenerator.getNextId('translated', 'caption')
      }
    }

    return caption as store.ICaptionTranslatedParagraphWithId;
  }

  static giveIdToCaptions(id: keyof IdFieldDictionary, captions: store.ICaptionTranslatedParagraph[], options: IGiveIdOptions)
    : store.ICaptionTranslatedParagraphWithId[] {
    if (captions === null) {
      throw new ArgumentNullError('captions')
    }

    if (captions === undefined) {
      throw new ArgumentUndefinedError('captions')
    }

    const nextCaptions = captions.map(caption => TranslatedCaptionHelper.giveIdToCaption(id, caption, options));

    return ArrayHelper.isFastEquals(captions, nextCaptions)
      ? captions as store.ICaptionTranslatedParagraphWithId[]
      : nextCaptions;
  }

  static findCaptionIndexByTime(
    captions: Pick<store.ICaptionTranslatedParagraphWithId, 'paragraphs'>[],
    currentTime: number
  ): IHighlightMeta | undefined {
    const captionIndex = BinarySearchHelper.findIndex(captions, currentTime, (caption, time) => {
      if (!caption.paragraphs?.any()) {
        return 1;
      }

      const start = caption.paragraphs.first().lines.first().words.first().start;
      const end = caption.paragraphs.last().lines.last().words.last().end;
      const captionTime = ({
        end: end,
        start: start
      });

      return ComparerHelper.compareTimeAndCurrentTime(captionTime, time);
    });

    if (captionIndex < 0) {
      return undefined;
    }

    const paragraphs = captions[captionIndex].paragraphs;
    const paragraphIndex = BinarySearchHelper.findIndex(paragraphs, currentTime, (paragraph, time) => {
      const start = paragraph.lines.first().words.first().start;
      const end = paragraph.lines.last().words.last().end;

      const paragraphTime = ({
        end: end,
        start: start
      });

      return ComparerHelper.compareTimeAndCurrentTime(paragraphTime, time);
    });

    if (paragraphIndex < 0) {
      return {
        captionIndex: captionIndex
      };
    }

    const lineIndex = 0;

    const words = paragraphs[paragraphIndex].lines[lineIndex].words;
    const wordIndex = BinarySearchHelper.findIndex(words, currentTime, (word, time) => {
      const wordTime = ({
        end: word.end,
        start: word.start
      });

      return ComparerHelper.compareTimeAndCurrentTime(wordTime, time);
    });

    if (wordIndex < 0) {
      return {
        captionIndex: captionIndex,
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex
      };
    }

    return {
      captionIndex: captionIndex,
      paragraphIndex: paragraphIndex,
      lineIndex: lineIndex,
      wordIndex: wordIndex
    }
  }

  static getDownIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {

    const { captionIndex, paragraphIndex, wordIndex } = meta;
    const paragrahs = captions[captionIndex].paragraphs;

    if (paragraphIndex + 1 < paragrahs.length) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex + 1,
        wordIndex: Math.min(wordIndex, paragrahs[paragraphIndex + 1].lines.first().words.length - 1),
      });
    }

    if (captionIndex + 1 >= captions.length) {
      return null;
    }

    const lines = captions[captionIndex + 1].paragraphs?.first()?.lines;
    if (!lines?.any()) {
      return null;
    }

    return ({
      ...meta,
      captionIndex: captionIndex + 1,
      paragraphIndex: 0,
      wordIndex: Math.min(wordIndex, lines.first().words.length - 1)
    });
  }

  static getUpIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {
    const { captionIndex, paragraphIndex, wordIndex } = meta;
    const paragrahs = captions[captionIndex].paragraphs;

    if (paragraphIndex > 0) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex - 1,
        wordIndex: Math.min(wordIndex, paragrahs[paragraphIndex - 1].lines.last().words.length - 1),
      });
    }

    if (captionIndex > 0) {
      return ({
        ...meta,
        captionIndex: captionIndex - 1,
        paragraphIndex: captions[captionIndex - 1].paragraphs.length - 1,
        wordIndex: Math.min(wordIndex, captions[captionIndex - 1].paragraphs.last().lines.last().words.length - 1),
      });
    }

    return null;
  }

  static getLeftIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {
    const { captionIndex, paragraphIndex, wordIndex } = meta;

    if (wordIndex > 0) {
      return ({
        ...meta,
        wordIndex: wordIndex - 1,
      });
    }

    const paragrahs = captions[captionIndex].paragraphs;
    if (paragraphIndex > 0) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex - 1,
        wordIndex: paragrahs[paragraphIndex - 1].lines.first().words.length - 1,
      });
    }

    if (captionIndex > 0) {
      const prevParagrahs = captions[captionIndex - 1].paragraphs;
      const lastPrevParagrahsIndex = prevParagrahs.length - 1;

      return ({
        ...meta,
        captionIndex: captionIndex - 1,
        paragraphIndex: lastPrevParagrahsIndex,
        wordIndex: prevParagrahs[lastPrevParagrahsIndex].lines.last().words.length - 1,
      });
    }

    return null;
  }

  static getRightIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {
    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = meta;

    const paragrahs = captions[captionIndex].paragraphs;
    const line = paragrahs[paragraphIndex].lines[lineIndex];

    if (line && wordIndex + 1 < line.words.length) {
      return ({
        ...meta,
        wordIndex: wordIndex + 1,
      });
    }

    if (paragraphIndex + 1 < paragrahs.length) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex + 1,
        wordIndex: 0
      });
    }

    if (captionIndex + 1 >= captions.length) {
      return null;
    }

    const lines = captions[captionIndex + 1].paragraphs?.first()?.lines;
    if (!lines?.any()) {
      return null;
    }

    return ({
      ...meta,
      captionIndex: captionIndex + 1,
      paragraphIndex: 0,
      wordIndex: 0,
    });
  }

  static getLineUpIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {
    const { captionIndex, paragraphIndex } = meta;

    if (paragraphIndex > 0) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex - 1
      });
    }

    if (captionIndex > 0) {
      return ({
        ...meta,
        captionIndex: captionIndex - 1,
        paragraphIndex: captions[captionIndex - 1].paragraphs.length - 1
      });
    }

    return null;
  }

  static getLineDownIndex(
    captions: store.ICaptionTranslatedParagraphWithId[],
    meta: Required<ICaptionEventMeta>
  ): Required<ICaptionEventMeta> | null {
    const { captionIndex, paragraphIndex } = meta;
    const paragrahs = captions[captionIndex].paragraphs;

    if (paragraphIndex + 1 < paragrahs.length) {
      return ({
        ...meta,
        paragraphIndex: paragraphIndex + 1
      });
    }

    if (captionIndex + 1 >= captions.length) {
      return null;
    }

    const lines = captions[captionIndex + 1].paragraphs?.first()?.lines;
    if (!lines?.any()) {
      return null;
    }

    return ({
      ...meta,
      captionIndex: captionIndex + 1,
      paragraphIndex: 0
    });
  }

  static getPrevWord(captions: readonly store.ICaptionTranslatedParagraphWithId[], index: Required<ICaptionEventMeta>): store.ICaptionsWord | null {
    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = index;

    if (paragraphIndex === 0 && captionIndex > 0) {
      const paragraphs = captions[captionIndex - 1]?.paragraphs;
      return ParagraphCaptionsHelper.getPrevWord(paragraphs, {
        paragraphIndex: paragraphs.length,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      });
    } else {
      return ParagraphCaptionsHelper.getPrevWord(captions[captionIndex].paragraphs, {
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      });
    }
  }

  static getNextWord(captions: readonly store.ICaptionTranslatedParagraphWithId[], index: Required<ICaptionEventMeta>): store.ICaptionsWord | null {
    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = index;
    const paragraphs = captions[captionIndex].paragraphs;

    if (paragraphIndex + 1 >= paragraphs.length && captionIndex + 1 < captions.length) {
      return ParagraphCaptionsHelper.getNextWord(captions[captionIndex + 1].paragraphs, {
        paragraphIndex: 0,
        lineIndex: 0,
        wordIndex: -1
      });
    } else {
      return ParagraphCaptionsHelper.getNextWord(paragraphs, {
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      });
    }
  }

  static splitParagraphInCaptions(
    caption: store.ICaptionTranslatedParagraphWithId,
    path: Required<Omit<store.IIndexPath, 'captionIndex'>>
  ): store.ICaptionTranslatedParagraphWithId {
    caption = { ...caption };
    let paragraphs = [...caption.paragraphs];
    const paragraph = { ...paragraphs[path.paragraphIndex] };

    const splitedParagraphs = ParagraphCaptionsHelper.splitParagraph(paragraph, {
      cursorIndex: path.cursorIndex,
      lineIndex: path.lineIndex,
      wordIndex: path.wordIndex
    });

    paragraphs.splice(path.paragraphIndex, 1, ...splitedParagraphs);
    caption.paragraphs = paragraphs;
    return caption;
  }

  static concatCaptions(
    from: store.ICaptionTranslatedParagraphWithId,
    to: store.ICaptionTranslatedParagraphWithId,
    diraction: 'forward' | 'backward'
  ): store.ICaptionTranslatedParagraphWithId {
    const isForward = diraction === 'forward';
    let first: store.ICaptionTranslatedParagraphWithId, later: store.ICaptionTranslatedParagraphWithId;

    if (isForward) {
      first = { ...from };
      later = { ...to };
    }
    else {
      first = { ...to };
      later = { ...from };
    }

    const firstParagraphs = [...first.paragraphs];
    const fristEnd = firstParagraphs.last().lines.last().words.last().end;

    const laterStart = later.paragraphs.first().lines!.first().words!.first()!.start!;
    if (fristEnd > laterStart) {
      throw new Error('Incorrect concat direction');
    }

    return {
      id: to.id,
      meta: {
        reversTranslateStatus: 'Unstarted',
        translatStatus: 'Edited'
      },
      origin: `${first.origin} ${later.origin}`,
      paragraphs: [...first.paragraphs, ...later.paragraphs],
      revers: `${first.revers} ${later.revers}`
    }
  }

  static concatOriginCaptionsForwardInCaption(
    captions: store.ICaptionTranslatedParagraphWithId[],
    path: Required<Pick<store.IIndexPath, 'captionIndex'>>
  ): IOriginCaptionsConcatResult | null {
    const { captionIndex } = path;

    if (captionIndex <= 0) {
      return null;
    }

    let nextCaptions = [...captions];
    let fromCaption = { ...captions[path.captionIndex] };
    let toCaption = { ...captions[path.captionIndex - 1] }

    if (fromCaption.meta.reversTranslateStatus === "Pending" || fromCaption.meta.translatStatus === "Pending") {
      return null;
    }

    if (toCaption.meta.reversTranslateStatus === "Pending" || toCaption.meta.translatStatus === "Pending") {
      return null;
    }

    const concatCaption = TranslatedCaptionHelper.concatCaptions(fromCaption, toCaption, "backward");
    nextCaptions.splice(path.captionIndex - 1, 2, concatCaption);

    return {
      captions: nextCaptions,
      nextCursorMeta: {
        captionIndex: captionIndex - 1,
        cursorIndex: toCaption.origin.length + 1
      }
    }
  }

  static splitOriginCaption(
    caption: store.ICaptionTranslatedParagraphWithId,
    path: Required<Pick<store.IIndexPath, | 'cursorIndex'>>
  ): store.ICaptionTranslatedParagraph[] {
    const origin = caption.origin;
    const cursorIndex = path.cursorIndex;

    if (cursorIndex <= 0 || cursorIndex >= origin.length) {
      throw new IndexOutOfRangeError('cursorIndex must be greater than or equal to 0 and the sentence must be less than its length.');
    }

    const prevOrigin = caption.origin.substring(0, cursorIndex);
    const laterOrigin = caption.origin.substring(cursorIndex);
    const startTime = ParagraphCaptionsHelper.getParagraphStartTime(caption.paragraphs.first())
    const endTime = ParagraphCaptionsHelper.getParagraphEndTime(caption.paragraphs.last());

    const dt = (endTime - startTime) / origin.length;

    const prevStart = startTime;
    const prevEnd = MathExtensions.round(startTime + (dt * prevOrigin.length), 3);

    const laterStart = prevEnd;
    const laterEnd = endTime;
    return [
      createCaptionTranslatedParagraph(prevOrigin, prevStart, prevEnd),
      createCaptionTranslatedParagraph(laterOrigin, laterStart, laterEnd),
    ] as store.ICaptionTranslatedParagraph[];

    function createCaptionTranslatedParagraph(
      originText: string,
      start: number,
      end: number
    ): store.ICaptionTranslatedParagraph {
      return (
        {
          meta: {
            reversTranslateStatus: 'Unstarted',
            translatStatus: 'Unstarted'
          },
          origin: originText,
          paragraphs: [
            {
              lines: [{
                words: [{
                  start: start,
                  end: end,
                  text: ''
                }]
              }]
            }
          ]
        }
      )
    }
  }

  static concatOriginCaptionsBackwardInCaption(
    captions: store.ICaptionTranslatedParagraphWithId[],
    path: Required<Pick<store.IIndexPath, 'captionIndex'>>
  ): IOriginCaptionsConcatResult | null {
    const { captionIndex } = path;

    if (captionIndex + 1 >= captions.length) {
      return null;
    }

    let nextCaptions = [...captions];
    let fromCaption = { ...captions[path.captionIndex] };
    let toCaption = { ...captions[path.captionIndex + 1] }

    if (fromCaption.meta.reversTranslateStatus === "Pending" || fromCaption.meta.translatStatus === "Pending") {
      return null;
    }

    if (toCaption.meta.reversTranslateStatus === "Pending" || toCaption.meta.translatStatus === "Pending") {
      return null;
    }

    const concatCaption = TranslatedCaptionHelper.concatCaptions(fromCaption, toCaption, "forward");
    nextCaptions.splice(path.captionIndex, 2, concatCaption);

    return {
      captions: nextCaptions,
      nextCursorMeta: {
        captionIndex: captionIndex,
        cursorIndex: fromCaption.origin.length
      }
    }
  }

  static concatCaptionsForwardInCaptions(
    captions: store.ICaptionTranslatedParagraphWithId[],
    path: Required<Omit<store.IIndexPath, 'cursorIndex'>>
  ): ICaptionsConcatResult | null {
    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = path;

    let nextCaptions = [...captions];
    if (wordIndex > 0) {
      let caption: store.ICaptionTranslatedParagraphWithId = {
        ...captions[captionIndex]
      }

      const nextParagraphs = ParagraphCaptionsHelper.concatWordInCaptions(
        caption.paragraphs,
        path,
        'forward'
      );

      caption.paragraphs = [...nextParagraphs]
      nextCaptions[captionIndex] = caption;

      const targetWord = captions[captionIndex].paragraphs[paragraphIndex].lines[lineIndex].words[wordIndex - 1];
      const targetIndex = targetWord.text.length;
      return {
        captions: nextCaptions,
        nextCursorMeta: {
          ...path,
          wordIndex: wordIndex - 1,
          cursorIndex: targetIndex
        }
      }
    }


    if (paragraphIndex > 0) {
      let caption: store.ICaptionTranslatedParagraphWithId = {
        ...captions[captionIndex]
      }

      const nextParagraphs = ParagraphCaptionsHelper.concatParagraphInCaptions(
        caption.paragraphs,
        path,
        'forward'
      );

      caption.paragraphs = [...nextParagraphs]
      nextCaptions[captionIndex] = caption;

      const targetWords = captions[captionIndex].paragraphs[paragraphIndex - 1].lines[lineIndex].words;
      return ({
        captions: nextCaptions,
        nextCursorMeta: {
          ...path,
          paragraphIndex: paragraphIndex - 1,
          wordIndex: targetWords.length,
          cursorIndex: 0
        }
      })
    }

    if (captionIndex > 0) {
      let fromCaption = { ...captions[path.captionIndex] };
      let toCaption = { ...captions[path.captionIndex - 1] }

      if (fromCaption.meta.reversTranslateStatus === "Pending" || fromCaption.meta.translatStatus === "Pending") {
        return null;
      }

      if (toCaption.meta.reversTranslateStatus === "Pending" || toCaption.meta.translatStatus === "Pending") {
        return null;
      }

      const concatCaption = TranslatedCaptionHelper.concatCaptions(fromCaption, toCaption, "backward");
      nextCaptions.splice(path.captionIndex - 1, 2, concatCaption);

      const targetParagraphs = captions[captionIndex - 1].paragraphs;
      return {
        captions: nextCaptions,
        nextCursorMeta: {
          captionIndex: captionIndex - 1,
          paragraphIndex: targetParagraphs.length,
          lineIndex: 0,
          wordIndex: 0,
          cursorIndex: 0
        }
      }
    }

    return null;
  }

  static concatCaptionsBackwardInCaptions(
    captions: store.ICaptionTranslatedParagraphWithId[],
    path: Required<Omit<store.IIndexPath, 'cursorIndex'>>
  ): ICaptionsConcatResult | null {

    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = path;

    let nextCaptions = [...captions];
    let caption: store.ICaptionTranslatedParagraphWithId = {
      ...captions[captionIndex]
    }

    const paragraphs = captions[captionIndex].paragraphs;
    const words = paragraphs[paragraphIndex].lines[lineIndex].words;

    if (wordIndex + 1 < words.length) {
      const nextParagraphs = ParagraphCaptionsHelper.concatWordInCaptions(
        paragraphs,
        path,
        'backward'
      );

      caption.paragraphs = [...nextParagraphs]
      nextCaptions[captionIndex] = caption;

      const targetWord = words[wordIndex];
      const targetIndex = targetWord.text.length;
      return {
        captions: nextCaptions,
        nextCursorMeta: {
          ...path,
          cursorIndex: targetIndex
        }
      };
    }

    if (paragraphIndex + 1 < paragraphs.length) {
      const nextParagraphs = ParagraphCaptionsHelper.concatParagraphInCaptions(
        captions[captionIndex].paragraphs,
        path,
        'backward'
      );

      caption.paragraphs = [...nextParagraphs]
      nextCaptions[captionIndex] = caption;


      const targetWords = captions[captionIndex].paragraphs[paragraphIndex].lines[lineIndex].words;
      const targetWord = targetWords.last();
      return {
        captions: nextCaptions,
        nextCursorMeta: {
          ...path,
          paragraphIndex: paragraphIndex,
          wordIndex: targetWords.length - 1,
          cursorIndex: targetWord.text.length
        }
      }
    }

    if (captionIndex + 1 < captions.length && captions[captionIndex + 1].paragraphs) {
      let fromCaption = { ...captions[path.captionIndex] };
      let toCaption = { ...captions[path.captionIndex + 1] }

      if (fromCaption.meta.reversTranslateStatus === "Pending" || fromCaption.meta.translatStatus === "Pending") {
        return null;
      }

      if (toCaption.meta.reversTranslateStatus === "Pending" || toCaption.meta.translatStatus === "Pending") {
        return null;
      }

      const concatCaption = TranslatedCaptionHelper.concatCaptions(fromCaption, toCaption, "forward");
      nextCaptions.splice(path.captionIndex, 2, concatCaption);

      const targetWord = captions[captionIndex].paragraphs[paragraphIndex].lines[lineIndex].words[wordIndex];
      return {
        captions: nextCaptions,
        nextCursorMeta: {
          ...path,
          cursorIndex: targetWord.text.length
        }
      }
    }

    return null;
  }

  static getCaptionIndexById(captions: store.ICaptionTranslatedParagraphWithId[], id: number) {
    for (let index = 0; index < captions.length; index++) {
      const caption = captions[index];
      if (caption.id === id) {
        return index;
      }
    }

    return -1;
  }

  static getDefaultStyleState(state: ITranslatedCaptionState, payload: Partial<store.ISetStylePayload>) {
    const { path, style } = payload;

    if (style === null) {
      return { ...state };
    }

    let nextState = {
      ...state,
      defaultStyle: style
    }

    if (path) {
      const defaultStyleCaption = TranslatedCaptionHelper.getDefaultStyleCaptions(state.captions!, path);
      nextState = {
        ...nextState,
        captions: defaultStyleCaption
      }
    }

    return nextState;
  }

  static getDefaultStyleCaptions<T extends store.ICaptionTranslatedParagraphWithId>(caption: T[], path: Omit<store.IIndexPath, "cursorIndex">) {
    const linePath = {
      lineIndex: path.lineIndex!,
      paragraphIndex: path.paragraphIndex!,
      captionIndex: path.captionIndex!
    };

    return TranslatedCaptionHelper.updateLineValue(
      caption,
      linePath,
      'style',
      null
    );
  }

  static getDefaultLocationState(state: ITranslatedCaptionState, payload: Partial<store.ISetLocationPayload>) {
    const { path, location } = payload;

    if (location === null) {
      return { ...state }
    }

    let nextState = {
      ...state,
      defaultLocation: location
    }

    if (path) {
      const linePath = {
        lineIndex: path.lineIndex!,
        paragraphIndex: path.paragraphIndex!,
      };

      const nextCaptions = TranslatedCaptionHelper.updateParagraphValues(
        state.captions!,
        linePath,
        { vertical: null, horizontal: null }
      )

      nextState = {
        ...nextState,
        captions: nextCaptions
      }
    }

    return nextState;
  }

  static updateParagraphValues<P extends store.ICaptionTranslatedParagraphWithId>(
    paragraphs: Readonly<P[]>,
    path: Readonly<Required<Pick<store.IIndexPath, 'paragraphIndex'>>>,
    updateParagraph: NullablePartial<store.ICaptionTranslatedParagraphWithId>
  ) {
    const { paragraphIndex } = path;
    let nextCaptions = [...paragraphs];
    let nextParagraph = { ...nextCaptions[paragraphIndex] };

    (Object.keys(updateParagraph) as Array<keyof store.ICaptionTranslatedParagraphWithId>).forEach(key => {
      if (updateParagraph[key] !== null) {
        //@ts-ignore
        nextParagraph[key] = updateParagraph[key];
      } else {
        delete updateParagraph[key];
      }
    });

    nextCaptions[paragraphIndex] = nextParagraph;
    return nextCaptions;
  }

  static changeTextInCaption(
    caption: store.ICaptionTranslatedParagraphWithId,
    path: Required<Omit<ICaptionEventMeta, 'captonIndex'>>,
    text: string
  ) {
    const { wordIndex, lineIndex, paragraphIndex } = path;

    caption = { ...caption };
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

    return caption;
  }

  static changeTextInCaptions(
    captions: store.ICaptionTranslatedParagraphWithId[],
    path: Required<ICaptionEventMeta>,
    text: string
  ) {
    const captionIndex = path.captionIndex;

    captions = [...captions];
    let caption = TranslatedCaptionHelper.changeTextInCaption(captions[path.captionIndex], path, text);
    captions[captionIndex] = caption;

    return captions;
  }
}
