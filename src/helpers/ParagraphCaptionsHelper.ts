import { IHighlightMeta } from 'containers/captions';
import downcapOptions from 'downcapOptions';
import { ArgumentNullError, ArgumentUndefinedError } from 'errors';
import ArrayHelper from 'lib/ArrayHelper';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';
import MathExtensions from 'MathExtensions';
import { ITimeText } from 'models';
import * as store from 'storeV2';
import IdGenerator, { IdFieldDictionary } from 'storeV2/IdGenerator';

export type NullablePartial<T> = {
  [P in keyof T]?: T[P] | null;
};

export interface IGiveIdOptions {
  overwrite?: boolean;
}

interface IOriginCpationState {
  captions?: store.ICaptionsParagraph[];
  defaultStyle?: store.ICaptionsStyle;
  defaultLocation?: store.ILocation;
}

type LineIndexPathType = Required<Pick<store.IIndexPath, 'paragraphIndex' | 'lineIndex'>>;
type WordIndexPathType = Required<Pick<store.IIndexPath, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>;

type Direction = 'forward' | 'backward';

export default class ParagraphCaptionsHelper {
  static toText(paragraphs: readonly store.ICaptionsParagraph[]): string {
    return paragraphs.reduce<string[]>(
      (acc, caption) => {
        caption.lines.forEach(line => {
          line.words.forEach(word => {
            acc.push(word.text);
          })
        });
        return acc;
      },
      []
    ).join(' ');
  }

  static getLine(paragraphs: readonly store.ICaptionsParagraph[], path: LineIndexPathType) {
    return { ...paragraphs[path.paragraphIndex].lines[path.lineIndex] }
  }

  static getWordLengthByParagraphLine(paragraphs: readonly store.ICaptionsParagraph[], path: LineIndexPathType) {
    return ParagraphCaptionsHelper.getLine(paragraphs, path).words.length;
  }

  static getPrevWordIndex(paragraphs: readonly store.ICaptionsParagraph[], path: WordIndexPathType): WordIndexPathType | null {
    if (path.wordIndex !== 0) {
      return {
        ...path,
        wordIndex: path.wordIndex - 1
      }
    }

    if (path.lineIndex !== 0) {
      const lineIndex = path.lineIndex - 1;
      const line = paragraphs[path.paragraphIndex].lines![lineIndex];
      return {
        ...path,
        lineIndex: lineIndex,
        wordIndex: line.words!.length - 1
      }
    }

    if (path.paragraphIndex !== 0) {
      const paragraphIndex = path.paragraphIndex - 1;
      const paragraph = paragraphs[paragraphIndex];

      const lineIndex = paragraph.lines!.length - 1;
      const line = paragraph.lines![lineIndex];

      return {
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: line.words!.length - 1
      }
    }

    return null;
  }

  static getNextWordIndex(paragraphs: readonly store.ICaptionsParagraph[], path: WordIndexPathType): WordIndexPathType | null {
    const paragraph = paragraphs[path.paragraphIndex];
    const lines = paragraph.lines!;
    const words = lines[path.lineIndex].words!;

    if (path.wordIndex + 1 < words.length) {
      return {
        ...path,
        wordIndex: path.wordIndex + 1
      }
    }

    if (path.lineIndex + 1 < lines.length) {
      return {
        ...path,
        lineIndex: path.lineIndex + 1,
        wordIndex: 0
      }
    }

    if (path.paragraphIndex + 1 < paragraphs.length) {
      return {
        ...path,
        paragraphIndex: path.paragraphIndex + 1,
        lineIndex: 0,
        wordIndex: 0
      }
    }

    return null;
  }

  static getWord(paragraphs: readonly store.ICaptionsParagraph[], path: WordIndexPathType): store.ICaptionsWord {
    return paragraphs[path.paragraphIndex].lines[path.lineIndex].words[path.wordIndex];
  }

  static getPrevWord(paragraphs: readonly store.ICaptionsParagraph[], path: WordIndexPathType): store.ICaptionsWord | null {
    const indexs = ParagraphCaptionsHelper.getPrevWordIndex(paragraphs, path);
    return indexs && paragraphs[indexs.paragraphIndex].lines![indexs.lineIndex].words![indexs.wordIndex];
  }

  static getNextWord(paragraphs: readonly store.ICaptionsParagraph[], path: WordIndexPathType): store.ICaptionsWord | null {
    const indexs = ParagraphCaptionsHelper.getNextWordIndex(paragraphs, path);
    return indexs && paragraphs[indexs.paragraphIndex].lines![indexs.lineIndex].words![indexs.wordIndex];
  }

  static findInclusionTimesByWords(words: store.ICaptionsWord[], time: number): IHighlightMeta | undefined {
    const start = words.first().start;
    const end = words.last().end;

    if (ComparerHelper.compareTimeAndCurrentTime({ start: start, end: end }, time) !== 0) {
      return undefined;
    }

    const wordIndex = BinarySearchHelper.findIndex(words, time, (word, time) => {
      return ComparerHelper.compareTimeAndCurrentTime({ start: word.start, end: word.end }, time);
    });

    if (wordIndex < 0) {
      return {};
    }

    return {
      wordIndex: wordIndex
    }
  }

  static concatWord(
    from: store.ICaptionsWord,
    to: store.ICaptionsWord,
    diraction: 'forward' | 'backward'
  ): store.ICaptionsWord {

    const isForward = diraction === 'forward';
    let word: store.ICaptionsWord;
    let first: store.ICaptionsWord, later: store.ICaptionsWord;

    if (isForward) {
      first = to;
      later = from;
    } else {
      first = from;
      later = to;
    }

    if (first.end > later.start) {
      throw new Error('Incorrect concat direction');
    }

    word = {
      end: later.end,
      start: first.start,
      text: `${first.text}${later.text}`,
    }

    if (to.style) {
      word = {
        ...word,
        style: { ...to.style }
      }
    }

    return {
      ...word,
      id: to.id,
    }
  }

  static concatParagraph(
    from: store.ICaptionsParagraph,
    to: store.ICaptionsParagraph,
    diraction: 'forward' | 'backward'
  ): store.ICaptionsParagraph {
    const isForward = diraction === 'forward';
    let first: store.ICaptionsParagraph, later: store.ICaptionsParagraph;

    if (isForward) {
      first = { ...from };
      later = { ...to };
    }
    else {
      first = { ...to };
      later = { ...from };
    }

    const firtLiens = [...first.lines!];
    const fristEnd = first.lines!.last().words!.last()!.end!;

    const laterStart = later.lines!.first().words!.first()!.start!;
    if (fristEnd > laterStart) {
      throw new Error('Incorrect concat direction');
    }

    const toLines = [...to.lines];
    const toFirstLine = toLines.first();

    let paragraph: store.ICaptionsParagraph = {
      id: to.id,
      lines: [{
        id: toFirstLine.id,
        style: { ...toFirstLine.style },
        words: [...firtLiens?.first().words!, ...later!.lines!.first().words!]
      }]
    }

    if (to.horizontal) {
      paragraph = {
        ...paragraph,
        horizontal: to.horizontal
      }
    }

    if (to.vertical) {
      paragraph = {
        ...paragraph,
        vertical: to.vertical
      }
    }

    return paragraph;
  }

  static concatParagraphInCaptions(
    captions: store.ICaptionsParagraph[],
    path: Required<Pick<store.IIndexPath, 'paragraphIndex'>>,
    direction: Direction
  ) {
    const concatActions = {
      "forward": _forwardConcatWordInCaptions,
      "backward": _backwardConcatWordInCaptions
    }

    captions = [...captions];
    return concatActions[direction]();

    function _forwardConcatWordInCaptions() {
      let fromParagraph = { ...captions[path.paragraphIndex] };
      let toParagraph = { ...captions[path.paragraphIndex - 1] };

      const nextParagraph = ParagraphCaptionsHelper.concatParagraph(fromParagraph, toParagraph, 'backward')
      captions.splice(path.paragraphIndex - 1, 2, nextParagraph);
      return [...captions];
    }

    function _backwardConcatWordInCaptions() {
      let fromParagraph = { ...captions[path.paragraphIndex] };
      let toParagraph = { ...captions[path.paragraphIndex + 1] };

      const nextParagraph = ParagraphCaptionsHelper.concatParagraph(fromParagraph, toParagraph, 'forward')
      captions.splice(path.paragraphIndex, 2, nextParagraph);
      return captions;
    }
  }

  static splitParagraph(
    paragraph: store.ICaptionsParagraph,
    path: Required<Pick<store.IIndexPath, 'lineIndex' | 'wordIndex' | 'cursorIndex'>>
  ): store.ICaptionsParagraph[] {

    let lines = [...paragraph.lines!];
    let line = lines![path.lineIndex];
    const words = [...line.words!];
    let firstWords = words.slice(0, path.wordIndex);
    let laterWords = words.slice(path.wordIndex + 1, words.length);

    const word = words[path.wordIndex];
    if (path.cursorIndex === 0) {
      laterWords = [words[path.wordIndex], ...laterWords];
    }
    else if (path.cursorIndex === word.text.length) {
      firstWords = [...firstWords, words[path.wordIndex]];
    }
    else {
      const dt = (word.end - word.start) / word.text.length;
      const firstWord: store.ICaptionsWord = {
        id: word.id,
        start: word.start,
        end: MathExtensions.round(word.start + (path.cursorIndex * dt), 3),
        text: word.text.slice(0, path.cursorIndex),
        confidence: word.confidence,
        style: { ...word.style }
      }
      firstWords = [...firstWords, firstWord]
      const laterWord: store.ICaptionsWord = {
        start: MathExtensions.round(word.start + (path.cursorIndex * dt), 3),
        end: word.end,
        text: word.text.slice(path.cursorIndex, word.text.length),
        confidence: word.confidence,
        style: { ...word.style }
      }

      laterWords = [laterWord, ...laterWords];
    }

    let firstLine: store.ICaptionsLine = {
      id: line.id,
      words: firstWords,
      style: { ...line.style }
    }

    let laterLine: store.ICaptionsLine = {
      style: { ...line.style },
      words: laterWords
    }

    return [
      {
        id: paragraph.id,
        horizontal: paragraph.horizontal,
        vertical: paragraph.vertical,
        lines: [firstLine]
      },
      {
        horizontal: paragraph.horizontal,
        vertical: paragraph.vertical,
        lines: [laterLine]
      },
    ]
  }


  static concatWordInCaptions(captions: store.ICaptionsParagraph[], path: WordIndexPathType, direction: Direction) {
    captions = [...captions];
    let paragraph = { ...captions[path.paragraphIndex] };
    if (paragraph.lines === undefined) {
      throw new TypeError('paragraph.lines must not be undefined.');
    }

    let lines = [...paragraph.lines]
    let line = { ...lines[path.lineIndex] }
    if (line.words === undefined) {
      throw new TypeError('line.words must not be undefined.');
    }

    let words = [...line.words!];

    const concatActions = {
      "forward": _forwardConcatWordInCaptions,
      "backward": _backwardConcatWordInCaptions
    }

    return concatActions[direction]();

    function _forwardConcatWordInCaptions() {
      const fromWord = words[path.wordIndex];
      const toWord = words[path.wordIndex - 1];
      const concatWord = ParagraphCaptionsHelper.concatWord(fromWord, toWord, 'forward');

      words.splice(path.wordIndex - 1, 2, concatWord);
      line.words = words;
      lines.splice(path.lineIndex!, 1, line);
      paragraph.lines = lines;
      captions.splice(path.paragraphIndex!, 1, paragraph);

      return captions;
    }

    function _backwardConcatWordInCaptions() {
      const fromWord = words[path.wordIndex!];
      const toWord = words[path.wordIndex! + 1];
      const concatWord = ParagraphCaptionsHelper.concatWord(fromWord, toWord, 'backward');

      words.splice(path.wordIndex!, 2, concatWord);
      line.words = words;
      lines.splice(path.lineIndex!, 1, line);
      paragraph.lines = lines;
      captions.splice(path.paragraphIndex!, 1, paragraph);

      return captions;
    }
  }

  static giveIdToWords(id: keyof IdFieldDictionary, words: store.ICaptionsWord[], options: IGiveIdOptions): store.ICaptionsWord[] {
    if (words === null) {
      throw new ArgumentNullError('words')
    }

    if (words === undefined) {
      throw new ArgumentUndefinedError('words')
    }


    const nextWords = words.map(_giveIdToCaptionsWord);
    return ArrayHelper.isFastEquals(words, nextWords) ? words : nextWords;

    function _giveIdToCaptionsWord(word: store.ICaptionsWord) {
      if (options.overwrite || word.id === undefined) {
        word = {
          ...word,
          id: IdGenerator.getNextId(id, 'paragraph')
        }
      }

      return word;
    }
  }

  static giveIdToLines(id: keyof IdFieldDictionary, lines: store.ICaptionsLine[], options: IGiveIdOptions): store.ICaptionsLine[] {
    if (lines === null) {
      throw new ArgumentNullError('lines')
    }

    if (lines === undefined) {
      throw new ArgumentUndefinedError('lines')
    }

    const nextLines = lines.map(_giveIdToCaptionsLine);
    return ArrayHelper.isFastEquals(lines, nextLines) ? lines : nextLines;

    function _giveIdToCaptionsLine(line: store.ICaptionsLine) {
      const words = line.words;
      const wordsWithId = words && ParagraphCaptionsHelper.giveIdToWords(id, words, options);

      if (wordsWithId !== words) {
        line = {
          ...line,
          words: wordsWithId
        }
      }

      if (options.overwrite || line.id === undefined) {
        line = {
          ...line,
          id: IdGenerator.getNextId(id, 'line')
        }
      }

      return line;
    }
  }

  static giveIdToCaptionsParagraph<T extends store.ICaptionsParagraph>(
    id: keyof IdFieldDictionary,
    paragraph: T,
    options: IGiveIdOptions
  ) {
    if (paragraph === null) {
      throw new ArgumentNullError('paragraph')
    }

    if (paragraph === undefined) {
      throw new ArgumentUndefinedError('paragraph')
    }

    const lines = paragraph.lines;
    const linesWithId = lines && ParagraphCaptionsHelper.giveIdToLines(id, lines, options);

    if (linesWithId !== lines) {
      paragraph = {
        ...paragraph,
        lines: linesWithId
      };
    }

    if (options.overwrite || paragraph.id === undefined) {
      paragraph = {
        ...paragraph,
        id: IdGenerator.getNextId('origin', 'paragraph')
      };
    }

    return paragraph;
  }

  static giveIdToCaptions(id: keyof IdFieldDictionary, captions: store.ICaptionsParagraph[], options: IGiveIdOptions): store.ICaptionsParagraph[] {
    if (captions === null) {
      throw new ArgumentNullError('captions')
    }

    if (captions === undefined) {
      throw new ArgumentUndefinedError('captions')
    }
    const nextCaptions = captions.map(caption => ParagraphCaptionsHelper.giveIdToCaptionsParagraph(id, caption, options));
    return ArrayHelper.isFastEquals(captions, nextCaptions) ? captions : nextCaptions;
  }

  static toTimeTexts(captions: store.ICaptionsParagraph[]) {
    return captions.reduce((acc, caption) => {
      caption.lines.forEach(line => {
        line.words.forEach(word => {
          const { id, confidence, style, ...timeText } = word;
          acc.push(timeText);
        })
      });
      return acc;
    }, [] as ITimeText[])
  }

  static toAllTextLength(captions: store.ICaptionsParagraph[]) {
    let length = 0;
    captions.forEach(caption => {
      caption.lines.forEach(line => {
        line.words.forEach(word => {
          length += word.text.length + 1;
        })
      });
    });

    return length - 1;
  }

  static textToParagrahsCaption(timeTexts: ITimeText[], splitLength = downcapOptions.defaultSplitValue.origin): store.ICaptionsParagraph[] {
    let wordLength = 0;
    let lineWords: store.ICaptionsWord[] = [];
    let paragrahs: store.ICaptionsParagraph[] = [];

    for (const timeText of timeTexts) {
      lineWords.push(timeText);
      wordLength += timeText.text.length;
      if (splitLength < wordLength) {
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

  static getParagraphStartTime(paragraph: store.ICaptionsParagraph) {
    return paragraph.lines.first().words.first().start;
  }

  static getParagraphEndTime(paragraph: store.ICaptionsParagraph) {
    return paragraph.lines.last().words.last().end;
  }

  static updateWordValue<T extends keyof store.ICaptionsWord, P extends store.ICaptionsParagraph>(
    paragraphs: Readonly<P[]>,
    path: Readonly<Required<Omit<store.IIndexPath, 'captionIndex' | 'cursorIndex'>>>,
    key: T,
    value: store.ICaptionsWord[T] | null
  ) {
    return ParagraphCaptionsHelper.updateWordValues(paragraphs, path, { [key]: value });
  }

  static updateWordValues<P extends store.ICaptionsParagraph>(
    paragraphs: Readonly<P[]>,
    path: Readonly<Required<Omit<store.IIndexPath, 'captionIndex' | 'cursorIndex'>>>,
    updateWord: Partial<store.ICaptionsWord>
  ) {
    const { paragraphIndex, lineIndex, wordIndex } = path;
    let nextCaptions = [...paragraphs];
    let nextParagraph = { ...nextCaptions[paragraphIndex] };
    let lines = nextParagraph.lines ? [...nextParagraph.lines] : []
    let line = { ...lines[lineIndex] };
    let words = line.words ? [...line.words] : [];
    let word: store.ICaptionsWord = {
      ...words[wordIndex]
    };

    (Object.keys(updateWord) as Array<keyof store.ICaptionsWord>).forEach(key => {
      if (updateWord[key] !== null) {
        if (typeof updateWord[key] === "object") {
          //@ts-ignore
          updateWord[key] = { ...updateWord[key] }
        }

        //@ts-ignore
        word[key] = updateWord[key];
      } else {
        delete word[key];
      }
    });

    words.splice(wordIndex, 1, word);
    line.words = words;
    lines.splice(lineIndex, 1, line);
    nextParagraph.lines = lines;
    nextCaptions.splice(paragraphIndex, 1, nextParagraph);

    return nextCaptions;
  }


  static updateLineValue<T extends keyof store.ICaptionsLine, K extends store.ICaptionsParagraph>(
    paragraphs: K[],
    path: Required<Omit<store.IIndexPath, 'captionIndex' | 'cursorIndex' | 'wordIndex'>>,
    key: T,
    value: store.ICaptionsLine[T] | null
  ): K[] {
    if (value !== null && typeof value === "object") {
      value = { ...(value as object) } as store.ICaptionsLine[T];
    }

    const { paragraphIndex, lineIndex } = path;
    let nextCaptions = [...paragraphs];
    let nextParagraph = { ...nextCaptions[paragraphIndex] };
    let lines = nextParagraph.lines ? [...nextParagraph.lines] : []
    let line = { ...lines[lineIndex] };

    if (value !== null) {
      line[key] = value;
    } else {
      delete line[key];
    }

    lines.splice(lineIndex, 1, line);
    nextParagraph.lines = lines;
    nextCaptions.splice(paragraphIndex, 1, nextParagraph);

    return nextCaptions;
  }

  static updateParagraphValues<P extends store.ICaptionsParagraph>(
    paragraphs: Readonly<P[]>,
    path: Readonly<Required<Pick<store.IIndexPath, 'paragraphIndex'>>>,
    updateParagraph: NullablePartial<store.ICaptionsParagraph>
  ) {
    const { paragraphIndex } = path;
    let nextCaptions = [...paragraphs];
    let nextParagraph = { ...nextCaptions[paragraphIndex] };

    (Object.keys(updateParagraph) as Array<keyof store.ICaptionsParagraph>).forEach(key => {
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

  static getCaptionIndexById<T extends store.ICaptionsParagraph>(
    paragraphs: T[],
    id: number
  ) {
    for (let index = 0; index < paragraphs.length; index++) {
      const paragraph = paragraphs[index];
      if (paragraph.id === id) {
        return index;
      }
    }
    return -1;
  }

  static getDefaultStyleState(state: IOriginCpationState, payload: Partial<store.ISetStylePayload>) {
    const { path, style } = payload;

    if (style === null) {
      return { ...state };
    }

    let nextState = {
      ...state,
      defaultStyle: style
    }

    if (path) {
      const defaultStyleCaption = ParagraphCaptionsHelper.getDefaultStyleCaptions(state.captions!, path);
      nextState = {
        ...nextState,
        captions: defaultStyleCaption
      }
    }

    return nextState;
  }

  static getDefaultStyleCaptions<T extends store.ICaptionsParagraph>(caption: T[], path: Omit<store.IIndexPath, "cursorIndex">) {
    const linePath = {
      lineIndex: path.lineIndex!,
      paragraphIndex: path.paragraphIndex!,
    };

    return ParagraphCaptionsHelper.updateLineValue(
      caption,
      linePath,
      'style',
      null
    );
  }

  static getDefaultLocationState(state: IOriginCpationState, payload: Partial<store.ISetLocationPayload>) {
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

      const nextCaptions = ParagraphCaptionsHelper.updateParagraphValues(
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

  static setWordStyle(state: IOriginCpationState, payload: store.ISetStylePayload) {
    const { path, style } = payload;
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

    return {
      ...state,
      captions: ParagraphCaptionsHelper.updateWordValue(
        state.captions!,
        wordPath,
        'style',
        style
      )
    }
  }
}